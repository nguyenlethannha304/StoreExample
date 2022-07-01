from django.contrib.auth import authenticate
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.utils.tools import validate_email, validate_phonenumber


class CustomTokenObtainSerializer(TokenObtainSerializer):
    '''Add support username authentication by both of the phone and email'''
    username_field = 'username'
    default_error_messages = {
        'no_active_account': "Your account is inactive",
        'wrong': "Your username or password is wrong"
    }

    def validate(self, attrs):
        username = attrs[self.username_field]
        if validate_phonenumber(username):
            authenticate_kwargs = {
                'phone': username,
                'password': attrs['password']
            }
        elif validate_email(username):
            authenticate_kwargs = {
                'email': username,
                'password': attrs['password']
            }
        else:
            raise exceptions.AuthenticationFailed(
                self.error_messages['wrong'],
                'wrong'
            )
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass
        self.user = authenticate(**authenticate_kwargs)
        if self.user is None or self.user.is_active is False:
            raise exceptions.AuthenticationFailed(
                self.error_messages['no_active_account'],
                'no_active_account'
            )
        return {}


class CustomTokenObtainPairSerializer(CustomTokenObtainSerializer):
    '''Inherit from CustomTokenObtainSerializer'''
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data
