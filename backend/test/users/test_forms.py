import copy
from django.test import TestCase, tag
from django.core.exceptions import ValidationError, NON_FIELD_ERRORS
from django.contrib.auth import get_user_model
from django.test.client import RequestFactory
from django.utils.datastructures import MultiValueDict
from apps.users.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm, ProfileChangeForm
from apps.users.models import Address
from apps.users.address_name import CITY_NAME_CHOICES, PROVINCE_NAME_CHOICES
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

    def test_valid_form_and_create_user(self):
        valid_data = MultiValueDict(
            {'email': ['user@gmail.com'], 'password1': ['12345678'], 'password2': ['12345678']})
        valid_form = UserCreationForm(data=valid_data)
        self.assertTrue(valid_form.is_valid())  # Test valid form
        testing_user = valid_form.save()
        # Test user save to database
        self.assertTrue(UserModel.objects.filter(pk=testing_user.pk).exists())

    def test_invalid_form(self):
        # password1 != password2
        invalid_data = MultiValueDict(
            {'email': ['invalid_pass@gmail.com'], 'password1': ['not_match_pass'], 'password2': ['12345678']})
        invalid_form = UserCreationForm(data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors[NON_FIELD_ERRORS][0]
        self.assertEqual(
            error_message, UserCreationForm.error_messages['password_mismatch'])


@tag('user', 'user_form')
class TestAuthenticationForm(TestCase):
    login_phone_data = MultiValueDict(
        {'username': ['0979311359'], 'password': ['12345678']})
    login_email_data = MultiValueDict(
        {'username': ['testing_user@gmail.com'], 'password': ['12345678']})

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
    valid_data = MultiValueDict({'old_password': ['12345678'],
                                 'new_password1': ['87654321'], 'new_password2': ['87654321']})

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
        invalid_data = copy.deepcopy(self.valid_data)
        invalid_data['old_password'] = 'wrongpass'
        invalid_form = PasswordChangeForm(
            self.custom_request, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors['old_password'][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_incorrect'])

    def test_new_pass_not_match(self):
        # new_password1 != new_password2
        invalid_data = copy.deepcopy(self.valid_data)
        invalid_data['new_password1'] = 'notmatchpass'
        invalid_form = PasswordChangeForm(
            self.custom_request, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors[NON_FIELD_ERRORS][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_mismatch'])


@tag('user', 'user_form')
class TestProfileChangeForm(TestCase):
    new_phone = '+84987654321'
    user_email = 'testing_user@gmail.com'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserModel.objects.get(email=cls.user_email)
        cls.custom_request = RequestFactory()
        cls.custom_request.user = cls.user
        cls.address = Address.objects.get(
            **{"user": cls.user})

    def test_change_phone_number(self):
        form = ProfileChangeForm(self.custom_request,
                                 data={'phone': self.new_phone})
        self.assertTrue(form.is_valid())
        form.save()
        user_with_new_phone_number = UserModel.objects.get(
            email=self.user_email)
        self.assertEqual(user_with_new_phone_number.phone, self.new_phone)

    def test_change_address(self):
        city_data = CITY_NAME_CHOICES[1][0]
        province_data = PROVINCE_NAME_CHOICES[1][0]
        address_data = '123 A Street'
        data = {'city': city_data, 'province': province_data,
                'street': address_data}
        form = ProfileChangeForm(self.custom_request, data=data)
        self.assertTrue(form.is_valid())
        form.save()
        new_address = Address.objects.get(user=self.user)
        self.assertEqual(new_address.street, address_data)
        self.assertEqual(new_address.city, city_data)
        self.assertEqual(new_address.province, province_data)
