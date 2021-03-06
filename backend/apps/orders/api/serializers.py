from operator import itemgetter

from django.apps import apps
from django.db.models import F
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.users.api.serializers import AddressSerializer
from apps.utils.tools import validate_phonenumber

from ..models import Order, OrderState, item_order_factory_method

# Product app models
Product = apps.get_model('products', 'Product')
Address = apps.get_model('users', 'Address')
# users app models
City = apps.get_model('users', 'City')


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderState
        fields = ['state', 'description', 'created_time']


class ProductForCreateOrderSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=0)
    price = serializers.IntegerField(min_value=0)


class AddressForCreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['street', 'city', 'province']

    def validate(self, data):
        # check city belongs to province
        if(data['street'] != '' and data['city'] != None and data['province'] != None):
            city_exists_boolean = City.objects.filter(
                pk=data['city'].pk, province=data['province'].pk).exists()
            if not city_exists_boolean:
                raise ValidationError('Địa chỉ không hợp lệ')
        return data


class OrderInformationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Order
        fields = [
            'id', 'item_price', 'shipping_fee',
            'total_price', 'phone_number', 'created_time', 'address']


class ListOrderSerializer(serializers.ModelSerializer):
    # Used for AllUserOrderView
    class Meta:
        model = Order
        fields = ['id', 'total_price', 'created_time']


class CreateOrderSerializer(serializers.Serializer):
    # Products
    products = ProductForCreateOrderSerializer(many=True)
    item_price = serializers.IntegerField(min_value=0)
    shipping_fee = serializers.IntegerField(
        min_value=0, required=False, default=0)
    total_price = serializers.IntegerField(min_value=0)
    # Contact
    email = serializers.EmailField(required=False, allow_blank=True)
    address = AddressForCreateOrderSerializer(required=False)
    phone_number = serializers.CharField(required=False,  allow_blank=True)
    use_profile_contact = serializers.BooleanField(
        default=False)

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
        if value and not validate_phonenumber(value):
            raise serializers.ValidationError("Số điện thoại không hợp lệ")
        return value

    def validate(self, data):
        self.product_list_id = self.get_product_list_id(data)
        self.product_dict = self.get_product_dict(data)
        self.product_query = self.get_product_query()
        self.validate_must_supply_address_or_use_profile_contact(data)
        self.validate_quantity_value(self.product_query)
        self.validate_item_price_value(self.product_query, data)
        return data

    def get_product_list_id(self, data):
        '''Get the list of product id from data'''
        rv = []
        for product in data['products']:
            rv.append(product['id'])
        return rv

    def get_product_dict(self, data):
        '''return {'id' : ('quantity', 'price')} dict from data '''
        rv = {}
        for product in data['products']:
            rv[product['id']] = (product['quantity'], product['price'])
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
            data_quantity = self.product_dict[product.pk][0]
            if data_quantity > product.quantity:
                raise ValidationError('Không đủ sản phẩm trong kho')

    def validate_item_price_value(self, product_query, data):
        '''item_price in data == item_price in query db'''
        query_product_price = 0
        for product in product_query:
            data_quantity = self.product_dict[product.pk][0]
            data_price = self.product_dict[product.pk][1]
            query_price = product.price*data_quantity
            if query_price != data_price:
                raise ValidationError('Giá hàng hoá đã thay đổi')
            query_product_price += product.price*data_quantity
        if query_product_price != data['item_price']:
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
        email = self.get_email()
        order = Order.objects.create(email=email,
                                     item_price=item_price, shipping_fee=shipping_fee, total_price=total_price, phone_number=phone_number, address=address)
        return order

    def create_order_items(self, order):
        product_query = self.product_query
        for product in product_query:
            quantity = self.product_dict[product.id][0]
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

    def get_email(self):
        if self.validated_data['use_profile_contact']:
            return self.context['user'].email
        return self.validated_data['email']
