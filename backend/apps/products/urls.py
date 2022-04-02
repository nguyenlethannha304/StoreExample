from django.urls import path, include
from .api.views import menu_bar_view, api_product_detail_view, api_product_list_view
app_name = 'products'
urlpatterns = [
]
api_products_urlpatterns = [
    # Pre Url /api/products/
    path('menuBar/', view=menu_bar_view),
    path('t/<slug:type>/', view=api_product_list_view),
    path('<uuid:product_id>/', view=api_product_detail_view),
]
