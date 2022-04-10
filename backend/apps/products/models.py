from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
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
    slug = models.CharField(max_length=255)
    rating = models.IntegerField(
        validators=[MinLengthValidator(0), MaxLengthValidator(5)])
    rating_count = models.IntegerField()
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    image = models.ImageField()
    thumbnail = models.ImageField()
    description = models.TextField()
    type = models.ForeignKey(
        Type, related_name='products', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class SubImage(models.Model):
    product = models.ForeignKey(
        Product, related_name='sub_images', on_delete=models.CASCADE)
    image = models.ImageField()
