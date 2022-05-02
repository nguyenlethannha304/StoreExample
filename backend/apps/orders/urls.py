from django.urls import path, include
from .api.views import api_check_order_information_view, api_place_order_view
app_name = 'orders'
api_order_urlpatterns = [
    # /api/orders/
    path('check-order/', view=api_check_order_information_view),
    path('place-order/', view=api_place_order_view),
]
