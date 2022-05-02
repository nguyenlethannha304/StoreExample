from django.apps import AppConfig


class OrdersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.orders'
    app_label = 'orders'

    def ready(self):
        from .signals import create_first_status_when_order_created
