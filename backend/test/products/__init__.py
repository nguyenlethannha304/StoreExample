from django.apps import apps
from django.utils.text import slugify
from model_bakery import baker

Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')


def setUpTestProductApp():
    baker.make_recipe('products.chair_products', _quantity=3)
    baker.make_recipe('products.table_products', _quantity=3)
    # Assign many-to-many categories for Type
    furniture_category = baker.make_recipe('products.furniture_category')
    types = Type.objects.all()
    for type in types:
        type.categories.add(furniture_category)
        type.save()
    # Slugify products
    slugify_product_model()


def slugify_product_model():
    # Creating from model_bakery don't include slugify
    products = Product.objects.all()
    for product in products:
        product.slug = slugify(product.name)
        product.save()
    types = Type.objects.all()
    for type in types:
        type.slug = slugify(type.name)
        type.save()
    categories = Category.objects.all()
    for category in categories:
        category.slug = slugify(category.name)
        category.save()


def tearDownTestProductApp():
    Category.objects.all().delete()
    Type.objects.all().delete()
    Product.objects.all().delete()
