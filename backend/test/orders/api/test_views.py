from http import HTTPStatus
from rest_framework.test import APITestCase, APIClient
from django.test import tag
from django.apps import apps
from django.contrib.auth import get_user_model
from .. import setUpTestOrderApp, tearDownTestOrderApp
from . import setFakeData
# UserModel
UserModel = get_user_model()
Order = apps.get_model('orders', 'Order')
#
ORDER_URL = '/api/orders/'
CHECK_ORDER_INFOR_URL = ORDER_URL + 'check-order/'
PLACE_ORDER_URL = ORDER_URL + 'place-order/'


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('orders', 'order_api_view')
class TestCheckOrderInformationView(APITestCase):
    def setUp(self):
        self.fake_data = setFakeData()
        self.client = APIClient()
        response = self.client.post(
            PLACE_ORDER_URL, data=self.fake_data, format='json')
        self.order = Order.objects.get(
            created_time=response.data['created_time'])

    def test_get_request(self):
        order_id = self.order.id.__str__()
        phone_number = self.fake_data['phone_number']
        response = self.client.get(
            f'{CHECK_ORDER_INFOR_URL}?order_id={order_id}&phone_number={phone_number}')
        data = response.data


@ tag('orders', 'order_api_view', 'cr')
class TestCreateOrderView(APITestCase):
    def setUp(self):
        self.fake_data = setFakeData()
        self.client = APIClient()

    def test_bad_request_response(self):
        # Change item_price to cause invalid serializer
        self.fake_data['item_price'] = 0
        response = self.client.post(
            PLACE_ORDER_URL, data=self.fake_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def test_created_response(self):
        response = self.client.post(
            PLACE_ORDER_URL, data=self.fake_data, format='json')
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
