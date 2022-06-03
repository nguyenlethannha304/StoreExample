from secrets import choice
from django.db import IntegrityError, models
from django.db.models import F, Q
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model
import uuid
UserModel = get_user_model()
# Create your models here.


class Cart(models.Model):
    user = models.OneToOneField(
        UserModel, primary_key=True, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return '%s' % (self.user.email)

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
