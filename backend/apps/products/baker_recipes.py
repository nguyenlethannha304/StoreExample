from itertools import cycle
from model_bakery.recipe import Recipe, foreign_key, related
from .models import Category, Type, Product
import random


def return_random_rating():
    random_number = random.randrange(0, 5)
    return round(random_number, 1)


# Category
furniture_category = Recipe(Category, name='furniture')
# Type
chair_type = Recipe(Type, name='chair')
table_type = Recipe(Type, name='table')
# Product
chair_name_list = ['modern chair', 'wood chair', 'plastic chair']
chair_products = Recipe(Product, name=cycle(
    chair_name_list), rating=return_random_rating, type=foreign_key(chair_type), quantity=10)
table_name_list = ['modern table', 'wood table', 'plastic table']
table_products = Recipe(Product, name=cycle(
    table_name_list), rating=return_random_rating, type=foreign_key(table_type), quantity=10)
