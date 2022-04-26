from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import CartItem, Cart


@receiver(post_save, sender=CartItem)
def update_cart_count_when_add_new_itemcart(sender, instance, created, **kwargs):
    if created:
        # Increase count by 1
        Cart.change_cart_count(instance.cart_id, 1)


@receiver(post_delete, sender=CartItem)
def update_cart_count_when_delete_itemcart(sender, instance, **kwargs):
    # Decrease count by 1
    Cart.change_cart_count(instance.cart_id, -1)
