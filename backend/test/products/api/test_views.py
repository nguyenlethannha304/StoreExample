from rest_framework.test import APIClient, APITestCase
from django.test import tag
from rest_framework.renderers import JSONRenderer
from http import HTTPStatus

from apps.products.api.serializers import Product
from .. import setUpForProductsTest, tearDownForProductsTest
from django.apps import apps
from random import randint
# Get Model of products app
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')
# Url of products app
PRODUCT_APP_URL = '/api/products/'
MENU_BAR_URL = PRODUCT_APP_URL + 'menuBar/'
PRODUCT_LIST_URL = PRODUCT_APP_URL + 't/'  # Add slug of a type to complete url
PRODUCT_DETAIL = PRODUCT_APP_URL + ''  # Add uuid of a product to complete url


def setUpModule():
    setUpForProductsTest()


def tearDownModule():
    tearDownForProductsTest()


@tag('product', 'product_view')
class TestCategoryNestingTypesListView(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_request(self):
        response = self.client.get('/api/products/menuBar/')
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)


@tag('product', 'product_view',)
class TestProductListView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        types = Type.objects.all()
        self.type = types[randint(0, len(types) - 1)]

    def test_get_request(self):
        url = PRODUCT_LIST_URL + f'{self.type.slug}/'
        response = self.client.get(url)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)


@tag('product', 'product_view')
class TestProductDetailView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        products = Product.objects.all()
        self.product_id = products[randint(0, len(products)) - 1].id

    def test_get_request(self):
        url = PRODUCT_DETAIL + f'{self.product_id}/'
        response = self.client.get(url)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)
