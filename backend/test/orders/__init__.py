from random import random
from django.apps import apps
from ..users import setUpTestUserApp, tearDownTestUserApp
from ..products import setUpTestProductApp, tearDownTestProductApp
from test import pick_random_object_from_queryset
# order app models
Order = apps.get_model('orders', 'Order')
ItemOrder = apps.get_model('orders', 'ItemOrder')
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
