from django.apps import apps
from model_bakery import baker
from django.utils.text import slugify
import random
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
    # Slugify products
    products = Product.objects.all()
    for product in products:
        product.slug = slugify(product.name)
        product.save()


def tearDownForProductsTest():
    Category.objects.all().delete()
    Type.objects.all().delete()
    Product.objects.all().delete()


def pick_random_object_from_queryset(object_queryset):
    queryset_len = len(object_queryset)
    random_number = random.randint(0, queryset_len - 1)
    return object_queryset[random_number]
