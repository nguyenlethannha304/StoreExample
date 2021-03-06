from django.contrib import admin

from .models import Order, OrderItem, OrderState, UserOrder

# Register your models here.


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    pass


@admin.register(UserOrder)
class UserOrderAdmin(admin.ModelAdmin):
    pass


@admin.register(OrderState)
class OrderStateAdmin(admin.ModelAdmin):
    pass
