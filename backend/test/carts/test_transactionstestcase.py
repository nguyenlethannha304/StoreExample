from django.apps import apps
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase, tag

from . import setUpTestCartApp, tearDownTestCartApp

# Get models
UserModel = get_user_model()
# Models of orders app
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
# Models of products app
Product = apps.get_model('products', 'Product')


@tag('carts', 'carts_trans')
class TestCartModel(TransactionTestCase):
    def setUp(self) -> None:
        setUpTestCartApp()

    def tearDown(self) -> None:
        tearDownTestCartApp()

    def test_try_change_cart_count_to_negative(self):
        cart = UserModel.objects.all()[0].cart
        Cart.change_cart_count(cart.user, -5)
        cart.refresh_from_db()
        self.assertEqual(cart.count, 1)
