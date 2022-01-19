from urllib import response
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from apps.users.api.serializers import *
from django.test import tag
from test.utils import new_data_with_change
from http import HTTPStatus
import json
import copy
UserModel = get_user_model()
app_url = '/api/users/'


def setUpModule():
    testing_user = UserModel.objects.create_user(
        username='testing_user@gmail.com', password='12345678')


def tearDownModule():
    UserModel.objects.all().delete()


@tag('user', 'user_api_view')
class TestUserCreationView(APITestCase):
    valid_data = {'email': 'new_user@gmail.com',
                  'password1': '12345678', 'password2': '12345678'}
    url = app_url + 'register'

    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        response = self.client.post(
            self.url, data=self.valid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.CREATED)

    def test_error_invalid_email(self):
        invalid_data = new_data_with_change(self.valid_data, 'email', 'a')
        response = self.client.post(self.url, data=invalid_data, format='json')
        # Check status_code
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        self.assertEqual(errors['email'][0], "Enter a valid email address.")

    def test_error_user_already_registed(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'email', 'testing_user@gmail.com')
        response = self.client.post(self.url, data=invalid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        expected_error = UserCreationSerializer.error_message['registed']
        self.assertEqual(errors['email'][0], expected_error)

    def test_error_mismatch_password(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'password1', 'mismatch_pass')
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        expected_error = UserCreationSerializer.error_message['password_mismatch']
        self.assertEqual(errors['non_field_errors'][0], expected_error)


@tag('user', 'user_api_view')
class TestPasswordChangeView(APITestCase):
    valid_data = {'old_password': '12345678',
                  'new_password1': '87654321', 'new_password2': '87654321'}
    url = app_url + 'change_password'

    def setUp(self):
        # Log in client
        self.client = APIClient()
        self.testing_user = UserModel.objects.get(
            email='testing_user@gmail.com')
        self.client.force_authenticate(self.testing_user)

    def test_must_login(self):
        not_login_user = APIClient()
        response = not_login_user.post(self.url)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_change_password(self):
        response = self.client.post(
            self.url, data=self.valid_data, form='json')
        self.assertEqual(response.status_code, 200)
        # Test new password of user
        testing_user = UserModel.objects.get(email='testing_user@gmail.com')
        new_password = self.valid_data['new_password1']
        self.assertTrue(testing_user.check_password(new_password))

    def test_error_password_mismatch(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'new_password2', 'different_pass')
        response = self.client.post(self.url, data=invalid_data, form='json')
        self.assertEqual(response.status_code, 422)
        # check error
        errors = json.loads(response.data)
        expected_error = PasswordChangeSerializer.error_message['password_mismatch']
        self.assertEqual(errors['no_fields_error'][0], expected_error)

    def test_error_password_incorrect(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'old_password', 'incorrect_pass')
        response = self.client.post(self.url, data=invalid_data, form='json')
        self.assertEqual(response.status_code, 422)
        # Check error
        errors = json.loads(response.data)
        expected_error = PasswordChangeSerializer.error_message['password_incorrect']
        self.assertEqual(errors['old_password'][0], expected_error)


@tag('user', 'user_api_view')
class TestProfileView(APITestCase):
    url = app_url + 'profile'
    valid_data = {'phone': '+84979311359',
                  'street': '125 NTMK', 'city': 'CA', 'province': 'PA'}

    def setUp(self):
        # Login user
        self.client = APIClient()
        self.testing_user = UserModel.objects.get(
            email='testing_user@gmail.com')
        self.client.force_authenticate(self.testing_user)

    def test_must_login(self):
        not_login_user = APIClient()
        response = not_login_user.post(self.url)
        self.assertEqual(response.status_code, 401)

    def test_get_user_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        # All values are blank
        data = response.data
        self.assertEqual(data['phone'], '')
        self.assertEqual(data['city'], '')
        self.assertEqual(data['province'], '')
        self.assertEqual(data['street'], '')

    def test_post_user_profile(self):
        response = self.client.post(
            self.url, data=self.valid_data, format='json')
        self.assertEqual(response.status_code, 200)
        # Check new phone value
        testing_user = UserModel.objects.get(email='testing_user@gmail.com')
        self.assertEqual(testing_user.phone, self.valid_data['phone'])
        # Check new address value
        testing_address = testing_user.address_set.get(default_address=True)
        self.assertEqual(testing_address.street, self.valid_data['street'])
        self.assertEqual(testing_address.city, self.valid_data['city'])
        self.assertEqual(testing_address.province, self.valid_data['province'])
