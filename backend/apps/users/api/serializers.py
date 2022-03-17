from apps.users.forms import uniform_phone_field
from rest_framework import serializers
from rest_framework.serializers import Serializer, ValidationError
from django.contrib.auth import get_user_model
from django.core.exceptions import FieldDoesNotExist
from apps.utils.tools import validate_phonenumber
from ..models import Address, City, Province
UserModel = get_user_model()
__all__ = ['UserCreationSerializer',
           'PasswordChangeSerializer']


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


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City


class ProvinceSerializer(serializers.ModelField):
    class Meta:
        model = Province
