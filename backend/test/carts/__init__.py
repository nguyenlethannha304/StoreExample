from random import random
from test import pick_random_object_from_queryset

from django.apps import apps
from django.contrib.auth import get_user_model
from model_bakery import baker

from ..products import setUpTestProductApp, tearDownTestProductApp
from ..users import setUpTestUserApp, tearDownTestUserApp

UserModel = get_user_model()
# Model from orders app
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
# Model from products app
Product = apps.get_model('products', 'Product')


def setUpTestCartApp():
    # Create user with cart
    setUpTestUserApp()
    # Create product
    setUpTestProductApp()
    # Create CartItem
    setUpCartItem()


def setUpCartItem():
    '''Add item to Cart (Must be preceded by setUpTestUser() to create cart and setUpTestProduct() to create products). Will add items to the cart of first user'''
    # Prepare
    first_user = UserModel.objects.all()[0]
    cart = first_user.cart
    random_product = pick_random_object_from_queryset(Product.objects.all())
    item_cart = baker.make(CartItem, product=random_product, cart=cart)


def tearDownTestCartApp():
    # Delete user
    tearDownTestUserApp()
    # Delete products
    tearDownTestProductApp()
