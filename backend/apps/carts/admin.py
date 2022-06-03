from django.contrib import admin
from .models import Cart, CartItem
# Register your models here.


class CartItemAdmin(admin.TabularInline):
    model = CartItem


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemAdmin, ]
    list_display = ['__str__', 'count', ]
