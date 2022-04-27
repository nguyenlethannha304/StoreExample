from rest_framework.views import APIView
from rest_framework.response import Response
from http import HTTPStatus
from django.db.models import Prefetch
from .serializers import OrderInformationSerializer
from ..models import Order


class CheckOrderInformationView(APIView):
    def get(self, request, *args, **kwargs):
        order_id, phone_number = self.get_order_id_and_phone_number_from_queryparams(
            request)
        if order_id and phone_number:
            order_instance = self.get_order_instance(order_id, phone_number)
            serializer = OrderInformationSerializer(order_instance)
        return Response(status=HTTPStatus.BAD_REQUEST)

    def get_order_instance(self, order_id, phone_number):
        order_instance = Order.objects.prefetch_related('status').get(
            id=order_id, phone_number=phone_number)

    def get_order_id_and_phone_number_from_queryparams(self, request):
        order_id = request.get('order_id', None)
        phone_number = request.get('phone_number', None)
        return order_id, phone_number
