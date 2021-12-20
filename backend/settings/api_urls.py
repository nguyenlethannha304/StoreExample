from django.urls import include, path
from apps.users.urls import api_users_urlpatterns
api_urlpatterns = [
    path('users/', include(api_users_urlpatterns))
]
