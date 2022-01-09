from django import forms
from django.contrib.auth import (
    authenticate, get_user_model, password_validation,
)
from django.core.exceptions import ImproperlyConfigured, ValidationError, NON_FIELD_ERRORS
from django.forms.fields import CharField

from django.forms.models import construct_instance, model_to_dict

from ..utils.tools import validate_phonenumber, validate_email
from .address_name import CITY_NAME_CHOICES, PROVINCE_NAME_CHOICES
from .models import Address

__all__ = ['UserCreationForm', 'AuthenticationForm',
           'PasswordChangeForm', 'ProfileChangeForm']
UserModel = get_user_model()


def uniform_phone_field(phone):
    if not phone.startswith('+'):
        return '+84' + phone[1:]
    return phone


def clean_username(username):
    # Check username is email or phone format
    if validate_email(username):
        return username
    elif validate_phonenumber(username):
        if username.startswith('0'):
            return '+84' + username[1:]
        return username
    else:
        # Parent function should raise ValidationError("Incorrect username format")
        raise ValidationError("Incorrect username format")


class UserCreationForm(forms.ModelForm):
    error_messages = {
        'registed': 'Email is already registed',
        'password_mismatch': "Two password input didn't match"
    }
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Enter your password'})
    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Confirm your password'}),
        strip=False
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].widget.attrs['autofocus'] = True

    def clean_email(self, email):
        user_exist = UserModel.objects.get(email=email).exists()
        if user_exist is True:
            raise ValidationError(
                self.error_messages['registed'], code='registed')
        else:
            return email

    def clean(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            self.add_error(NON_FIELD_ERRORS,
                           self.error_messages['password_mismatch'])
        return self.cleaned_data

    def save(self, commit=True):
        assert self.errors, ("Cannot call `.save()` with invalid data")
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password2'])
        if commit:
            user.save()
        return user

    class Meta:
        model = UserModel
        fields = ("email",)
        widgets = {'email': forms.EmailInput(
            attrs={'placeholder': 'Your email', 'autofocus': True})}

    class Media:
        css = {
            'all': ('css/users/user_form.css', 'css/users/register.css',)
        }
        js = ('js/users/user_validate.js', 'js/users/register.js')


class AuthenticationForm(forms.Form):
    phone_field_name = 'username'
    username = CharField(
        label='Email or Phone',
        max_length=255,
        required=True,
        help_text='Enter your phonenumber or email',
        widget=forms.TextInput(
            attrs={'autofocus': True, 'placeholder': "Email or Phone", })
    )
    password = forms.CharField(
        label='Password',
        strip=False,
        widget=forms.PasswordInput(
            attrs={'autocomplete': 'current-password', 'placeholder': 'Password'}),
        help_text="Enter your password"
    )
    error_messages = {
        'invalid_login': "Please enter a correct username or password",
        'inactive': 'This account is inactive.',
        'invalid_username': "Please enter a correct username"
    }

    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)

    def clean_username(self):
        username = self.cleaned_data.get('username')
        try:
            return clean_username(username)
        except ValidationError:
            raise ValidationError(
                self.error_messages['invalid_username'], code='invalid_username')

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username is not None and password:
            if validate_phonenumber(username):
                # Change phone input from "0\d{9}" to "+84\d{9}" format before authenticate
                username = uniform_phone_field(
                    username) if username.startswith('0') else username
                # Authenticate
                self.user_cache = self.authenticate_by_phonebackend(
                    username, password)
            elif validate_email(username):
                self.user_cache = self.authenticate_by_emailbackend(
                    username, password)
            else:
                raise ValidationError(
                    self.error_messages['invalid_username'], code='invalid_username')
            if self.user_cache is None:
                raise ValidationError(
                    self.error_messages['invalid_login'],
                    code='invalid_login'
                )
            else:
                self.validate_user_active(self.user_cache)
        return self.cleaned_data

    def authenticate_by_phonebackend(self, username, password):
        credentials = {'phone': username, 'password': password}
        return authenticate(self.request, **credentials)

    def authenticate_by_emailbackend(self, username, password):
        credentials = {'email': username, 'password': password}
        return authenticate(self.request, **credentials)

    def validate_user_active(self, user):
        if not user.is_active:
            raise ValidationError(
                self.error_messages['inactive'],
                code='inactive',
            )

    def get_user(self):
        return self.user_cache

    class Media:
        css = {
            'all': ('css/users/user_form.css', 'css/users/login.css')
        }
        js = ('js/users/user_validate.js', 'js/users/login.js')


