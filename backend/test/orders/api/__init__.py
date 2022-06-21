import copy
import random
from sys import breakpointhook
from django.apps import apps
from test import pick_random_object_from_queryset
# Product model
Product = apps.get_model('products', 'Product')
# user app models
Address = apps.get_model('users', 'Address')
City = apps.get_model('users', 'City')
Province = apps.get_model('users', 'Province')
# order app models
Order = apps.get_model('orders', 'Order')
OrderItem = apps.get_model('orders', 'OrderItem')
FAKE_DATA_CREATE_ORDER = {'products': [], 'address': {
}, 'use_profile_contact': False, 'phone_number': '0979311359', 'item_price': 0, 'total_price': 0, 'email': 'abc@gmail.com'}


def chose_random_number_lte_5():
    return random.randint(1, 5)


def setFakeData(use_profile_contact=False):
    fake_data = copy.deepcopy(FAKE_DATA_CREATE_ORDER)
    item_price = 0
    # products, item_price, total_price
    products = Product.objects.filter(quantity__gte=5).order_by('?')[:2]
    for product in products:
        random_quantity = chose_random_number_lte_5()
        item_price += random_quantity*product.price
        fake_data['products'].append(
            {'id': product.pk.__str__(), 'quantity': random_quantity, 'price': product.price*random_quantity})
    fake_data['item_price'] = item_price
    fake_data['total_price'] = item_price
    # address
    province = pick_random_object_from_queryset(
        Province.objects.all())
    city = pick_random_object_from_queryset(province.cities.all())
    fake_data['address'] = {
        'street': '1234 random St', 'city': city.pk, 'province': province.pk}
    # use_profile_contact
    fake_data['use_profile_contact'] = use_profile_contact
    return fake_data
