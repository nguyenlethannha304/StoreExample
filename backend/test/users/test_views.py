from django.contrib.auth.models import User
from django.test import TestCase, tag
from django.contrib.auth import get_user_model
from django.test.client import Client
from django.urls import reverse

from apps.users.forms import *


def setUpModule():
    global UserModel, user_app_name
    UserModel = get_user_model()
    user_app_name = 'users'
    # Create user for test
    normal_user = UserModel.objects.create_user(
        'normal_user@gmail.com', '12345678')


def tearDownModule():
    UserModel.objects.all().delete()


@tag('user', 'user_view')
class TestLoginView(TestCase):
    login_username = 'normal_user@gmail.com'
    login_password = '12345678'
    login_url = reverse('%s:login' % (user_app_name))

    def test_get_method(self):
        response = self.client.get(self.login_url)
        self.assertTemplateUsed(response, 'users/login.html')
        context = response.context
        self.assertTrue(isinstance(context['form'], AuthenticationForm))

    def test_post_method_with_valid_data(self):
        valid_data = {'username': self.login_username,
                      'password': self.login_password}
        response = self.client.post(self.login_url, valid_data, follow=True)
        user = response.context['request'].user
        self.assertTrue(user.is_authenticated)

    def test_post_method_with_invalid_data(self):
        invalid_data = {'username': 'invalid', 'password': 'invalid'}
        response = self.client.post(self.login_url, invalid_data, follow=True)
        user = response.context['request'].user
        self.assertFalse(user.is_authenticated)


@tag('user', 'user_view')
class TestUserCreationView(TestCase):
    new_username = 'new_user@gmail.com'
    new_password = '987654321'
    register_url = reverse('%s:register' % (user_app_name))

    def test_get_method(self):
        response = self.client.get(self.register_url)
        self.assertTemplateUsed(response, 'users/register.html')
        context = response.context
        self.assertTrue(isinstance(context['form'], UserCreationForm))

    def test_post_method(self):
        data = {'email': self.new_username,
                'password1': self.new_password, 'password2': self.new_password}
        response = self.client.post(self.register_url, data, follow=True)
        self.assertTrue(UserModel.objects.filter(
            email=self.new_username).exists())


@tag('user', 'user_view')
class TestPasswordChangeView(TestCase):
    user_email = 'normal_user@gmail.com'
    old_password = '12345678'
    new_password = 'new_password'
    change_password_url = reverse('%s:change_password' % (user_app_name))

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.login_client = Client()
        cls.login_client.login(email=cls.user_email, password=cls.old_password)

    def test_get_method(self):
        response = self.login_client.get(self.change_password_url)
        self.assertTemplateUsed(response, 'users/change_password.html')
        context = response.context
        self.assertTrue(isinstance(context['form'], PasswordChangeForm))

    def test_post_method(self):
        data = {'old_password': self.old_password,
                'new_password1': self.new_password, 'new_password2': self.new_password}
        response = self.login_client.post(
            self.change_password_url, data, follow=True)
        user_with_new_password = UserModel.objects.get(email=self.user_email)
        self.assertTrue(
            user_with_new_password.check_password(self.new_password))


@tag('user', 'user_view')
class TestProfileChangeView(TestCase):
    user_email = 'normal_user@gmail.com'
    password = '12345678'
    profile_url = reverse('%s:profile' % (user_app_name))

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.login_client = Client()
        cls.login_client.login(email=cls.user_email, password=cls.password)

    def test_get_method(self):
        response = self.login_client.get(self.profile_url)