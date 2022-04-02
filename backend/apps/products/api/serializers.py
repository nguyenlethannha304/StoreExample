from rest_framework import serializers
from django.apps import apps
__all__ = ['TypeSerializer', 'CategoryNestingTypesSerializer',
           'ProductDetailSerializer', 'ProductListSerializer']
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['name', 'slug']


class CategoryNestingTypesSerializer(serializers.ModelSerializer):
    types = TypeSerializer(many=True)

    class Meta:
        model = Category
        fields = ['name', 'types']


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id',  'price', 'thumbnail']
