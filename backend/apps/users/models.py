import uuid
from django.apps import apps
from django.db import models
from django.core.mail import send_mail
from django.core.exceptions import ImproperlyConfigured
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import PermissionsMixin, UserManager
from ..utils.tools import validate_phonenumber
# Create your models here.


class Province(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.name}'


class City(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, null=True, related_name='cities')

    def __str__(self):
        return f'{self.name}'


class Address(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    street = models.CharField(max_length=255, blank=True)
    province = models.ForeignKey(
        Province, on_delete=models.SET_NULL, null=True, default=None)
    city = models.ForeignKey(
        City, on_delete=models.SET_NULL, null=True, default=None)

    def __bool__(self):
        if self.street and self.province and self.city:
            return True
        return False

    def __str__(self):
        return f'Street:{self.street}, City:{self.city}, Province:{self.province} '


class CustomUserManager(UserManager):
    def _create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("The given username must be set")
        username = self.normalize_email(username)
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name)
        username = GlobalUserModel.normalize_username(username)
        user = self.model(email=username, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        return self._create_user(email, password, **extra_fields)

    def create(self):
        raise ImproperlyConfigured(
            "Use create_user(username, password, **extra_field) instead of create()"
        )


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    email = models.EmailField(unique=True, error_messages={
                              'unique': 'This email is already registed'}, db_index=True)
    phone = models.CharField(max_length=12, unique=True, error_messages={'unique': 'This phone is already registed'},
                             blank=True, validators=[validate_phonenumber], db_index=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    address = models.ForeignKey(
        Address, related_name='+', on_delete=models.SET_NULL, null=True, default=None)
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)
