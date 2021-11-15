from django.contrib import auth
from django.test import TestCase
from django.test.client import FakePayload, RequestFactory
from django.apps import apps
from django.contrib.auth import authenticate
UserModel = apps.get_model('users', 'CustomUser')


def setUpModule():
    user = UserModel.objects.create_user('normal_user@gmail.com', '12345678')
    user.phone = '+979311359'
    user.save()
    global fake_request
    fake_request = RequestFactory()


def tearDownModule():
    UserModel.objects.get(email='normal_user@gmail.com').delete()


class TestPhoneAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use phone number for authentication
        user = authenticate(
            fake_request, phone='+979311359', password='12345678')
        self.assertTrue(user)


class TestEmailAuthenticateBackend(TestCase):
    def test_authenticate(self):
        # Use email for authentication
        user = authenticate(
            fake_request, email='normal_user@gmail.com', password='12345678')
        self.assertTrue(user)
