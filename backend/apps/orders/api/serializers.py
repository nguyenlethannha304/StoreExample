from math import prod
from operator import itemgetter
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from ..models import ItemOrder, Order, OrderStatus, item_order_factory_method
from apps.utils.tools import validate_phonenumber
from django.apps import apps
from django.db import transaction
from django.db.models import F
# Product app models
Product = apps.get_model('products', 'Product')
Address = apps.get_model('users', 'Address')
# users app models
City = apps.get_model('users', 'City')


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ['status', 'description', 'created_time']


class OrderInformationSerializer(serializers.ModelSerializer):
    status = StatusSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'total_price', 'address', 'created_time', 'status']


class ProductForCreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'quantity']
        extra_kwargs = {'id': {'read_only': False}}


class AddressForCreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['street', 'city', 'province']

    def validate(self, data):
        # check city belongs to province
        city_exists_boolean = City.objects.filter(
            pk=data['city'].pk, province=data['province'].pk).exists()
        if not city_exists_boolean:
            raise ValidationError('Địa chỉ không hợp lệ')
        return data


class CreateOrderSerializer(serializers.Serializer):
    # Products
    products = ProductForCreateOrderSerializer(many=True)
    item_price = serializers.IntegerField(min_value=0)
    shipping_fee = serializers.IntegerField(
        min_value=0, required=False, default=0)
    total_price = serializers.IntegerField(min_value=0)
    # Contact
    address = AddressForCreateOrderSerializer(required=False)
    phone_number = serializers.CharField(required=False)
    use_profile_contact = serializers.BooleanField(default=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        assert (self.context.get('user', None)
                is not None), 'Must pass user to context'

    def validate_use_profile_contact(self, value):
        if value and self.context['user']:
            self.user_address = self.context['user'].address
            if self.is_address_or_phone_invalid(self.user_address, self.context['user'].phone):
                raise ValidationError(
                    'Thông tin liên lạc người dùng không hợp lệ')
        return value

    def is_address_or_phone_invalid(self, address, phone):
        if bool(address) and phone:
            return False
        return True

    def validate_phone_number(self, value):
        if not validate_phonenumber(value):
            raise serializers.ValidationError("Số điện thoại không hợp lệ")
        return value

    def validate(self, data):
        self.product_list_id = self.get_product_list_id(data)
        self.product_dict = self.get_product_dict(data)
        self.product_query = self.get_product_query()
        self.validate_must_supply_address_or_use_profile_contact(data)
        self.validate_quantity_value(self.product_query)
        self.validate_item_price_value(self.product_query, data['item_price'])
        return data

    def get_product_list_id(self, data):
        '''Get the list of product id from data'''
        rv = []
        for product in data['products']:
            rv.append(product['id'])
        return rv

    def get_product_dict(self, data):
        '''return {'id' : 'quantity'} dict from data '''
        rv = {}
        for product in data['products']:
            rv[product['id']] = product['quantity']
        return rv

    def get_product_query(self):
        queryset = Product.objects.filter(pk__in=self.product_list_id)
        queryset = queryset.only('id', 'quantity', 'price')
        return queryset.select_for_update()

    def validate_must_supply_address_or_use_profile_contact(self, data):
        if not data['use_profile_contact'] and not (data['address'] or data['phone_number']):
            raise ValidationError('Thiếu thông tin giao hàng')

    def validate_quantity_value(self, product_query):
        '''quantity in data <= quantity in query db'''
        for product in product_query:
            data_quantity = self.product_dict[product.pk]
            if data_quantity > product.quantity:
                raise ValidationError('Không đủ sản phẩm trong kho')

    def validate_item_price_value(self, product_query, data_item_price):
        '''item_price in data == item_price in query db'''
        query_product_price = 0
        for product in product_query:
            quantity = self.product_dict[product.pk]
            query_product_price += product.price*quantity
        if query_product_price != data_item_price:
            raise ValidationError("Giá hàng hoá đã thay đổi")

    def save(self):
        order = self.create_order()
        self.create_order_items(order)
        return order

    def create_order(self):
        item_price, shipping_fee, total_price = itemgetter(
            'item_price', 'shipping_fee', 'total_price', )(self.validated_data)
        address = self.get_address()
        phone_number = self.get_phone_number()
        order = Order.objects.create(
            item_price=item_price, shipping_fee=shipping_fee, total_price=total_price, phone_number=phone_number, address=address)
        return order

    def create_order_items(self, order):
        product_query = self.product_query
        for product in product_query:
            quantity = self.product_dict[product.id]
            # Subtract quantity in db
            Product.objects.filter(pk=product.pk).update(
                quantity=F('quantity') - quantity)
            # Create new order item
            new_item_order = item_order_factory_method(
                order, product, quantity)
        return order

    def get_phone_number(self):
        if self.validated_data['use_profile_contact']:
            return self.context['user'].phone
        return self.validated_data['phone_number']

    def get_address(self):
        if self.validated_data['use_profile_contact']:
            return self.user_address  # Create from validate_use_profile_contact
        return Address.objects.create(**self.validated_data['address'])
