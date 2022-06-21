from itertools import product
import math
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from ..models import Category, Product, Type


class MenuBarView(APIView):
    # Get all Categories
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request, *args, **kwargs)
        serializer = CategoryNestingTypesSerializer(queryset, many=True)
        return Response(data=serializer.data)

    def get_queryset(self, request, *args, **kwargs):
        return Category.objects.all().prefetch_related('types')


menu_bar_view = MenuBarView.as_view()


class AbstractProductListView(APIView):
    # Get a list of products according to Type
    authentication_classes = []
    permission_classes = []
    page_size = 16

    def get(self, request, *args, **kwargs):
        queryset, object_count = self.get_queryset_and_count(
            request, *args, **kwargs)
        queryset_serializer = ProductListSerializer(queryset, many=True)
        data = {"results": queryset_serializer.data, "count": object_count}
        return Response(data=data)

    def get_queryset_and_count(self, request, *args, **kwargs):
        queryset = self.get_queryset(request, *args, **kwargs)
        count = queryset.count()
        bottom, top = self.get_range_queryset(count, *args, **kwargs)
        return queryset[bottom:top], count

    def get_range_queryset(self, count, *args, **kwargs):
        page = self.get_page(*args, **kwargs)
        offset = self.get_offset(
            *args, **kwargs) if self.get_offset(*args, **kwargs) else self.page_size
        page_num = math.ceil(count / offset)
        if page > page_num and page_num != 0:
            page = page_num
        top = page*offset
        if top > count:
            top = count
        bottom = (page - 1)*offset
        if bottom > top:
            bottom = top - self.page_size
        return bottom, top

    def get_page(self, *args, **kwargs):
        page_kwargs = kwargs.get("page", 1)
        return self.integer_or_zero(page_kwargs)

    def get_offset(self, *args, **kwargs):
        offset_kwargs = kwargs.get("offset", 0)
        return self.integer_or_zero(offset_kwargs)

    def integer_or_zero(self, number):
        # return integer number or 0 if not integer
        try:
            number = int(number)
            return number
        except ValueError:
            return 1


class ProductListView(AbstractProductListView):
    def get_queryset(self, request, *args, **kwargs):
        if kwargs.get('type'):
            type_slug = kwargs['type']
            queryset = Product.objects.filter(type__slug=type_slug)
        if kwargs.get('category'):
            category_slug = kwargs['category']
            queryset = Product.objects.filter(
                type__categories__slug=category_slug)
        return queryset


api_product_list_view = ProductListView.as_view()


class ProductSearchListView(AbstractProductListView):
    def get_queryset(self, request, *args, **kwargs):
        search_string = kwargs.get('q')
        queryset = Product.objects.filter(slug__icontains=search_string)
        return queryset


api_search_product_list_view = ProductSearchListView.as_view


class ProductDetailView(APIView):
    # Get specific product
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request, *args, **kwargs)
        if queryset:
            serializer = ProductDetailSerializer(queryset)
            return Response(data=serializer.data)
        else:
            return Response(status=404)

    def get_queryset(self, request, *args, **kwargs):
        product_id = kwargs['product_id']
        try:
            return Product.objects.prefetch_related('sub_images').get(id=product_id)
        except Product.DoesNotExist:
            return None


api_product_detail_view = ProductDetailView.as_view()


class SimilarProductView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request, *args, **kwargs)
        if queryset:
            serializer = ProductListSerializer(queryset, many=True)
            return Response(data=serializer.data)
        else:
            return Response(status=404)

    def get_queryset(self, request, *args, **kwargs):
        offset = kwargs.get('offset', 6)
        type_id = kwargs.get('type_id')
        exclude_product_id = kwargs.get('exclude_id')
        if type_id:
            return Product.objects.filter(type=type_id).exclude(id=exclude_product_id)[:offset]
        return None


api_similar_product_view = SimilarProductView.as_view()
