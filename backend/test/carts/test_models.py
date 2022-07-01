from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase, tag

from . import setUpTestCartApp, tearDownTestCartApp

# Get models
UserModel = get_user_model()
# Models of orders app
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
# Models of products app
Product = apps.get_model('products', 'Product')


def setUpModule():
    setUpTestCartApp()


def tearDownModule():
    tearDownTestCartApp()


@tag('carts', 'carts_model')
class TestCart(TestCase):
    def test_clear_cart_method(self):
        cart = UserModel.objects.all()[0].cart
        # Cart with 1 item
        self.assertEqual(cart.count, 1)
        # After call clear_cart
        cart.clear_cart()
        cart.refresh_from_db()
        self.assertEqual(cart.count, 0)


@tag('carts', 'carts_model')
class TestCartItem(TestCase):
    def test_same_product_must_not_appear_twice_in_cart(self):
        existed_cart_item = CartItem.objects.first()
        # Another cart item with same product and cart foreignkey
        invalid_quantity_cart_item = CartItem(
            product=existed_cart_item.product, cart=existed_cart_item.cart)
        # Exception raise when save to db
        with self.assertRaises(IntegrityError):
            invalid_quantity_cart_item.save()
