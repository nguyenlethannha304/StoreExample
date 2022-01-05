from django.urls import path, include
from .views import (login_view, user_create_view,
                    password_change_view, profile_change_view, logout_view, check_email_exists)
app_name = 'users'
api_url_patterns = [
    path('check_email_exists/',
         view=check_email_exists, name='check_email_exists'),
]
urlpatterns = [
    path('login/', view=login_view, name='login'),
    path('register/', view=user_create_view, name='register'),
    path('change_password/', view=password_change_view, name='change_password'),
    path('profile/', view=profile_change_view, name='profile'),
    path('logout/', view=logout_view, name='logout'),
    path('api/', include(api_url_patterns))
]
