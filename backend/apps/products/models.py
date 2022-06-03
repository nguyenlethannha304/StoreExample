from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
import uuid
from django.utils.text import slugify
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, db_index=True)

    def __str__(self):
        return '%s' % (self.name)


class Type(models.Model):
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, db_index=True)
    categories = models.ManyToManyField(Category, related_name='types')

    def __str__(self):
        return '%s' % (self.name)


class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, blank=True)
    rating = models.IntegerField(default=0,
                                 validators=[MinLengthValidator(0), MaxLengthValidator(5)])
    rating_count = models.IntegerField(default=0)
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    image = models.ImageField(null=True)
    thumbnail = models.ImageField(null=True, blank=True)
    description = models.TextField(blank=True)
    type = models.ForeignKey(
        Type, related_name='products', on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.name)

    def delete(self):
        self.image.delete()
        self.thumbnail.delete()
        return super().delete()


class SubImage(models.Model):
    product = models.ForeignKey(
        Product, related_name='sub_images', on_delete=models.CASCADE)
    image = models.ImageField()

    def delete(self):
        self.image.delete()
        return super().delete()
