from test.orders import setUpTestOrderApp, tearDownTestOrderApp
from apps.orders.api.serializers import CreateOrderSerializer
from rest_framework.test import APITestCase
from django.test import tag
from django.apps import apps
import random
from test import pick_random_object_from_queryset
import copy
from . import setFakeData
# Product model
Product = apps.get_model('products', 'Product')
# user app models
Address = apps.get_model('users', 'Address')
City = apps.get_model('users', 'City')
Province = apps.get_model('users', 'Province')
# order app models
Order = apps.get_model('orders', 'Order')
ItemOrder = apps.get_model('orders', 'ItemOrder')


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('orders', 'order_serializer')
class TestStatusSerializer(APITestCase):
    pass


@tag('orders', 'order_serializer')
class TestOrderInformationSerializer(APITestCase):
    pass


@tag('orders', 'order_serializer')
class TestProductForCreateOrderSerializer(APITestCase):
    pass


@tag('orders', 'order_serializer', 'cr')
class TestAddressForCreateOrderSerializer(APITestCase):
    def test_city_belongs_to_province(self):
        province1 = Province.objects.all()[0]
        province2 = Province.objects.all()[1]
        city_of_province1 = province1.cities


@tag('orders', 'order_serializer')
class TestCreateOrderSerializer(APITestCase):
    def setUp(self):
        self.fake_data = setFakeData()

    def test_serializer_with_no_errors(self):
        self.serializer_process()

    def test_product_quantity_in_db_decrease_accordingly(self):
        pass

    def test_use_user_contact(self):
        pass

    def serializer_process(self):
        serializer = CreateOrderSerializer(
            data=self.fake_data, context={'user': False})
        serializer.is_valid()
        serializer.save()
