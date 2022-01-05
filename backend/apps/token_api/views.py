from rest_framework_simplejwt.views import TokenViewBase, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenViewBase):
    serializer_class = CustomTokenObtainPairSerializer


token_obtain_pair = CustomTokenObtainPairView.as_view()
token_refresh = TokenRefreshView.as_view()
