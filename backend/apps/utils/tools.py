import re
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator


def validate_phonenumber(value):
    phone_pattern = r'(0|\+84)([0-9]){9}'
    return re.fullmatch(phone_pattern, value)


class CustomeEmailValidator(EmailValidator):
    def __call__(self, value):
        try:
            super().__call__(value)
            return True
        except ValidationError:
            return False


validate_email = CustomeEmailValidator()
