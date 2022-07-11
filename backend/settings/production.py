from .basic import *
from os import environ

SECRET_KEY = environ.get('DJ_SECRET_KEY')

allowed_host_list = environ.get('DJ_ALLOWED_HOSTS').replace('"', '').split(',')
ALLOWED_HOSTS = allowed_host_list
CORS_ALLOWED_ORIGINS = ALLOWED_HOSTS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ.get('POSTGRES_DB'),
        'USER': environ.get('POSTGRES_USER'),
        'PASSWORD': environ.get('POSTGRES_PASSWORD'),
        'HOST': environ.get('POSTGRES_HOST'),
        'PORT': environ.get('POSTGRES_PORT'),
    }
}

STATIC_ROOT = os.path.join(BASE_DIR, 'static')