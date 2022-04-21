import random


def pick_random_object_from_queryset(queryset):
    queryset_len = len(queryset)
    random_number = random.randint(0, queryset_len - 1)
    return queryset[random_number]
