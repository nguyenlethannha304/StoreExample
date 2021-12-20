from django.contrib.auth import get_user_model
from django.test import TestCase, tag
from django.test.client import RequestFactory
from django.contrib.auth import authenticate


def setUpModule():
    global UserModel
    UserModel = get_user_model()
    # Create user for authentication tests
    user = UserModel.objects.create_user('normal_user@gmail.com', '12345678')
    user.phone = '+979311359'
    user.save()
    # Request object for authenticate function's parameters
    global fake_request
    fake_request = RequestFactory()


def tearDownModule():
    UserModel.objects.all().delete()


@tag('user', 'user_backend')
class TestPhoneAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use phone number for authentication
        credentials = {'phone': '+979311359', 'password': '12345678'}
        user = authenticate(fake_request, **credentials)
        self.assertIsNotNone(user)


@tag('user', 'user_backend')
class TestEmailAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use email for authentication
        credentials = {'email': 'normal_user@gmail.com',
                       'password': '12345678'}
        user = authenticate(fake_request, **credentials)
        self.assertIsNotNone(user)
