from django.apps import apps
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Address

UserModel = get_user_model()
Cart = apps.get_model('carts', 'Cart')
UserOrder = apps.get_model('orders', 'UserOrder')


@receiver(post_save, sender=UserModel)
def create_adress_for_new_user(sender, instance, created, **kwargs):
    '''Create empty address object for new users'''
    if created is True:
        address = Address()
        address.save()
        instance.address = address
        instance.save()


@receiver(post_save, sender=UserModel)
def create_cart_for_new_user(sender, instance, created, **kwargs):
    if created is True:
        cart = Cart(user=instance)
        cart.save()


@receiver(post_save, sender=UserModel)
def create_order_list_for_new_user(sender, instance, created, **kwargs):
    if created is True:
        user_order = UserOrder(user=instance)
        user_order.save()
