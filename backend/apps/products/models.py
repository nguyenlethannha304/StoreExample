from django.db import models
import uuid
from django.utils.text import slugify
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, db_index=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class Type(models.Model):
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, db_index=True)
    categories = models.ManyToManyField(Category, related_name='types')

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    image = models.ImageField()
    thumbnail = models.ImageField()
    description = models.TextField()
    type = models.ForeignKey(
        Type, related_name='products', on_delete=models.CASCADE)
