from django.core.files.uploadedfile import InMemoryUploadedFile
from django import forms
from django.core.files.images import ImageFile
from .models import Product
from PIL import Image
import io
from django.utils.text import slugify


def create_thumbnail_from_image(image_field, field_name='thumbnail'):
    name, ext = image_field.name.split('.')
    thumbnail_name = name + '_thumbnail.' + ext
    with Image.open(image_field.file) as im:
        if im.mode != 'RGB':
            im = im.convert('RGB')
        im.thumbnail((128, 128))
        thumbnail_bytes = io.BytesIO()
        im.save(thumbnail_bytes, format='JPEG')
    return image_field.__class__(thumbnail_bytes, field_name, thumbnail_name, image_field.content_type, thumbnail_bytes.__sizeof__(), image_field.charset, image_field.content_type_extra)


def crop_image_to_square(image_field, field_name='image'):
    name, ext = image_field.name.split('.')
    with Image.open(image_field.file) as im:
        if im.height == im.width:
            return image_field
        output_image = io.BytesIO()
        im = _crop_image_to_ratio(im, 1, 1)
        im.save(output_image, format=ext)
    return image_field.__class__(output_image, field_name, image_field.name, image_field.content_type, output_image.__sizeof__(), image_field.charset, image_field.content_type_extra)


def _crop_image_to_ratio(image, ratio_width, ratio_height):
    if image.width/ratio_width == image.height/ratio_height:
        return image
    elif image.width/ratio_width > image.height/ratio_height:
        new_height = image.height
        new_width = image.width - \
            (image.width/ratio_width - image.height/ratio_height)*ratio_width
    elif image.width/ratio_width < image.height/ratio_height:
        new_width = image.width
        new_height = image.height - \
            (image.height/ratio_height - image.width/ratio_width)*ratio_height
    (left, upper, right, lower) = _calculate_position_of_image_after_crop(
        image, new_width, new_height)
    image = image.crop((left, upper, right, lower))
    return image


def _calculate_position_of_image_after_crop(image, new_width, new_height):
    left, upper = 0, 0
    right, lower = image.width, image.height
    if image.width != new_width:
        reduce_size = image.width - new_width
        left += reduce_size/2
        right -= reduce_size/2
    if image.height != new_height:
        reduce_size = image.height - new_height
        upper += reduce_size/2
        lower -= reduce_size/2
    return (left, upper, right, lower)


class ProductModelForm(forms.ModelForm):

    class Meta:
        model = Product
        fields = ('name', 'slug', 'price', 'old_price', 'quantity',
                  'image', 'thumbnail',  'description', 'type')

    class Media:
        js = ('js/products/hide_product_field_form.js',)

    def clean_image(self):
        image = self.cleaned_data['image']
        if 'image' in self.changed_data:
            image = crop_image_to_square(image)
        return image

    def clean_thumbnail(self):
        thumbnail = self.cleaned_data['thumbnail']
        if 'image' in self.changed_data:
            thumbnail = self.update_thumbnail_when_change_image()
        return thumbnail

    def clean_slug(self):
        slug = self.cleaned_data['slug']
        if 'name' in self.changed_data:
            slug = self.update_slug_when_change_name()
        return slug

    def update_thumbnail_when_change_image(self):
        return create_thumbnail_from_image(self.cleaned_data['image'])

    def update_slug_when_change_name(self):
        return slugify(self.cleaned_data['name'])
