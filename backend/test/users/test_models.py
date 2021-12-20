from uuid import uuid4
from django.apps import apps
from django.test import TestCase, tag
from django.contrib.auth import get_user_model


def setUpModule():
    global UserModel
    UserModel = get_user_model()


@tag('user', 'user_model')
class TestCustomUserModel(TestCase):
    def test_id_field(self):
        self.assertTrue(UserModel.id.field.primary_key)
        self.assertEqual(UserModel.id.field.default, uuid4)

    def test_email_field(self):
        self.assertTrue(UserModel.email.field.unique)

    def test_phone_field(self):
        self.assertTrue(UserModel.phone.field.unique)
        self.assertTrue(UserModel.phone.field.blank)

    def test_is_staff_field(self):
        self.assertFalse(UserModel.is_staff.field.default)


@tag('user', 'user_model')
class TestCustomUserManager(TestCase):
    def test_create_user(self):
        normal_user = UserModel.objects.create_user(
            'normal_user@gmail.com', '123456')
        self.assertEqual(normal_user.email, 'normal_user@gmail.com')
        self.assertFalse(normal_user.is_staff)
        self.assertFalse(normal_user.is_superuser)

    def test_create_superuser(self):
        super_user = UserModel.objects.create_superuser(
            'super_user@gmail.com', '123456')
        self.assertEqual(super_user.email, 'super_user@gmail.com')
        self.assertTrue(super_user.is_staff)
        self.assertTrue(super_user.is_superuser)
