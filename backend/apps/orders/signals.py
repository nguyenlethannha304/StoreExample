from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderStatus


@receiver(post_save, sender=Order)
def create_first_status_when_order_created(sender, instance, created, **kwargs):
    if created:
        OrderStatus.objects.create(order=instance, status='PE')
