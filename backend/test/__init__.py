import random


def pick_random_object_from_queryset(object_queryset):
    queryset_len = len(object_queryset)
    random_number = random.randint(0, queryset_len - 1)
    return object_queryset[random_number]
