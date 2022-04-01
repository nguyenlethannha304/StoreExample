from rest_framework import serializers


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['name']


class CategorySerializer(serializers.ModelSerializer):
    types = TypeSerializer(many=True)

    class Meta:
        fields = ['name', 'types']


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id',  'price', 'old_price', 'thumbnail']
