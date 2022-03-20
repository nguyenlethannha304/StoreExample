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
            json_errors = json.dumps(serializer.errors)
            return Response(data=json_errors, status=422)


api_user_creation_view = UserCreationView.as_view()


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=200)
        else:
            json_errors = json.dumps(serializer.errors)
            return Response(data=json_errors, status=422)


api_user_password_change_view = PasswordChangeView.as_view()


class PhoneChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = PhoneSerializer(request.user.phone)
        return Response(data=serializer)

    def post(self, request, *args, **kwargs):
        serializer = PhoneSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=200)
        else:
            json_errors = json.dumps(serializer.errors)
            return Response(data=json_errors, status=422)


api_phone_change_view = PhoneChangeView.as_view()


class AddressChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        address = Address.objects.get(user=request.user)
        serializer = AddressSerializer(request, address)
        return Response(data=serializer)

    def post(self, request, *args, **kwargs):
        serializer = AddressSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=200)
        else:
            json_errors = json.dumps(serializer.errors)
            return Response(data=json_errors, status=422)


api_address_change_view = AddressChangeView.as_view()


class ProfileChangeView(APIView):
    def get(self, request, *args, **kwargs):
        city = province = ''
        address = Address.objects.get(user=request.user)
        if address.city != None:
            city = City.objects.get(id=address.city.id)
            city = CitySerializer(city)
        if address.province != None:
            province = Province.objects.get(id=address.province.id)
            province = ProvinceSerializer(province)
        rv_dict = {'phone': request.user.phone, 'street': address.street,
                   'province': province, 'city': city}
        return Response(json.dumps(rv_dict))

    def post(self, request, *args, **kwargs):
        phone_serializer = PhoneSerializer(request, data=request.data)
        address_serializer = AddressSerializer(request, data=request.data)
        if phone_serializer.is_valid() and address_serializer.is_valid():
            phone_serializer.save()
            address_serializer.save()
            return Response(status=200)
        else:
            errors = phone_serializer.errors.update(address_serializer.errors)
            json_errors = json.dumps(errors)
            return Response(data=json_errors, status=422)


api_profile_change_view = ProfileChangeView.as_view()


@api_view(['GET'])
def api_get_province_view(request):
    province_query = Province.objects.all()
    serializer = ProvinceSerializer(data=province_query)
    return Response(data=serializer)


@api_view(['GET'])
def api_get_city_view(request, province_id):
    city_query = City.objects.filter(province=province_id)
    serializer = CitySerializer(data=city_query)
    return Response(data=serializer)
