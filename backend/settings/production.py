from .basic import *
from os import environ

DEBUG_STRING = environ.get('DJ_DEBUG')
if DEBUG_STRING == "True":
    DEBUG = True
else:
    DEBUG=False

def get_allowed_origins():
    PUBLIC_IP = environ.get("PUBLIC_IP")
    PUBLIC_IP = 'http://' + str(PUBLIC_IP)
    return [PUBLIC_IP]

SECRET_KEY = environ.get('DJ_SECRET_KEY')

allowed_host_list = [str(environ.get("PUBLIC_IP"))]
ALLOWED_HOSTS = allowed_host_list
CORS_ALLOWED_ORIGINS = get_allowed_origins()

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

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}
# Use AMAZON SERVER TO STORAGE IMAGE WHEN DEBUG=FALSE
if DEBUG==False:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID=environ.get('DJANGO_AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY=environ.get('DJANGO_AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME=environ.get('DJANGO_AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME= environ.get('AWS_S3_REGION_NAME')
    INSTALLED_APPS = INSTALLED_APPS + ['storages']