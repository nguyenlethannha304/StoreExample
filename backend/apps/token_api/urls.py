from django.urls import path, include
from .views import token_obtain_pair, token_refresh
api_token_urlpatterns = [
    # /api/token/
    path('token_pair/', view=token_obtain_pair),
    path('refresh_token/', view=token_refresh),
]
