from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from model_bakery import baker
UserModel = get_user_model()
Province = apps.get_model('users', 'Province')
City = apps.get_model('users', 'City')
Address = apps.get_model('users', 'Address')


def setUpTestUser():
    # Create user instances and hash its password
    testing_user = baker.make_recipe('users.testing_user')
    testing_user.password = make_password(testing_user.password)
    testing_user.save()
    testing_user1 = baker.make_recipe('users.testing_user1')
    testing_user1.password = make_password(testing_user1.password)
    testing_user1.save()
    # Create Provinces and Cities instances
    baker.make_recipe('users.city_of_province1', _quantity=2)
    baker.make_recipe('users.city_of_province2', _quantity=2)


def tearDownTestUser():
    UserModel.objects.all().delete()
    Province.objects.all().delete()
    City.objects.all().delete()
    Address.objects.all().delete()
