from django.urls import path, include
from .api.views import api_cart_count_view, api_cart_view
app_name = 'carts'
api_cart_urlpatterns = [
    # api/cart/
    path('count/', view=api_cart_count_view),
    path('', view=api_cart_view),
]
