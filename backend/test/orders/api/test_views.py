from rest_framework.test import APITestCase, APIClient
from django.test import tag
from django.apps import apps
from django.contrib.auth import get_user_model
from .. import setUpTestOrderApp, tearDownTestOrderApp
# UserModel
UserModel = get_user_model()
#
ORDER_URL = 'api/orders/'
CHECK_ORDER_INFOR_URL = ORDER_URL + 'check-order/'
CREATE_ORDER_URL = ORDER_URL + 'place-order/'


def setUpModule():
    setUpTestOrderApp()


def tearDownModule():
    tearDownTestOrderApp()


@tag('orders', 'order_api_view')
class TestCheckOrderInformationView(APITestCase):
    pass


@tag('orders', 'order_api_view')
class TestCreateOrderView(APITestCase):
    pass
