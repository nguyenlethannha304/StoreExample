from django.db import models
from django.apps import apps
from django.db.models import constraints, Q
from django.contrib.auth import get_user_model
from django.utils.functional import cached_property
import uuid
# Create your models here.
UserModel = get_user_model()


class Order(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    item_price = models.PositiveBigIntegerField(default=0)
    shipping_fee = models.PositiveBigIntegerField(default=0)
    total_price = models.PositiveBigIntegerField(default=0)
    phone_number = models.CharField(max_length=12)
    address = models.ForeignKey(
        'users.Address', related_name='+', on_delete=models.SET_NULL, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    completed_time = models.DateTimeField(null=True)

    class Meta:
        constraints = [constraints.CheckConstraint(check=Q(item_price__gte=0), name='Giá hàng hoá phải lớn hơn hoặc bằng không'), constraints.CheckConstraint(check=Q(
            shipping_fee__gte=0), name='Giá phải lớn hơn hoặc bằng không'), constraints.CheckConstraint(check=Q(total_price__gte=0), name='Giá tiền phải lớn hơn hoặc bằng không')]


class UserOrder(models.Model):
    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name='orders')
    orders = models.ManyToManyField(Order, related_name='+')


class OrderStatus(models.Model):
    STATUS_CHOICES = [('PE', 'Pending')]
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    order = models.ForeignKey(
        Order, related_name='status', on_delete=models.CASCADE)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    description = models.TextField(blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_time']


def item_order_factory_method(order, product, quantity):
    item_order = ItemOrder(order=order, product=product, quantity=quantity)
    item_order.calculate_price()
    return item_order.save()


class ItemOrder(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    order = models.ForeignKey(
        Order, related_name='items', on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(
        "products.Product", on_delete=models.SET_NULL, null=True, related_name='items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.PositiveBigIntegerField(default=0)

    def calculate_price(self):
        self.price = self.product.price*self.quantity
        return self.price

    class Meta:
        unique_together = ['order', 'product']
        constraints = [models.UniqueConstraint(
            fields=['order', 'product'], name='Trùng sản phẩm'), constraints.CheckConstraint(check=Q(price__gte=0), name='phải lớn hơn hoặc bằng không'), constraints.CheckConstraint(check=Q(quantity__gte=1), name='Số lượng phải lớn hơn không')]
