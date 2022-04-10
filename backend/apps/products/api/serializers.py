from rest_framework import serializers
from django.apps import apps
__all__ = ['TypeSerializer', 'CategoryNestingTypesSerializer',
           'ProductDetailSerializer', 'ProductListSerializer']
Category = apps.get_model('products', 'Category')
Type = apps.get_model('products', 'Type')
Product = apps.get_model('products', 'Product')
SubImage = apps.get_model('products', 'SubImage')


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['name', 'slug']


class CategoryNestingTypesSerializer(serializers.ModelSerializer):
    types = TypeSerializer(many=True)

    class Meta:
        model = Category
        fields = ['name', 'types']


class SubImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubImage
        fields = ['image']


class ProductDetailSerializer(serializers.ModelSerializer):
    sub_images = SubImageSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'rating', 'rating_count', 'price', 'old_price',
                  'quantity', 'image', 'description', 'type', 'sub_images']


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id',  'price', 'thumbnail']
