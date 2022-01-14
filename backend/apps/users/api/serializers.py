from apps.users.forms import uniform_phone_field
from rest_framework import serializers
from rest_framework.serializers import Serializer, ValidationError
from django.contrib.auth import get_user_model
from django.core.exceptions import FieldDoesNotExist
from apps.utils.tools import validate_phonenumber
from ..models import Address
from ..address_name import CITY_NAME_CHOICES, PROVINCE_NAME_CHOICES
UserModel = get_user_model()
__all__ = ['UserCreationSerializer',
           'PasswordChangeSerializer', 'ProfileSerializer']


class UserCreationSerializer(serializers.Serializer):
    error_message = {
        'registed': 'Email is already registed',
        'password_mismatch': "Two password didn't match",
    }
    email = serializers.EmailField(max_length=255)
    password1 = serializers.CharField(max_length=255, min_length=8)
    password2 = serializers.CharField(max_length=255, min_length=8)

    def validate_email(self, email):
        user_exist = UserModel.objects.filter(email=email).exists()

        if user_exist is True:
            raise ValidationError(
                self.error_message['registed'], code='registed')
        else:
            return email

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')
        if password1 != password2:
            raise ValidationError(
                self.error_message['password_mismatch'], code='password_mismatch')
        return data

    def save(self):
        email = self.validated_data.get('email')
        password = self.validated_data.get('password1')
        return UserModel.objects.create_user(username=email, password=password)


class PasswordChangeSerializer(serializers.Serializer):
    error_message = {
        'password_mismatch': "Two new passwords didn't match",
        'password_incorrect': "The old password is incorrect"
    }
    old_password = serializers.CharField(max_length=255, min_length=8)
    new_password1 = serializers.CharField(max_length=255, min_length=8)
    new_password2 = serializers.CharField(max_length=255, min_length=8)

    def __init__(self, request, *args, **kwargs):
        assert request.user.is_authenticated, ("User must be login")
        self.user = request.user
        super().__init__(*args, **kwargs)

    def validate_old_password(self, old_password):
        correct_old_password = self.user.check_password(old_password)
        # breakpoint()
        if not correct_old_password:
            raise ValidationError(
                self.error_message['password_incorrect'], code='password_incorrect')
        return old_password

    def validate(self, data):
        new_password1 = data.get('new_password1')
        new_password2 = data.get('new_password2')
        if new_password1 != new_password2:
            raise ValidationError(
                self.error_message['password_mismatch'], code='password_mismatch')
        return data

    def save(self, commit=True):
        assert not self.errors, (
            'Can not call `.save()` with invalid data'
        )
        password = self.validated_data.get('new_password1')
        self.user.set_password(password)
        if commit:
            self.user.save()
        return self.user


class ProfileSerializer(serializers.Serializer):
    phone = serializers.CharField(
        validators=[validate_phonenumber], max_length=255, required=False)
    street = serializers.CharField(max_length=255, required=False)
    city = serializers.ChoiceField(choices=CITY_NAME_CHOICES, required=False)
    province = serializers.ChoiceField(
        choices=PROVINCE_NAME_CHOICES, required=False)

    def __init__(self, request, *args, **kwargs):
        assert request.user.is_authenticated, ("User must be login")
        self.user = request.user
        self.address = Address.objects.filter(
            user=self.user.pk).get(default_address=True)
        super().__init__(*args, **kwargs)

    def validate_phone(self, phone):
        if phone and validate_phonenumber(phone):
            return uniform_phone_field(phone)

    def save(self):
        assert not self.errors, ("Cannot call `.save()` with invalid data.")
        self.user = self.instance_data_change(self.user)
        self.address = self.instance_data_change(self.address)
        if getattr(self.user, 'did_change', False):
            self.user.save()
        if getattr(self.address, 'did_change', False):
            self.address.save()

    def instance_data_change(self, instance):
        '''Compare values between serializer and instance if change then assign new value to instance'''
        for serializer_field in self.get_fields():
            # Check value on serializer field not empty
            if (new_value := self.validated_data.get(serializer_field, None)) is None:
                continue
            # Check serializer field exist on instance
            try:
                instance._meta.get_field(serializer_field)
            except FieldDoesNotExist:
                continue
            # Compare old_value and new_value if change then set new_value
            if new_value != getattr(instance, serializer_field):
                setattr(instance, serializer_field, new_value)
                instance.did_change = True
        return instance
