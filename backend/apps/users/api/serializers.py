from apps.users.forms import uniform_phone_field
from rest_framework import serializers
from rest_framework.serializers import Serializer, ValidationError
from django.contrib.auth import get_user_model
from django.core.exceptions import FieldDoesNotExist
from apps.utils.tools import validate_phonenumber
from ..models import Address, City, CustomUser, Province
UserModel = get_user_model()
__all__ = ['UserCreationSerializer',
           'PasswordChangeSerializer', 'PhoneSerializer', 'UserAddressSerializer', 'CitySerializer', 'ProvinceSerializer', 'ProvinceCitiesSerializer']


class UserCreationSerializer(serializers.Serializer):
    error_message = {
        'registed': 'Email đã được đăng ký',
        'password_mismatch': "Mật khẩu mới và xác nhận không giống nhau",
    }
    email = serializers.EmailField(max_length=255)
    password1 = serializers.CharField(max_length=255, min_length=8)
    password2 = serializers.CharField(max_length=255, min_length=8)

    def validate_email(self, email):
        # Validate email is not registed
        user_exist = UserModel.objects.filter(email=email).exists()
        if user_exist is True:
            raise ValidationError(
                self.error_message['registed'], code='registed')
        return email

    def validate(self, data):
        # Validate password1 and password1 match
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
        'password_mismatch': "Mật khẩu mới và xác nhận không giống nhau",
        'password_incorrect': "Sai mật khẩu cũ"
    }
    old_password = serializers.CharField(max_length=255, min_length=8)
    new_password1 = serializers.CharField(max_length=255, min_length=8)
    new_password2 = serializers.CharField(max_length=255, min_length=8)

    def __init__(self, request, *args, **kwargs):
        assert request.user.is_authenticated, ("User must be login")
        self.user = request.user
        super().__init__(*args, **kwargs)

    def validate_old_password(self, old_password):
        # Check the old_password is correct
        old_password_correct = self.user.check_password(old_password)
        if not old_password_correct:
            raise ValidationError(
                self.error_message['password_incorrect'], code='password_incorrect')
        return old_password

    def validate(self, data):
        # Check new_password and confirm_password are the same
        new_password1 = data.get('new_password1')
        new_password2 = data.get('new_password2')
        if new_password1 != new_password2:
            raise ValidationError(
                self.error_message['password_mismatch'], code='password_mismatch')
        return data

    def save(self):
        password = self.validated_data.get('new_password1')
        self.user.set_password(password)
        self.user.save()
        return self.user


class PhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(allow_null=True)

    def __init__(self, request, *args, **kwargs):
        # Attach user to self for later usage
        assert request.user.is_authenticated, ("User must be login")
        self.user = request.user
        super().__init__(request, *args, **kwargs)

    def validate_phone(self, phone):
        # Check if phone is correct format
        if phone == None:
            return None
        if not (validate_phonenumber(phone)):
            raise ValidationError("Số điện thoại không hợp lệ")
        if self.phone_number_exist(phone):
            raise ValidationError("Số điện thoại đã được đăng ký")
        return phone

    def phone_number_exist(self, phone):
        phone_exist = CustomUser.objects.filter(phone=phone).exists()
        if phone_exist and (self.user.phone != phone):
            return True
        return False

    def save(self):
        self.user.phone = self.validated_data['phone']
        self.user.save()


class UserAddressSerializer(serializers.ModelSerializer):
    def __init__(self, request, *args, **kwargs):
        # Attach user to self for later usage
        assert request.user.is_authenticated, ("User must be login")
        self.user = request.user
        super().__init__(*args, **kwargs)

    def validate_city(self, value):
        # City is foreign key if it is blank => it is None
        if value == None:
            return None
        return value

    def validate_province(self, value):
        # Province is foreign key if it is blank => it is None
        if value == '':
            return None
        return value

    def save(self):
        address_id = self.user.address_id
        Address.objects.filter(pk=address_id).update(
            **self.validated_data)

    class Meta:
        model = Address
        fields = ('street', 'province', 'city',)


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class ProvinceCitiesSerializer(serializers.ModelSerializer):
    cities = CitySerializer(many=True)

    class Meta:
        model = Province
        fields = ['id', 'name', 'cities']
