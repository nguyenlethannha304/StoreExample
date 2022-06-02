from .basic import *
SECRET_KEY = 'django-insecure-2l#rh2aavu!r^c32zw&89(em((2a=iqd*fj(k_94)u^j)ynq(u'
DEBUG = True

ALLOWED_HOSTS = ['*']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
MEDIA_ROOT = os.path.join(BASE_DIR, 'apps', 'static', 'image')
MEDIA_URL = 'media/'
# No Testing Built-in Password Validatation in development
AUTH_PASSWORD_VALIDATORS = []
# Faster hashing algorithms for testing purpose
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]
