import re

from django.contrib.auth import (get_user_model,
                                 )
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()


class PhoneAuthenticateBackend(ModelBackend):
    def authenticate(self, request, phone, password, **kwargs):
        if phone is None or password is None:
            return None
        try:
            user = UserModel.objects.get(phone=phone)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user


class EmailAuthenticateBackend(ModelBackend):
    def authenticate(self, request, email, password, **kwargs):
        if email is None or password is None:
            return None
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
