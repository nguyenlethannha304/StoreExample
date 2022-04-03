from django.apps import apps
from model_bakery import baker
from django.utils.text import slugify
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')


def setUpForProductsTest():
    baker.make_recipe('products.chair_products', _quantity=3)
    baker.make_recipe('products.table_products', _quantity=3)
    # Assign many-to-many categories for Type
    furniture_category = baker.make_recipe('products.furniture_category')
    types = Type.objects.all()
    for type in types:
        type.categories.add(furniture_category)
        type.save()


def tearDownForProductsTest():
    Category.objects.all().delete()
    Type.objects.all().delete()
    Product.objects.all().delete()