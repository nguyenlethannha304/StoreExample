from http import HTTPStatus
from django import views
from django.test import tag
from rest_framework.test import APITestCase, APIClient
from test import pick_random_object_from_queryset
from .. import setUpTestCartApp, tearDownTestCartApp
from django.contrib.auth import get_user_model
from django.apps import apps
from apps.carts.api.serializers import ProductCartSerializer
UserModel = get_user_model()
# Order models
Cart = apps.get_model('carts', 'Cart')
CartItem = apps.get_model('carts', 'CartItem')
# Product models
Product = apps.get_model('products', 'Product')
# Url
CART_APP_URL = '/api/carts/'
CART_COUNT_URL = CART_APP_URL + 'count/'
CART_URL = CART_APP_URL + ''
CART_UNAUTHORIZED_URL = CART_APP_URL + 'cart-product-information/'


def setUpModule():
    setUpTestCartApp()


def tearDownModule():
    tearDownTestCartApp()


@tag('carts', 'carts_api_view')
class TestCountView(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_authenticate_required(self):
        response = self.client.get(CART_COUNT_URL)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

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

    def test_authenticate_required(self):
        response = self.client.get(CART_URL)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

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


@tag('carts', 'carts_api_view')
class TestUnauthorizedCartView(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_request(self):
        products = Product.objects.all()
        product_id_list = [product.id.__str__() for product in products]
        product_queryparams_string = ','.join(product_id_list)
        response = self.client.get(
            f'{CART_UNAUTHORIZED_URL}?product-ids={product_queryparams_string}')
        self.assertEqual(response.status_code, HTTPStatus.OK)
