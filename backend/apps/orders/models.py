from django.db import models
from django.apps import apps
from django.contrib.auth import get_user_model
from django.utils.functional import cached_property
import uuid
# Create your models here.
UserModel = get_user_model()
# Product Models
Product = apps.get_model('products', 'Product')


class Order(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(
        UserModel, on_delete=models.SET_NULL, null=True)
    item_prices = models.PositiveBigIntegerField(null=True)
    shipping_fee = models.PositiveBigIntegerField(null=True)
    total_price = models.PositiveBigIntegerField(null=True)
    phone_number = models.CharField()
    address = models.ForeignKey(
        'users.Address', on_delete=models.SET_NULL, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True)


class OrderStatus(models.model):
    STATUS_CHOICES = ()
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    order = models.ForeignKey(Order, related_name='status')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    description = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_time']


class ItemOrder(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    order = models.ForeignKey(
        Order, related_name='items', on_delete=models.SET_NULL, null=True)
    products = models.ForeignKey(
        "products.Product", on_delete=models.SET_NULL, null=True, related_name='items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.PositiveBigIntegerField(default=0)

    def calculate_price(self):
        self.price = int(self.product.price)*self.quantity
        return self.price
