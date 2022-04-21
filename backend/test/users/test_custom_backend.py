from django.contrib.auth import get_user_model
from django.test import TestCase, tag
from django.test.client import RequestFactory
from django.contrib.auth import authenticate
from . import setUpTestUserApp, tearDownTestUserApp
UserModel = get_user_model()


def setUpModule():
    setUpTestUserApp()
    # Create user for authentication tests
    testing_user = UserModel.objects.get(email='testing_user@gmail.com')
    testing_user.phone = '+84979311359'
    testing_user.save()
    # Request object for authenticate function's parameters
    global fake_request
    fake_request = RequestFactory()


def tearDownModule():
    tearDownTestUserApp()


@tag('user', 'user_backend')
class TestPhoneAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use phone number for authentication
        credentials = {'phone': '+84979311359', 'password': '12345678'}
        testing_user = authenticate(fake_request, **credentials)
        self.assertIsNotNone(testing_user)


@tag('user', 'user_backend')
class TestEmailAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use email for authentication
        credentials = {'email': 'testing_user@gmail.com',
                       'password': '12345678'}
        testing_user = authenticate(fake_request, **credentials)
        self.assertIsNotNone(testing_user)
