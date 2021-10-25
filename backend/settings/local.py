from .basic import *
SECRET_KEY = 'django-insecure-2l#rh2aavu!r^c32zw&89(em((2a=iqd*fj(k_94)u^j)ynq(u'
DEBUG = True

ALLOWED_HOSTS = []
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
