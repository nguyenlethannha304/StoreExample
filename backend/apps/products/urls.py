from django.urls import path, include
from .api.views import api_category_list_view, api_product_detail_view, api_product_list_view
app_name = 'products'
urlpatterns = [
]
api_products_urlpatterns = [
    # Pre Url /api/products/
    path('menuBar/', view=api_category_list_view),
    path('t/<slug:type>/', view=api_product_list_view),
    path('<slug:product>/', view=api_product_detail_view),
]
