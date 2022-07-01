from django.contrib import admin
from django.utils.html import format_html

from .forms import ProductModelForm
from .models import Category, Product, SubImage, Type

# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name', )}
    list_filter = ('categories',)


class ProductImageInline(admin.TabularInline):
    model = SubImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductModelForm
    list_display = ('name', 'rating', 'price', 'old_price',
                    'quantity', 'type', 'get_thumbnail_image')
    list_filter = ('type', )
    search_fields = ('name', 'type__name')
    inlines = [ProductImageInline, ]

    @admin.display()
    def get_thumbnail_image(self, obj):
        return format_html('<img src="{}" width="50" height="50">'.format(obj.thumbnail.url))
