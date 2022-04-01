from rest_framework.views import APIView


class TypeListView(APIView):
    # Get a list of types according to Category
    pass


api_list_type_view = TypeListView.as_view()


class CategoryListView(APIView):
    # Get all Categories
    pass


api_category_list_view = CategoryListView.as_view()


class ProductListView(APIView):
    # Get a list of products according to Type
    pass


api_product_list_view = ProductListView.as_view()


class ProductDetailView(APIView):
    # Get specific product
    pass


api_product_detail_view = ProductDetailView.as_view()
