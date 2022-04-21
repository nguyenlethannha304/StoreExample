from django.urls import include, path
from apps.token_api.urls import api_token_urlpatterns
from apps.users.urls import api_users_urlpatterns
from apps.products.urls import api_products_urlpatterns
from apps.orders.urls import api_orders_urlpatterns
api_urlpatterns = [
    path('token/', include(api_token_urlpatterns)),
    path('users/', include(api_users_urlpatterns)),
    path('products/', include(api_products_urlpatterns)),
    path('orders/', include(api_orders_urlpatterns)),
]
