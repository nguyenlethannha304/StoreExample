from apps.orders.api.serializers import AddressForCreateOrderSerializer
from test.orders import setUpTestOrderApp, tearDownTestOrderApp
from apps.orders.api.serializers import CreateOrderSerializer
from rest_framework.test import APITestCase
from django.test import tag
from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
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
UserModel = get_user_model()
# order app models
Order = apps.get_model('orders', 'Order')
OrderItem = apps.get_model('orders', 'OrderItem')


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('orders', 'order_serializer')
class TestAddressForCreateOrderSerializer(APITestCase):
    def test_city_not_belongs_to_province(self):
        province1 = Province.objects.first()
        province2 = Province.objects.last()
        city_of_province1 = province1.cities.first()
        invalid_data = {'street': '1234', 'province': province2.pk,
                        'city': city_of_province1.pk}
        serializer = AddressForCreateOrderSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

    def test_city_belongs_to_province(self):
        province1 = Province.objects.first()
        city_of_province1 = province1.cities.first()
        valid_data = {'street': '1234', 'province': province1.pk,
                      'city': city_of_province1.pk}
        serializer = AddressForCreateOrderSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())


@tag('orders', 'order_serializer')
class TestCreateOrderSerializer(APITestCase):
    def setUp(self):
        self.fake_data = setFakeData()

    def test_serializer_with_no_errors(self):
        self.serializer_process()

    def test_product_quantity_in_db_decrease_accordingly(self):
        product_list = []
        for product_dict in self.fake_data['products']:
            product_list.append(Product.objects.get(pk=product_dict['id']))
        self.serializer_process()
        for product_dict, product in zip(self.fake_data['products'], product_list):
            previous_process_quantity = product.quantity
            product.refresh_from_db()
            after_process_quantity = product.quantity
            self.assertEqual(previous_process_quantity -
                             product_dict['quantity'], after_process_quantity)

    def test_use_profile_contact_in_order(self):
        user = UserModel.objects.first()
        user.phone = '0979311359'
        user.save()
        address = self.add_user_address(user.address)
        self.fake_data['use_profile_contact'] = True
        order = self.serializer_process(user)
        self.assertEqual(user.address, order.address)

    def add_user_address(self, address):
        address.province = Province.objects.first()
        address.city = Province.objects.first().cities.first()
        address.street = '1234 random St'
        return address.save()

    def serializer_process(self, user=AnonymousUser):
        serializer = CreateOrderSerializer(
            data=self.fake_data, context={'user': user})
        serializer.is_valid()
        order = serializer.save()
        return order
