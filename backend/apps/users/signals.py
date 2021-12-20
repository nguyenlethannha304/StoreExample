from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Address


@receiver(post_save, sender=CustomUser)
def create_adress_for_new_user(sender, instance, created, **kwargs):
    '''Create empty address object for new users'''
    if created is True:
        address = Address(user=instance, default_address=True)
        address.save()
