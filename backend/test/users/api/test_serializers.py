from apps.users.api.serializers import *
from backend.test.utils import new_data_with_change
from rest_framework import serializers
from rest_framework.test import APIRequestFactory, APITestCase
from django.test import tag
from django.contrib.auth import get_user_model
from test.utils import new_data_with_change
from django.contrib.auth.models import AnonymousUser
from apps.users.forms import uniform_phone_field
UserModel = get_user_model()


def setUpModule():
    testing_user = UserModel.objects.create_user(
        username='testing_user@gmail.com', password='12345678')


def tearDownModule():
    UserModel.objects.all().delete()


@tag('user', 'user_api_serializer')
class TestUserCreationSerializer(APITestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.valid_data = {'email': 'new_user@gmail.com',
                          'password1': '12345678', 'password2': '12345678'}
        return super().setUpClass()

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
class TestProfileSerializer(APITestCase):
    def setUp(self):
        self.user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request = APIRequestFactory()
        self.request.user = self.user

    def test_must_login_or_raise_assertion_error(self):
        self.request = APIRequestFactory()
        self.request.user = AnonymousUser()
        with self.assertRaises(AssertionError):
            serializer = ProfileSerializer(self.request)

    def test_change_phone_number(self):
        new_valid_data = {'phone': '0979311356'}
        serializer = ProfileSerializer(self.request, data=new_valid_data)
        # Check form valid
        self.assertTrue(serializer.is_valid())
        serializer.save()
        # Check user phone
        user = UserModel.objects.get(email='testing_user@gmail.com')
        new_phone = uniform_phone_field(new_valid_data['phone'])
        self.assertEqual(user.phone, new_phone)

    def test_change_address(self):
        new_valid_data = {'street': '123 NTM', 'city': 'CA', 'province': 'PA'}
        serializer = ProfileSerializer(self.request, data=new_valid_data)
        # Check form valid
        self.assertTrue(serializer.is_valid())
        serializer.save()
        # Check new_address
        new_address = self.request.user.address_set.first()
        self.assertEqual(new_address.street, new_valid_data['street'])
        self.assertEqual(new_address.city, new_valid_data['city'])
        self.assertEqual(new_address.province, new_valid_data['province'])
