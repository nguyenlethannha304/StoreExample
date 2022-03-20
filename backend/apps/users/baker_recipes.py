from itertools import cycle
from model_bakery.recipe import Recipe, foreign_key
from django.contrib.auth import get_user_model

from apps.users.models import City, Province
UserModel = get_user_model()

# User (hash password before test something related to password)
testing_user = Recipe(
    UserModel, email='testing_user@gmail.com', phone='', password='12345678', is_staff=False, is_active=True, is_superuser=False)
testing_user1 = Recipe(
    UserModel, email='testing_user1@gmail.com', phone='', password='12345678', is_staff=False, is_active=True, is_superuser=False)
# Adress 1
province1 = Recipe(
    Province, name='P1'
)
city_name_list1 = ['C01', 'C02']
city_of_province1 = Recipe(
    City, name=cycle(city_name_list1), province=foreign_key(province1)
)
# Adress 2
province2 = Recipe(
    Province, name='P2'
)
city_name_list2 = ['C11', 'C12']
city_of_province2 = Recipe(
    City, name=cycle(city_name_list2), province=foreign_key(province2)
)
