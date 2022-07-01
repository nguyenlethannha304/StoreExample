from copy import deepcopy

from django.conf import settings
from django.test import Client


def new_data_with_change(data, field_change, new_value):
    # Create new dict from data and new_value for field_change
    rv = deepcopy(data)
    rv[field_change] = new_value
    return rv


def test_redirect_to_login(method='get', request_url=None):
    # Test unauthenticated_user redirect to login view
    # with parameter ?next=login_url + request_url
    not_login_client = Client()
    if request_url is None:
        raise ValueError('Url value is empty')
    response = getattr(not_login_client, method)(request_url)
    if response.status_code == 404:
        raise ValueError(f"Incorrect url value: {request_url}")
    assert response.status_code == 302, ('Request not redirect')
    location_header = response.headers['Location']
    assert location_header == f'{settings.LOGIN_URL}?next={request_url}', (
        f'Incorrect location header: {location_header}')
