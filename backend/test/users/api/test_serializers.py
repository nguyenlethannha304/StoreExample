from django.conf import settings
from apps.users.api.serializers import *
from rest_framework import serializers
from rest_framework.test import APITestCase, APIClient, APIRequestFactory
from django.test import tag, RequestFactory
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from apps.users.models import Province, City, Address
from test.utils import new_data_with_change
from django.contrib.auth.models import AnonymousUser
from apps.users.forms import uniform_phone_field
from model_bakery import baker
from .. import setUpTestUserApp, tearDownTestUserApp
UserModel = get_user_model()


def setUpModule():
    setUpTestUserApp()


def tearDownModule():
    tearDownTestUserApp()


@tag('user', 'user_api_serializer')
class TestUserCreationSerializer(APITestCase):
    valid_data = {'email': 'new_user@gmail.com',
                  'password1': '12345678', 'password2': '12345678'}

    def test_create_user(self):
        serializer = UserCreationSerializer(data=self.valid_data)
        # Check form valid
        self.assertTrue(serializer.is_valid())
        serializer.save()
        # Check user was created
        self.assertTrue(UserModel.objects.filter(
            email='new_user@gmail.com').exists())

    def test_create_user_with_mismatch_password(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'password1', '87654321')
        serializer = UserCreationSerializer(data=invalid_data)
        # Check form invalid
        self.assertFalse(serializer.is_valid())
        # Check error password_mismatch
        error = serializer.errors['non_field_errors'][0]
        self.assertEqual(error.code, 'password_mismatch')

    def test_create_duplicate_user(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'email', 'testing_user@gmail.com')
        serializer = UserCreationSerializer(data=invalid_data)
        # Check form invalid
        self.assertFalse(serializer.is_valid())
        # Check error registed
        error = serializer.errors['email'][0]
        self.assertEqual(error.code, 'registed')


@tag('user', 'user_api_serializer')
class TestPasswordChangeSerializer(APITestCase):

    def setUp(self):
        self.valid_data = {'old_password': '12345678',
                           'new_password1': 'new_password', 'new_password2': 'new_password'}
        self.user = UserModel.objects.get(email='testing_user@gmail.com')
        # Assign user to request, used for argument in serializer init
        self.request = APIRequestFactory()
        self.request.user = self.user

    def test_must_login_or_raise_assertion_error(self):
        self.request = APIRequestFactory()
        self.request.user = AnonymousUser()
        with self.assertRaises(AssertionError):
            serializer = PasswordChangeSerializer(
                self.request, data=self.valid_data)

    def test_change_password_user(self):
        serializer = PasswordChangeSerializer(
            self.request, data=self.valid_data)
        # Check form valid
        self.assertTrue(serializer.is_valid())
        serializer.save()
        # Check user new password
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(
            self.valid_data['new_password1']))

    def test_error_incorect_old_password(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'old_password', 'incorrectpassword')
        serializer = PasswordChangeSerializer(self.request, data=invalid_data)
        # Check form invalid
        self.assertFalse(serializer.is_valid())
        # Check error password_incorrect
        error = serializer.errors['old_password'][0]
        self.assertEqual(error.code, 'password_incorrect')

    def test_error_mismatch_password(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'new_password1', 'mismatch_pass')
        serializer = PasswordChangeSerializer(self.request, data=invalid_data)
        # Check form invalid
        self.assertFalse(serializer.is_valid())
        # Get error password_mismatch
        error = serializer.errors['non_field_errors'][0]
        self.assertEqual(error.code, 'password_mismatch')


@tag('user', 'user_api_serializer')
class TestPhoneSerializer(APITestCase):
    def setUp(self) -> None:
        self.valid_data = {'phone': '0979311352'}
        self.request = APIRequestFactory()
        self.user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request.user = self.user

    def test_phone_change(self):
        serializer = PhoneSerializer(self.request, data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        # Check user new phone
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '0979311352')


@tag('user', 'user_api_serializer')
class TestAddressSerializer(APITestCase):
    def setUp(self) -> None:
        province_data = Province.objects.get(name='Province 1')
        city_data = City.objects.get(name='City 11')
        self.valid_data = {'street': '1234 NTMK',
                           'city': str(city_data.id), 'province': str(province_data.id)}
        self.request = APIRequestFactory()
        user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request.user = user

    def test_change_address(self):
        serializer = UserAddressSerializer(self.request, data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        new_address = self.request.user.address
        self.assertEqual(new_address.street, self.valid_data['street'])
        self.assertEqual(str(new_address.city.id), self.valid_data['city'])
        self.assertEqual(str(new_address.province.id),
                         self.valid_data['province'])

    def test_value_None_if_blank(self):
        data = {'street': '', 'city': '', 'province': ''}
        serializer = UserAddressSerializer(self.request, data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        new_address = self.request.user.address
        self.assertEqual(new_address.city, None)
        self.assertEqual(new_address.province, None)


@tag('user', 'user_api_serializer')
class TestProvinceSerializer(APITestCase):
    def test_serialize_province(self):
        # Check serializer return id and name of province
        province = Province.objects.get(name='Province 1')
        serializer = ProvinceSerializer(province)
        dict_key = serializer.data.keys()
        self.assertIn('id', dict_key)
        self.assertIn('name', dict_key)


@tag('user', 'user_api_serializer')
class TestCitySerializer(APITestCase):
    def test_serializer_city(self):
        # Check serializer return city's id, name and its province
        city = City.objects.get(name='City 11')
        serializer = CitySerializer(city)
        dict_keys = serializer.data.keys()
        self.assertIn('id', dict_keys)
        self.assertIn('name', dict_keys)
        self.assertIn('province', dict_keys)
