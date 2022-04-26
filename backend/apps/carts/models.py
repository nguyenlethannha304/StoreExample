from django.utils.functional import cached_property
from secrets import choice
from django.db import IntegrityError, models, transaction
from django.db.models import F, Q
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model
import uuid
from django.core.serializers.json import DjangoJSONEncoder
UserModel = get_user_model()
# Create your models here.


class Cart(models.Model):
    user = models.OneToOneField(
        UserModel, primary_key=True, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=0)

    @classmethod
    def change_cart_count(cls, id, number=1):
        '''Use negative number for subtract'''
        try:
            cls.objects.filter(pk=id).update(count=F('count') + number)
        except IntegrityError:
            # When count attribute negative, recount it by couting number of actual CartItem
            cls.calculate_count_attribute_by_cart_items(id)

    @classmethod
    def calculate_count_attribute_by_cart_items(cls, id):
        cart = cls.objects.get(pk=id)
        cart.count = CartItem.objects.filter(cart=cart).count()
        cart.save()
        return cart.count

    def clear_cart(self):
        query_result = CartItem.objects.filter(cart=self).delete()
        return query_result

    class Meta:
        constraints = [models.CheckConstraint(
            check=Q(count__gte=0), name="Số lượng không được nhỏ hơn 0")]


class CartItem(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    product = models.ForeignKey(
        'products.Product', related_name='cart_items', on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, related_name='items',
                             on_delete=models.CASCADE)
    quantity = models.IntegerField(
        default=1, validators=[MinValueValidator(1, 'Số lượng không được nhỏ hơn 1')])

    class Meta:
        unique_together = ['cart', 'product']
        constraints = [models.CheckConstraint(
            check=Q(quantity__gte=1), name='Số lượng không được nhỏ hơn 1')]

    @classmethod
    def create_new_cart_item_or_update(cls, cart_id, product_id, quantity):
        try:
            cls.objects.create(
                product_id=product_id, cart_id=cart_id, quantity=quantity)
        except IntegrityError:
            # Case: cart item already exist in the cart
            cls.update_cart_item(cart_id, product_id, quantity)

    @classmethod
    def update_cart_item(cls, cart_id, product_id, quantity):
        cls.objects.filter(cart_id=cart_id, product=product_id, quantity=quantity).update(
            quantity=F('quantity') + quantity)


class Order(models.Model):
    ORDER_STATUS = [
        ('P', 'Pending'),   # After submit
    ]
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    status = models.CharField(max_length=1, choices=ORDER_STATUS)
    user = models.ForeignKey(
        UserModel, on_delete=models.SET_NULL, null=True)
    item_prices = models.PositiveBigIntegerField(null=True)
    shipping_fee = models.PositiveBigIntegerField(null=True)
    total_price = models.PositiveBigIntegerField(null=True)
    address = models.ForeignKey(
        'users.Address', on_delete=models.SET_NULL, null=True)
    created_date = models.DateTimeField()
    completed_date = models.DateTimeField(null=True)
    number_of_item = models.IntegerField(default=0)

    @ cached_property
    def items_of_order(self):
        return ItemOrder.objects.filter(order=self.id).select_related('product')

    @ cached_property
    def caculate_item_prices(self):
        self.item_prices = 0
        for item in self.items_of_order:
            self.item_prices += item.caculate_price()
        return self.item_prices

    @ cached_property
    def caculate_shipping_fee(self):
        self.shipping_fee = 0
        for item in self.items_of_order:
            self.shipping_fee += item.caculate_shipping_fee()
        return self.shipping_fee

    def caculate_total_order_price(self):
        return self.caculate_item_prices + self.caculate_shipping_fee

    def update_item_to_db(self):
        ItemOrder.objects.bulk_update(
            self.items_of_order, ['price', 'shipping_fee'])

    def save_order_to_db(self, *args, **kwargs):
        self.update_item_to_db()
        return super().save(*args, **kwargs)


class ItemOrder(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    order = models.ForeignKey(
        Order, related_name='items', on_delete=models.SET_NULL, null=True)
    products = models.ForeignKey(
        "products.Product", on_delete=models.SET_NULL, null=True, related_name='items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.PositiveBigIntegerField(null=True)
    shipping_fee = models.PositiveBigIntegerField(default=0)

    def caculate_price(self):
        self.price = self.product.price * self.quantity
        return self.price

    def caculate_shipping_fee(self):
        return 0