class PasswordChangeForm(forms.Form):
    error_messages = {
        'password_mismatch': "Two new passwords didn't match",
        'password_incorrect': "The old password is incorrect"
    }
    old_password = forms.CharField(
        label="Old Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={'autocomplete': 'current-password', 'autofocus': True, 'placeholder': 'Old Password'})
    )
    new_password1 = forms.CharField(
        label="New Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={'placeholder': 'New Password'}),
        help_text=password_validation.password_validators_help_text_html()
    )
    new_password2 = forms.CharField(
        label="Confirm New Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Confirm New Password'}),
    )

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_old_password(self):
        old_password = self.cleaned_data['old_password']
        if not self.user.check_password(old_password):
            raise ValidationError(
                self.error_messages['password_incorrect'],
                code='password_incorrect'
            )
        return old_password

    def clean(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 is not None and password2 is not None and password1 != password2:
            self.add_error(NON_FIELD_ERRORS,
                           self.error_messages['password_mismatch'])
        return self.cleaned_data

    def save(self, commit=True):
        assert self.errors, ("Cannot call `.save()` with invalid data")
        password = self.cleaned_data['new_password2']
        self.user.set_password(password)
        if commit:
            self.user.save()
        return self.user

    class Media:
        css = {
            'all': ('css/users/user_form.css', 'css/users/change_password.css')
        }
        js = ('js/users/user_validate.js', 'js/users/change_password.js')


class ProfileChangeForm(forms.Form):
    phone = forms.CharField(max_length=12, required=None,
                            widget=forms.TextInput(attrs={'placeholder': 'Your phone number'}))
    address = forms.CharField(max_length=255, required=None,
                              widget=forms.TextInput(attrs={'placeholder': 'Your address'}))
    city = forms.ChoiceField(choices=CITY_NAME_CHOICES, required=None)
    province = forms.ChoiceField(choices=PROVINCE_NAME_CHOICES, required=None)
    user_fields = ('phone',)
    address_fields = ('address', 'city', 'province')

    def __init__(self, user, *args, **kwargs):
        self.user = user
        self.address = Address.objects.filter(
            user=self.user.pk).get(default_address=True)
        # Get initial data for both instance
        initial_user = model_to_dict(self.user, self.user_fields)
        initial_adress = model_to_dict(
            self.address, self.address_fields)
        kwargs['initial'] = {**initial_user, **initial_adress}
        super().__init__(*args, **kwargs)

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if phone and validate_phonenumber(phone):
            return uniform_phone_field(phone)

    def _post_clean(self):
        if self.has_changed():
            # Check every fields of user or address, if it changed, construct new instance
            for user_field in self.user_fields:
                if user_field in self.changed_data:
                    self.user = construct_instance(
                        self, self.user, self.user_fields)
                    setattr(self.user, 'did_change', True)
                    break
            for address_field in self.address_fields:
                if address_field in self.changed_data:
                    self.address = construct_instance(
                        self, self.address, self.address_fields)
                    setattr(self.address, 'did_change', True)
                    break

    def save(self):
        assert self.errors, ("Cannot call `.save()` with invalid data")
        if getattr(self.user, 'did_change', False):
            self.user.save()
        if getattr(self.address, 'did_change', False):
            self.address.save()

    class Media:
        css = {
            'all': ('css/users/user_form.css', )
        }
        js = ('js/users/user_validate.js', 'js/users/profile.js')


class AddressChangeForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = ('address', 'city', 'province')
