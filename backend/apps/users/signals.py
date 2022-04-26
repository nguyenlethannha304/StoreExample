from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Address
from django.contrib.auth import get_user_model
from django.apps import apps
UserModel = get_user_model()
Cart = apps.get_model('carts', 'Cart')


@receiver(post_save, sender=UserModel)
def create_adress_for_new_user(sender, instance, created, **kwargs):
    '''Create empty address object for new users'''
    if created is True:
        address = Address(user=instance, default_address=True)
        address.save()


@receiver(post_save, sender=UserModel)
def create_cart_for_new_user(sender, instance, created, **kwargs):
    if created is True:
        cart = Cart(user=instance)
        cart.save()
