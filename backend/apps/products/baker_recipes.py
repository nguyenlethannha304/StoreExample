from itertools import cycle
from model_bakery.recipe import Recipe, foreign_key, related
from .models import Category, Type, Product
# Category
furniture_category = Recipe(Category, name='furniture')
# Type
chair_type = Recipe(Type, name='chair')
table_type = Recipe(Type, name='table')
# Product
chair_name_list = ['modern chair', 'wood chair', 'plastic chair']
chair_products = Recipe(Product, name=cycle(
    chair_name_list), type=foreign_key(chair_type))
table_name_list = ['modern table', 'wood table', 'plastic table']
table_products = Recipe(Product, name=cycle(
    table_name_list), type=foreign_key(table_type))
