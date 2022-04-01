from django.apps import apps
from django.test import tag, TestCase
from django.utils.text import slugify
from model_bakery import baker
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')


def setUpModule():
    baker.make_recipe('products.chair_products', _quantity=3)
    baker.make_recipe('products.table_products', _quantity=3)
    # For some reason model_bakery not use save method for product --> not slugify before save (Category and Type are fine)
    products = Product.objects.all()
    for product in products:
        product.slug = slugify(product.name)
        product.save()


def tearDownModule():
    Category.objects.all().delete()
    Type.objects.all().delete()
    Product.objects.all().delete()


@tag('product', 'product_model')
class TestCategory(TestCase):
    def test_slug(self):
        all_categories_objects = Category.objects.all()
        if all_categories_objects:
            a_category_obj = all_categories_objects[0]
            # Check slug is result from slugify of name
            self.assertEqual(a_category_obj.slug, slugify(a_category_obj.name))
        else:
            self.assertEqual('Error', 'Category is empty')


@tag('product', 'product_model')
class TestType(TestCase):
    def test_slug(self):
        all_types_objects = Type.objects.all()
        if all_types_objects:
            a_type_obj = all_types_objects[0]
            # Check slug is result from slugify of name
            self.assertEqual(a_type_obj.slug, slugify(a_type_obj.name))
        else:
            self.assertEqual('Error', 'Type is empty')


@tag('product', 'product_model')
class TestProduct(TestCase):
    def test_slug(self):
        all_products_objects = Product.objects.all()
        if all_products_objects:
            a_product_obj = all_products_objects[0]
            # Check slug is result from slugify of name
            self.assertEqual(a_product_obj.slug, slugify(a_product_obj.name))
        else:
            self.assertEqual('Error', 'Product is empty')
