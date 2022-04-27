from rest_framework import serializers
from ..models import Order, OrderStatus


class OrderInformationSerializer(serializers):
    class Meta:
        model = Order
        fields = ['item_prices', 'shipping_fee',
                  'total_price', 'address', 'created_date']
