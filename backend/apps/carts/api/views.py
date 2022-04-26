from rest_framework import views
from ..models import Cart, CartItem, Order, ItemOrder
from .serializers import *
from rest_framework.response import Response
from django.db.models import F, Prefetch
from django.db import IntegrityError
from django.conf import settings
from django.apps import apps
import json
from http import HTTPStatus
from operator import itemgetter
# Product Model
Product = apps.get_model('products', 'Product')


def count_product_in_cart(user):
    # Count product in cart (Json format)
    count = Cart.objects.get(user=user).count
    if count < 0:
        count = Cart.calculate_count_attribute_by_cart_items(user)
    return json.dumps(count)


class CartCountView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Get count attribute of cart
        count = count_product_in_cart(request.user)
        return Response(data=count)


api_cart_count_view = CartCountView.as_view()


class CartView(views.APIView):
    def redirect_to_get_request(self):
        return Response(status=HTTPStatus.SEE_OTHER, headers={'Location': '/cart/'})

    def delete(self, request, *args, **kwargs):
        # Delete item from the cart
        cart_id = request.user.pk
        cartitem_id = request.data['cartitem_id']
        query_result = CartItem.objects.filter(
            pk=cartitem_id, cart_id=cart_id).delete()
        if query_result:
            # Delete successfully
            return Response(status=HTTPStatus.OK)
        return self.redirect_to_get_request()

    def post(self, request, *args, **kwargs):
        # Add cart item to the cart (Or increase quantity if cart_item exist)
        data = {'product_id': request.data['product_id'],
                'cart_id': request.user.pk, 'quantity': request.data.get('quantity', 1)}
        serializer = CartItemClientSerializer(data=data)
        if serializer.is_valid():
            serializer.create_new_cart_item()
            return Response(status=HTTPStatus.OK)
        return Response(data=json.dumps(serializer.errors), status=HTTPStatus.BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        # Change quantity of cart_item in the cart
        data = {'id': request.data['cartitem_id'],
                'quantity': request.data['quantity'], 'cart_id': request.user.pk}
        serializer = CartItemClientSerializer(data=data)
        if serializer.is_valid():
            query_result = serializer.update_quantity_of_cart_item()
            if query_result:
                # Update successfully
                return Response(status=HTTPStatus.OK)
        return self.redirect_to_get_request()

    def get(self, request, *args, **kwargs):
        # Get items of the cart
        queryset = self.get_cart_item_queryset(
            request, *args, **kwargs)
        serializer = CartItemForCartViewSerializer(queryset, many=True)
        return Response(data=serializer.data)

    def get_cart_item_queryset(self, request, *args, **kwargs):
        # Get cart items and its related product
        queryset = CartItem.objects.filter(
            cart__pk=request.user.pk).select_related('product')
        # Get only fields needed for the view
        queryset = queryset.only('id', 'quantity', 'product__id', 'product__name',
                                 'product__price', 'product__quantity', 'product__thumbnail')
        return queryset


api_cart_view = CartView.as_view()
