from django.urls import path

from .api.views import (api_check_order_information_view, api_place_order_view,
                        api_user_order_tracking_view)

app_name = 'orders'
api_order_urlpatterns = [
    # /api/orders/
    path('check-order/', view=api_check_order_information_view),
    path('place-order/', view=api_place_order_view),
    path('user-order-tracking/', view=api_user_order_tracking_view),
]
