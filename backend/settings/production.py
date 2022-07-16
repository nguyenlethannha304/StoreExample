from .basic import *
from os import environ
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