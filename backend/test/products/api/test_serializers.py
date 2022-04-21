from django.apps import apps
from rest_framework.test import APITestCase
from rest_framework.renderers import JSONRenderer
from django.test import tag
from django.utils.text import slugify
from model_bakery import baker
from apps.products.api.serializers import *
from .. import setUpTestProductApp, tearDownTestProductApp
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')
tag('products')


def setUpModule():
    setUpTestProductApp()


def tearDownModule():
    tearDownTestProductApp()


@tag('product', 'product_serializer')
class TestTypeSerializer(APITestCase):
    def test_data_contains_slug_and_name(self):
        types = Type.objects.all()
        serializer = TypeSerializer(types, many=True)
        a_type_serializer_data = serializer.data[0]
        self.assertIn('name', a_type_serializer_data)
        self.assertIn('slug', a_type_serializer_data)


@tag('product', 'product_serializer')
class TestCategoryNestingTypesSerializer(APITestCase):
    def test_data_contains_slug_and_name(self):
        categories = Category.objects.all()
        serializer = CategoryNestingTypesSerializer(categories, many=True)
        a_category_serializer_data = serializer.data[0]
        self.assertIn('name', a_category_serializer_data)
        self.assertIn('types', a_category_serializer_data)


@tag('product', 'product_serializer')
class TestProductListSerializer(APITestCase):
    def test_data_contains_id_price_thumbnail(self):
        products = Product.objects.all().values('id', 'price', 'thumbnail')
        serializer = ProductListSerializer(products, many=True)
        a_product_serializer_data = serializer.data[0]
        self.assertIn('id', a_product_serializer_data)
        self.assertIn('price', a_product_serializer_data)
        self.assertIn('thumbnail', a_product_serializer_data)
