from django.test import TestCase, tag
from django.contrib.auth import get_user_model
from django.apps import apps
from model_bakery import baker
from test import pick_random_object_from_queryset
from . import setUpTestOrderApp, tearDownTestOrderApp
# Get models
UserModel = get_user_model()
# Models of orders app
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
Order = apps.get_model('carts', 'Order')
ItemOrder = apps.get_model('carts', 'ItemOrder')
# Models of products app
Product = apps.get_model('products', 'Product')


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('carts', 'carts_signals')
class TestCartModel(TestCase):

    def test_cart_count_increase_when_add_new_itemcart(self):
        cart_of_second_user = UserModel.objects.all()[1].cart
        self.assertEqual(cart_of_second_user.count, 0)
        # Add cart_item to the cart
        random_product = pick_random_object_from_queryset(
            Product.objects.all())
        cart_item = baker.make(
            CartItem, cart=cart_of_second_user, product=random_product)
        # refresh cart instance and check count attribute
        cart_of_second_user.refresh_from_db()
        self.assertEqual(cart_of_second_user.count, 1)

    def test_cart_count_decrease_when_delete_itemcart(self):
        # Cart of first user have 1 item (From setUpTestCart())
        cart_of_first_user = UserModel.objects.all()[0].cart
        self.assertEqual(cart_of_first_user.count, 1)
        # Delete cartItem
        CartItem.objects.filter(cart=cart_of_first_user).delete()
        # refresh cart instance and check count attribute
        cart_of_first_user.refresh_from_db()
        self.assertEqual(cart_of_first_user.count, 0)
