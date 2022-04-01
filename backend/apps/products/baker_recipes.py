from itertools import cycle
from model_bakery.recipe import Recipe, foreign_key, related
from .models import Category, Type, Product

category1 = Recipe(Category, name='furniture')
type1 = Recipe(Type, name='chair', categories=related(category1))
type2 = Recipe(Type, name='table', categories=related(category1))
chair_name_list = ['modern chair', 'wood chair', 'plastic chair']
chair_products = Recipe(Product, name=cycle(
    chair_name_list), type=foreign_key(type1))
table_name_list = ['modern table', 'wood table', 'plastic table']
table_products = Recipe(Product, name=cycle(
    table_name_list), type=foreign_key(type2))
