from http import HTTPStatus
from django.test import tag
from rest_framework.test import APITestCase, APIClient
from test import pick_random_object_from_queryset
from .. import setUpTestOrderApp, tearDownTestOrderApp
from django.contrib.auth import get_user_model
from django.apps import apps
UserModel = get_user_model()
# Order models
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
Order = apps.get_model('carts', 'Order')
ItemOrder = apps.get_model('carts', 'ItemOrder')
# Product models
Product = apps.get_model('products', 'Product')
# Url
CART_APP_URL = '/api/carts/'
CART_COUNT_URL = CART_APP_URL + 'count/'
CART_URL = CART_APP_URL + ''


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('carts', 'carts_api_view')
class TestCountView(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_count_view_1_item(self):
        user_with_one_item = UserModel.objects.all()[0]
        self.client.force_authenticate(user=user_with_one_item)
        response = self.client.get(CART_COUNT_URL)
        self.assertEqual(int(response.data), 1)

    def test_count_view_0_item(self):
        user_with_0_item = UserModel.objects.all()[1]
        self.client.force_authenticate(user=user_with_0_item)
        response = self.client.get(CART_COUNT_URL)
        self.assertEqual(int(response.data), 0)


@tag('carts', 'carts_api_view')
class TestCartView(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_delete_request(self):
        user_with_one_item = UserModel.objects.all()[0]
        self.client.force_authenticate(user=user_with_one_item)
        item_cart_of_user = CartItem.objects.filter(
            cart__user=user_with_one_item)[0]
        response = self.client.delete(
            CART_URL, data={'cartitem_id': item_cart_of_user.pk})
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_post_request(self):
        user_with_0_item = UserModel.objects.all()[1]
        self.client.force_authenticate(user=user_with_0_item)
        random_product = pick_random_object_from_queryset(
            Product.objects.all())
        response = self.client.post(
            CART_URL, data={'product_id': random_product.pk})
        self.assertEqual(user_with_0_item.cart.count, 1)

    def test_put_request(self):
        user_with_1_item = UserModel.objects.all()[0]
        self.client.force_authenticate(user=user_with_1_item)
        cart_item = user_with_1_item.cart.items.first()  # cart_item of user's cart
        new_quantity = 5
        response = self.client.put(
            CART_URL, data={'cartitem_id': cart_item.id, 'quantity': new_quantity})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        cart_item.refresh_from_db()
        self.assertEqual(cart_item.quantity, new_quantity)

    def test_get_request(self):
        user_with_1_item = UserModel.objects.all()[0]
        self.client.force_authenticate(user=user_with_1_item)
        response = self.client.get(CART_URL)
        self.assertEqual(response.status_code, HTTPStatus.OK)
