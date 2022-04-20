from itertools import product
from urllib import response
from rest_framework.test import APIClient, APITestCase
from django.test import tag
from rest_framework.renderers import JSONRenderer
from http import HTTPStatus

from apps.products.api.serializers import Product
from .. import pick_random_object_from_queryset, setUpTestProduct, tearDownTestProduct
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
SIMILAR_PRODUCT = PRODUCT_APP_URL + 'similar_product/'  # Add id type to complete


def setUpModule():
    setUpTestProduct()


def tearDownModule():
    tearDownTestProduct()


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
        product_len = len(products)
        self.product_id = products[randint(0, product_len - 1)].id

    def test_get_request(self):
        url = PRODUCT_DETAIL + f'{self.product_id}/'
        response = self.client.get(url)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)


@tag('product', 'product_view')
class TestSimilarProductView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.random_type = pick_random_object_from_queryset(Type.objects.all())

    def test_get_request(self):
        url = SIMILAR_PRODUCT + f'{self.random_type.id}/'
        response = self.client.get(url)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_get_request_fail(self):
        url = SIMILAR_PRODUCT + '15/'  # NonExist type_id
        response = self.client.get(url)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)
