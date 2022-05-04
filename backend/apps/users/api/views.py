from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
import json
from rest_framework.permissions import IsAuthenticated
from ..models import Address, Province, City
from rest_framework.decorators import api_view
from http import HTTPStatus


class UserCreationView(APIView):

    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=HTTPStatus.CREATED)
        json_errors = json.dumps(serializer.errors)
        return Response(data=json_errors, status=HTTPStatus.UNPROCESSABLE_ENTITY)


api_user_creation_view = UserCreationView.as_view()


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=HTTPStatus.OK)
        json_errors = json.dumps(serializer.errors)
        return Response(data=json_errors, status=HTTPStatus.UNPROCESSABLE_ENTITY)


api_user_password_change_view = PasswordChangeView.as_view()


class ProfileView(APIView):
    def get(self, request, *args, **kwargs):
        city_data = province_data = ''
        address = Address.objects.select_related(
            'city', 'province').get(pk=request.user.address_id)
        city_data = self.get_city_data(address)
        province_data = self.get_province_data(address)
        rv_dict = {'phone': request.user.phone, 'street': address.street,
                   'province': province_data, 'city': city_data}
        return Response(data=json.dumps(rv_dict))

    def get_city_data(self, address):
        if address.city != None:
            city = CitySerializer(address.city)
            return city.data
        return ''

    def get_province_data(self, address):
        if address.province is not None:
            province = ProvinceSerializer(address.province)
            return province.data
        return ''

    def post(self, request, *args, **kwargs):
        phone_serializer = PhoneSerializer(request, data=request.data)
        address_serializer = UserAddressSerializer(request, data=request.data)
        if phone_serializer.is_valid() and address_serializer.is_valid():
            phone_serializer.save()
            address_serializer.save()
            return Response(status=HTTPStatus.OK)
        errors = phone_serializer.errors.update(address_serializer.errors)
        json_errors = json.dumps(errors)
        return Response(data=json_errors, status=HTTPStatus.UNPROCESSABLE_ENTITY)


api_profile_view = ProfileView.as_view()


@api_view(['GET'])
def api_get_province_view(request):
    province_query = Province.objects.all()
    serializer = ProvinceSerializer(province_query, many=True)
    return Response(data=serializer.data)


@api_view(['GET'])
def api_get_city_view(request, province_id):
    city_query = City.objects.filter(province=province_id)
    serializer = CitySerializer(city_query, many=True)
    return Response(data=serializer.data)


@api_view(['GET'])
def api_get_provinces_cities(request):
    # Get provinces nesting its cities
    query = Province.objects.prefetch_related('cities').all()
    serializer = ProvinceCitiesSerializer(query, many=True)
    return Response(data=serializer.data)
