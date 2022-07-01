from random import random
from test import pick_random_object_from_queryset

from django.apps import apps

from ..products import setUpTestProductApp, tearDownTestProductApp
from ..users import setUpTestUserApp, tearDownTestUserApp

# order app models
Order = apps.get_model('orders', 'Order')
OrderItem = apps.get_model('orders', 'OrderItem')
# product app
Product = apps.get_model('products', 'Product')
# user app models
Address = apps.get_model('users', 'Address')
City = apps.get_model('users', 'City')
Province = apps.get_model('users', 'Province')


def setUpTestOrderApp():
    setUpTestUserApp()
    setUpTestProductApp()


def setUpOrder():
    pass


def tearDownTestOrderApp():
    tearDownTestUserApp()
    tearDownTestProductApp()
