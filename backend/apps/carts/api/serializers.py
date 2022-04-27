from operator import itemgetter
from urllib import request
from django.db import IntegrityError
from django.apps import apps
from pkg_resources import require
from rest_framework import serializers
from django.db.models import F, Q
from ..models import Cart, CartItem
#
Product = apps.get_model('products', 'Product')


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'
        extra_kwargs = {'count': {'min_value': 0}}


class CartItemClientSerializer(serializers.ModelSerializer):
    '''Used to deserializer information from client to backend server'''
    cart_id = serializers.UUIDField(required=False)  # Extract from user.pk
    product_id = serializers.UUIDField(required=False)

    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'cart_id', 'product_id']
        extra_kwargs = {'id': {'validators': {}}}

    def create_new_cart_item(self):
        cart_id, product_id, quantity = itemgetter(
            'cart_id', 'product_id', 'quantity')(self.validated_data)
        CartItem.create_new_cart_item_or_update(cart_id, product_id, quantity)

    def update_quantity_of_cart_item(self):
        cartitem_id, cart_id, quantity = itemgetter(
            'id', 'cart_id', 'quantity')(self.validated_data)
        query_result = CartItem.objects.filter(
            pk=cartitem_id, cart_id=cart_id).update(quantity=quantity)
        return query_result


class ProductCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'quantity', 'thumbnail']


class CartItemForCartViewSerializer(serializers.ModelSerializer):
    product = ProductCartSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'product']
