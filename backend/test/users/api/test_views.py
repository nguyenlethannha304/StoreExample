import json
from http import HTTPStatus
from test.utils import new_data_with_change

from django.contrib.auth import get_user_model
from django.test import tag
from rest_framework.renderers import JSONRenderer
from rest_framework.test import APIClient, APITestCase

from apps.users.api.serializers import *
from apps.users.models import Address, City, Province

from .. import setUpTestUserApp, tearDownTestUserApp

UserModel = get_user_model()
# --------------URL-----------------
USERS_APP_URL = '/api/users/'
CHECK_EMAIL_EXIST = USERS_APP_URL + 'check_email_exists/'
REGISTER_URL = USERS_APP_URL + 'register/'
CHANGE_PASSWORD_URL = USERS_APP_URL + 'change_password/'


def get_city_url(number):
    return USERS_APP_URL + 'get_city/' + str(number)


GET_PROVINCE_URL = USERS_APP_URL + 'get_province/'
PROFILE_URL = USERS_APP_URL + 'profile/'
GET_PROVINCES_CITIES_URL = USERS_APP_URL + 'get_provinces_cities/'
GET_EMAIL_ADDRESS_URL = USERS_APP_URL + 'get_email_address/'
# ------------------------


def setUpModule():
    setUpTestUserApp()


def tearDownModule():
    tearDownTestUserApp()


@tag('user', 'user_api_view')
class TestUserCreationView(APITestCase):
    valid_data = {'email': 'new_user@gmail.com',
                  'password1': '12345678', 'password2': '12345678'}

    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        response = self.client.post(
            REGISTER_URL, data=self.valid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.CREATED)

    def test_error_invalid_email(self):
        invalid_data = new_data_with_change(self.valid_data, 'email', 'a')
        response = self.client.post(
            REGISTER_URL, data=invalid_data, format='json')
        # Check status_code
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        self.assertEqual(errors['email'][0], "Enter a valid email address.")

    def test_error_user_already_registed(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'email', 'testing_user@gmail.com')
        response = self.client.post(
            REGISTER_URL, data=invalid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        expected_error = UserCreationSerializer.error_message['registed']
        self.assertEqual(errors['email'][0], expected_error)

    def test_error_mismatch_password(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'password1', 'mismatch_pass')
        response = self.client.post(REGISTER_URL, invalid_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)
        # Check error
        errors = json.loads(response.data)
        expected_error = UserCreationSerializer.error_message['password_mismatch']
        self.assertEqual(errors['non_field_errors'][0], expected_error)


@tag('user', 'user_api_view')
class TestPasswordChangeView(APITestCase):
    valid_data = {'old_password': '12345678',
                  'new_password1': '87654321', 'new_password2': '87654321'}

    def setUp(self):
        # Log in client
        self.client = APIClient()
        self.testing_user = UserModel.objects.get(
            email='testing_user@gmail.com')
        self.client.force_authenticate(self.testing_user)

    def test_must_login(self):
        not_login_user = APIClient()
        response = not_login_user.post(CHANGE_PASSWORD_URL)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_change_password(self):
        response = self.client.post(
            CHANGE_PASSWORD_URL, data=self.valid_data, form='json')
        self.assertEqual(response.status_code, 200)
        # Test new password of user
        self.testing_user.refresh_from_db()
        new_password = self.valid_data['new_password1']
        self.assertTrue(self.testing_user.check_password(new_password))

    def test_error_password_mismatch(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'new_password2', 'different_pass')
        response = self.client.post(
            CHANGE_PASSWORD_URL, data=invalid_data, form='json')
        self.assertEqual(response.status_code, 422)
        # check error
        errors = json.loads(response.data)
        expected_error = PasswordChangeSerializer.error_message['password_mismatch']
        self.assertEqual(errors['non_field_errors'][0], expected_error)

    def test_error_password_incorrect(self):
        invalid_data = new_data_with_change(
            self.valid_data, 'old_password', 'incorrect_pass')
        response = self.client.post(
            CHANGE_PASSWORD_URL, data=invalid_data, form='json')
        self.assertEqual(response.status_code, 422)
        # Check error
        errors = json.loads(response.data)
        expected_error = PasswordChangeSerializer.error_message['password_incorrect']
        self.assertEqual(errors['old_password'][0], expected_error)


@tag('user', 'user_api_view')
class TestGetCityAndProvince(APITestCase):
    # Need to find a way to test data
    def setUp(self):
        self.client = APIClient()

    def test_get_province(self):
        response = self.client.get(GET_PROVINCE_URL)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)


@tag('user', 'user_api_view')
class TestProfile(APITestCase):
    @classmethod
    def setUpClass(cls):
        # Create address for user
        cls.user = UserModel.objects.get(email='testing_user@gmail.com')
        city = City.objects.get(name='City 11')
        province = Province.objects.get(name='Province 1')
        user_address = Address.objects.filter(pk=cls.user.address_id).update(
            street='1234 NTMK', city=city, province=province)
        super().setUpClass()

    def setUp(self):
        self.request = APIClient()
        self.request.force_authenticate(user=self.user)

    def test_in_order(self):
        self.get_request()
        self.post_request()

    def get_request(self):
        response = self.request.get(PROFILE_URL)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def post_request(self):
        new_province = Province.objects.get(name='Province 2')
        new_city = City.objects.get(name='City 21')
        new_phone = '0979311359'
        self.request.post(PROFILE_URL, data={
                          'phone': new_phone, 'street': '1234 NTMK', 'city': new_city.id, 'province': new_province.id})
        self.user.refresh_from_db()
        new_address = self.user.address
        self.assertEqual(self.user.phone, '0979311359')
        self.assertEqual(new_address.city.name, 'City 21')
        self.assertEqual(new_address.province.name, 'Province 2')


@tag('user', 'user_api_view',)
class TestGetProvincesCities(APITestCase):
    def setUp(self) -> None:
        self.request = APIClient()

    def test_get_request(self):
        response = self.request.get(GET_PROVINCES_CITIES_URL)
        data = JSONRenderer().render(response.data)
        self.assertEqual(response.status_code, HTTPStatus.OK)


@tag('user', 'user_api_view')
class TestGetEmailAddress(APITestCase):
    def setUp(self):
        self.request = APIClient()
        user = UserModel.objects.get(email='testing_user@gmail.com')
        self.request.force_authenticate(user=user)

    def test_get_email_address(self):
        response = self.request.get(GET_EMAIL_ADDRESS_URL)
        self.assertEqual(response.data, 'testing_user@gmail.com')
