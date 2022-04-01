from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    app_label = 'users'

    def ready(self):
        pass
        # from .signals import *
