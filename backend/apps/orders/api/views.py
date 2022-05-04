from rest_framework.views import APIView
from rest_framework.response import Response
from http import HTTPStatus
from django.db.models import Prefetch
from django.db import DatabaseError, transaction
from .serializers import CreateOrderSerializer, OrderInformationSerializer
from ..models import Order
import json


class CheckOrderInformationView(APIView):
    '''Retrieve order information from order_id and phone_number'''
    permission_classes = []

    def get(self, request, *args, **kwargs):
        order_id, phone_number = self.get_order_id_and_phone_number_from_queryparams(
            request)
        if order_id and phone_number:
            order_instance = self.get_order_instance(order_id, phone_number)
            serializer = OrderInformationSerializer(order_instance)
        return Response(status=HTTPStatus.BAD_REQUEST)

    def get_order_instance(self, order_id, phone_number):
        queryset = Order.objects.prefetch_related('status')
        queryset = queryset.only(
            'total_price', 'address', 'created_time', 'status__status', 'status__description', 'status__created_time')
        instance = queryset.get(id=order_id, phone_number=phone_number)
        return instance

    def get_order_id_and_phone_number_from_queryparams(self, request):
        order_id = request.query_params.get('order_id', None)
        phone_number = request.query_params.get('phone_number', None)
        return order_id, phone_number


api_check_order_information_view = CheckOrderInformationView.as_view()


class PlaceOrderView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(
            data=request.data, context={'user': request.user})
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    order = serializer.save()
                    order_serializer = OrderInformationSerializer(order)
                    return Response(data=order_serializer.data, status=HTTPStatus.CREATED)
        except DatabaseError:
            return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        return Response(data=serializer.errors, status=HTTPStatus.BAD_REQUEST)


api_place_order_view = PlaceOrderView.as_view()
