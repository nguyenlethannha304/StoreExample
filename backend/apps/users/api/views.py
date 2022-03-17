from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
import json
from rest_framework.permissions import IsAuthenticated
from ..models import Address, Province, City
from rest_framework.decorators import api_view

from .serializers import ProvinceSerializer
from .serializers import CitySerializer


class UserCreationView(APIView):

    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=201)
        else:
            errors = json.dumps(serializer.errors)
            return Response(data=errors, status=422)


api_user_creation_view = UserCreationView.as_view()


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=200)
        else:
            errors = json.dumps(serializer.errors)
            return Response(data=errors, status=422)


api_user_password_change_view = PasswordChangeView.as_view()


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        address = self.get_address_queryset(request, *args, **kwargs)
        data = {'phone': request.user.phone, 'street': address.street,
                'city': address.city, 'province': address.province}
        serializer = ProfileSerializer(request, data)
        return Response(serializer.data, status=200)

    def get_address_queryset(self, request, *args, **kwargs):
        return Address.objects.get(user=request.user, default_address=True)

    def post(self, request, *args, **kwargs):
        serializer = ProfileSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=200)
        else:
            errors = json.dumps(serializer.errors)
            return Response(data=errors, status=422)


api_user_profile_view = ProfileView.as_view()


@api_view(['GET'])
def getProvinceInfo(request):
    province_query = Province.objects.all()
    serializer = ProvinceSerializer(data=province_query)
    return Response(data=serializer)


@api_view(['GET'])
def getCityInfo(request, province):
    city_query = City.objects.filter(province=province)
    serializer = CitySerializer(data=city_query)
    return Response(data=serializer)
