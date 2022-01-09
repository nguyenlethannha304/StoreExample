from django.urls import include, path
from apps.token_api.urls import api_token_urlpatterns
api_urlpatterns = [
    path('token/', include(api_token_urlpatterns))
]
