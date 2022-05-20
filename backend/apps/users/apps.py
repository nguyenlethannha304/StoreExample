from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    app_label = 'users'

    def ready(self):
        from .signals import create_adress_for_new_user, create_cart_for_new_user
