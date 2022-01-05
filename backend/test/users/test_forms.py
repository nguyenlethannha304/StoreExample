import copy
from django.test import TestCase, tag
from django.core.exceptions import ValidationError, NON_FIELD_ERRORS
from django.contrib.auth import get_user_model
from django.test.client import RequestFactory
from django.utils.datastructures import MultiValueDict
from apps.users.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm, ProfileChangeForm
from apps.users.models import Address
from apps.users.address_name import CITY_NAME_CHOICES, PROVINCE_NAME_CHOICES


def setUpModule():
    global UserModel
    UserModel = get_user_model()
    # Create user for test
    user = UserModel.objects.create_user('normal_user@gmail.com', '12345678')
    user.phone = "+84979311359"
    user.save()
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
        user = valid_form.save()
        # Test user save to database
        self.assertTrue(UserModel.objects.filter(pk=user.pk).exists())

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
        {'username': ['normal_user@gmail.com'], 'password': ['12345678']})

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
        cls.user = UserModel.objects.get(email='normal_user@gmail.com')

    def test_change_passwod_success(self):
        # valid form
        valid_form = PasswordChangeForm(self.user, data=self.valid_data)
        self.assertTrue(valid_form.is_valid())
        valid_form.save()  # Save user to db
        user = UserModel.objects.get(
            email='normal_user@gmail.com')  # Get user from db
        self.assertTrue(user.check_password(self.valid_data['new_password1']))

    def test_wrong_old_password(self):
        # old_password != user.password
        invalid_data = copy.deepcopy(self.valid_data)
        invalid_data['old_password'] = 'wrongpass'
        invalid_form = PasswordChangeForm(self.user, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors['old_password'][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_incorrect'])

    def test_new_pass_not_match(self):
        # new_password1 != new_password2
        invalid_data = copy.deepcopy(self.valid_data)
        invalid_data['new_password1'] = 'notmatchpass'
        invalid_form = PasswordChangeForm(self.user, data=invalid_data)
        self.assertFalse(invalid_form.is_valid())
        error_message = invalid_form.errors[NON_FIELD_ERRORS][0]
        self.assertEqual(
            error_message, PasswordChangeForm.error_messages['password_mismatch'])


@tag('user', 'user_form')
class TestProfileChangeForm(TestCase):
    new_phone = '+84987654321'
    user_email = 'normal_user@gmail.com'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserModel.objects.get(email=cls.user_email)
        cls.address = Address.objects.get(
            **{"user": cls.user})

    def test_change_phone_number(self):
        form = ProfileChangeForm(user=self.user,
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
                'address': address_data}
        form = ProfileChangeForm(user=self.user, data=data)
        self.assertTrue(form.is_valid())
        form.save()
        new_address = Address.objects.get(user=self.user)
        self.assertEqual(new_address.address, address_data)
        self.assertEqual(new_address.city, city_data)
        self.assertEqual(new_address.province, province_data)
