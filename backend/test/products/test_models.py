from this import d
from django.apps import apps
from django.test import tag, TestCase
from django.utils.text import slugify
from model_bakery import baker
from . import setUpTestProduct, tearDownTestProduct, pick_random_object_from_queryset
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')


def setUpModule():
    setUpTestProduct()


def tearDownModule():
    tearDownTestProduct()


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
        product_queryset = Product.objects.all()
        if product_queryset:
            a_product_obj = product_queryset[0]
            # Check slug is result from slugify of name
            self.assertEqual(a_product_obj.slug, slugify(a_product_obj.name))
        else:
            self.assertEqual('Error', 'Product is empty')

    def test_rating_min_max(self):
        product_queryset = Product.objects.all()
        if product_queryset:
            random_object = pick_random_object_from_queryset(product_queryset)
            # Test min and max of product.rating
            self.assertLessEqual(random_object.rating, 5)
            self.assertGreaterEqual(random_object.rating, 0)
