from django.conf import settings
from apps.users.api.serializers import *
from rest_framework import serializers
from rest_framework.test import APITestCase, APIClient
from django.test import tag
from django.contrib.auth import get_user_model
from apps.users.models import Province, City, Address
from test.utils import new_data_with_change
from django.contrib.auth.models import AnonymousUser
from apps.users.forms import uniform_phone_field
from model_bakery import baker
UserModel = get_user_model()


def setUpModule():
    testing_user = baker.make_recipe('users.testing_user')
    city1 = baker.make_recipe('users.city_of_province1', _quantity=2)


def tearDownModule():
    UserModel.objects.all().delete()
    Province.objects.all().delete()


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
        self.request = APIClient()
        self.request.force_authenticate(user=self.user)

    def test_must_login_or_raise_assertion_error(self):
        self.request = APIClient
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
        user_with_new_pass = UserModel.objects.get(
            email='testing_user@gmail.com')
        self.assertTrue(user_with_new_pass.check_password(
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
        self.request = APIClient()
        user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request.force_authenticate(user=user)

    def test_phone_change(self):
        serializer = PhoneSerializer(self.request, data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        user_with_new_phone = UserModel.objects.get(
            email='testing_user@gmail.com')
        self.assertEqual(user_with_new_phone.phone, '0979311352')


@tag('user', 'user_api_serializer')
class TestAddressSerializer(APITestCase):
    def setUp(self) -> None:
        province_data = Province.objects.get(name='P1')
        city_data = City.objects.get(name='C01')
        self.valid_data = {'street': '1234 NTMK',
                           'city': str(city_data.id), 'province': str(province_data.id)}
        self.request = APIClient()
        user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request.force_authenticate(user=user)

    def test_change_address(self):
        serializer = AddressSerializer(self.request, data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        new_address = Address.objects.get(user=self.request.user)
        self.assertEqual(new_address.street, self.valid_data['street'])
        self.assertEqual(str(new_address.city.id), self.valid_data['city'])
        self.assertEqual(str(new_address.province.id),
                         self.valid_data['province'])


@tag('user', 'user_api_serializer')
class TestProvinceSerializer(APITestCase):
    def test_serialize_province(self):
        province = Province.objects.get(name='P1')
        serializer = ProvinceSerializer(province)
        self.assertEqual(serializer.data, {'id': 1, 'name': 'P1'})


@tag('user', 'user_api_serializer')
class TestCitySerializer(APITestCase):
    def test_serializer_city(self):
        city = City.objects.get(name='C01')
        serializer = CitySerializer(city)
        self.assertEqual(serializer.data, {
                         'id': 1, 'name': 'C01', 'province': 1})
