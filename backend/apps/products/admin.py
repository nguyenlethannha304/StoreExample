from traceback import format_stack
from django.contrib import admin
from .models import Category, Type, Product
from .forms import ProductModelForm
from django.utils.html import format_html
# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name', )}
    list_filter = ('categories',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductModelForm
    list_display = ('name', 'rating', 'price', 'old_price',
                    'quantity', 'type', 'get_thumbnail_image')
    list_filter = ('type', )

    @admin.display()
    def get_thumbnail_image(self, obj):
        return format_html('<img src="{}" width="50" height="50">'.format(obj.thumbnail.url))
