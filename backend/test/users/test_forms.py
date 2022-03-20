import copy
from django.test import TestCase, tag
from django.core.exceptions import ValidationError, NON_FIELD_ERRORS
from django.contrib.auth import get_user_model
from django.test.client import RequestFactory
from django.utils.datastructures import MultiValueDict
from apps.users.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm
from apps.users.models import Address
from test.utils import new_data_with_change
UserModel = get_user_model()


def setUpModule():
    # Create user for test
    testing_user = UserModel.objects.create_user(
        'testing_user@gmail.com', '12345678')
    testing_user.phone = "+84979311359"
    testing_user.save()
    global fake_request
    fake_request = RequestFactory()


def tearDownModule():
    UserModel.objects.all().delete()


@tag('user', 'user_form')
class TestUserCreationForm(TestCase):
    valid_data = {'email': 'user@gmail.com',
                  'password1': '12345678', 'password2': '12345678'}

    def test_valid_form_and_create_user(self):
        valid_form = UserCreationForm(data=self.valid_data)
        self.assertTrue(valid_form.is_valid())  # Test valid form
        testing_user = valid_form.save()
        # Test user save to database
        self.assertTrue(UserModel.objects.filter(pk=testing_user.pk).exists())

    def test_invalid_form(self):
        # password1 != password2
        invalid_data = new_data_with_change(
            self.valid_data, 'password1', 'mismatch_pass')
        invalid_form = UserCreationForm(data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors[NON_FIELD_ERRORS][0]
        self.assertEqual(
            error_message, UserCreationForm.error_messages['password_mismatch'])


@tag('user', 'user_form')
class TestAuthenticationForm(TestCase):
    login_phone_data = {'username': '0979311359', 'password': '12345678'}
    login_email_data = {
        'username': 'testing_user@gmail.com', 'password': '12345678'}

    def test_phone_login(self):
        form = AuthenticationForm(fake_request, data=self.login_phone_data)
        self.assertTrue(form.is_valid())
        self.assertIsNotNone(form.user_cache)

    def test_email_login(self):
        form = AuthenticationForm(fake_request, data=self.login_email_data)
        self.assertTrue(form.is_valid())
        self.assertIsNotNone(form.user_cache)


@tag('user', 'user_form')
class TestPasswordChangeForm(TestCase):
    valid_data = {'old_password': '12345678',
                  'new_password1': '87654321', 'new_password2': '87654321'}

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.testing_user = UserModel.objects.get(
            email='testing_user@gmail.com')
        cls.custom_request = RequestFactory()
        cls.custom_request.user = cls.testing_user

    def test_change_passwod_success(self):
        # valid form
        valid_form = PasswordChangeForm(
            self.custom_request, data=self.valid_data)
        self.assertTrue(valid_form.is_valid())
        valid_form.save()  # Save user to db
        testing_user = UserModel.objects.get(
            email='testing_user@gmail.com')  # Get testing_user from db
        self.assertTrue(testing_user.check_password(
            self.valid_data['new_password1']))

    def test_wrong_old_password(self):
        # old_password != user.password
        invalid_data = new_data_with_change(
            self.valid_data, 'old_password', 'incorrect_pass')
        invalid_form = PasswordChangeForm(
            self.custom_request, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors['old_password'][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_incorrect'])

    def test_new_pass_not_match(self):
        # new_password1 != new_password2
        invalid_data = new_data_with_change(
            self.valid_data, 'new_password1', 'mismatch_pass')
        invalid_form = PasswordChangeForm(
            self.custom_request, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors[NON_FIELD_ERRORS][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_mismatch'])
