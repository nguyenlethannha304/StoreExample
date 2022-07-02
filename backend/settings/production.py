from .basic import *
from os import environ

SECRET_KEY = environ.get('DJ_SECRET_KEY')

allowed_host_list = environ.get('DJ_ALLOWED_HOSTS').replace('"', '').split(',')
ALLOWED_HOSTS = allowed_host_list
CORS_ALLOWED_ORIGINS = ALLOWED_HOSTS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ.get('PG_DB'),
        'USER': environ.get('PG_USER'),
        'PASSWORD': environ.get('PG_PASSWORD'),
        'HOST': environ.get('PG_HOST'),
        'PORT': environ.get('PG_PORT'),
    }
}