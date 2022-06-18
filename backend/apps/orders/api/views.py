from rest_framework.views import APIView
from rest_framework.response import Response
from http import HTTPStatus
from django.db import DatabaseError, transaction

from .serializers import CreateOrderSerializer, OrderInformationSerializer, StateSerializer
from ..models import Order, OrderState
import json
import copy
from django.apps import apps

CartItem = apps.get_model('carts', 'CartItem')


class CheckOrderInformationView(APIView):
    '''Retrieve order information from order_id and phone_number'''
    permission_classes = []

    def get(self, request, *args, **kwargs):
        order_id, phone_number = self.get_order_id_and_phone_number_from_queryparams(
            request)
        if self.is_order_exist(order_id, phone_number):
            order_states = self.get_order_states(order_id)
            order_serializer, order_state_serializer = self.serializer_order_and_states(
                self.order_instance, order_states)
            data = copy.deepcopy(order_serializer.data)
            data.update({'states': order_state_serializer.data})
            return Response(data=json.dumps(data), status=HTTPStatus.OK)
        return Response(status=HTTPStatus.BAD_REQUEST)

    def is_order_exist(self, order_id, phone_number):
        self.order_instance = self.get_order_instance(order_id, phone_number)
        return self.order_instance

    def get_order_instance(self, order_id, phone_number):
        query = Order.objects.only('id', 'item_price', 'shipping_fee',
                                   'total_price', 'phone_number', 'created_time', 'address__street', 'address__province', 'address__city')
        query = query.select_related('address')
        return query.get(pk=order_id, phone_number=phone_number)

    def get_order_states(self, order_id):
        query = OrderState.objects.filter(order_id=order_id)
        return query.only('state', 'description', 'created_time')

    def get_order_id_and_phone_number_from_queryparams(self, request):
        order_id = request.query_params.get('order_id', None)
        phone_number = request.query_params.get('phone_number', None)
        return order_id, phone_number

    def serializer_order_and_states(self, order_instance, order_states):
        order_serializer = OrderInformationSerializer(order_instance)
        order_state_serializer = StateSerializer(order_states, many=True)
        return order_serializer, order_state_serializer


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
                    self.clear_online_cart(request)
                    order_serializer = OrderInformationSerializer(order)
                    return Response(data=order_serializer.data, status=HTTPStatus.CREATED)
        except DatabaseError:
            return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        return Response(data=serializer.errors, status=HTTPStatus.BAD_REQUEST)

    def clear_online_cart(self, request):
        if(request.user.is_authenticated):
            CartItem.objects.filter(cart_id=request.user.pk).delete()


api_place_order_view = PlaceOrderView.as_view()
