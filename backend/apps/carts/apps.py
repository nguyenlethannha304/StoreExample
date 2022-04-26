from django.apps import AppConfig


class CartsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.carts'
    app_label = 'carts'

    def ready(self):
        from .signals import update_cart_count_when_add_new_itemcart
