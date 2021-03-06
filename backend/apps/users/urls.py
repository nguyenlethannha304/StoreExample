from django.urls import path

from .api.views import (api_get_city_view, api_get_email_address,
                        api_get_province_view, api_get_provinces_cities,
                        api_profile_view, api_user_creation_view,
                        api_user_password_change_view)
from .views import (check_email_exists, login_view, logout_view,
                    password_change_view, profile_change_view,
                    user_create_view, user_panel_view)

app_name = 'users'
urlpatterns = [
    # Pre Url /users/
    path('login/', view=login_view, name='login'),
    path('register/', view=user_create_view, name='register'),
    path('change_password/', view=password_change_view, name='change_password'),
    path('profile/', view=profile_change_view, name='profile'),
    path('logout/', view=logout_view, name='logout'),
    path('panel/', view=user_panel_view, name='panel')
]
api_users_urlpatterns = [
    # Pre Url /api/users/
    path('check_email_exists/', view=check_email_exists),
    path('register/', view=api_user_creation_view),
    path('change_password/', view=api_user_password_change_view),
    path('get_city/<int:province_id>/', view=api_get_city_view),
    path('get_province/', view=api_get_province_view),
    path('profile/', view=api_profile_view),
    path('get_provinces_cities/', view=api_get_provinces_cities),
    path('get_email_address/', view=api_get_email_address)
]
