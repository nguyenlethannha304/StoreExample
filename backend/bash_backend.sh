#!/bin/bash

# Import variable
export $(sed '/^\#/d' ../env/django_env)
export $(sed '/^\#/d' ../env/post_env)

# Export static for admin page
python ./manage.py collectstatic --noinput

# Run server
gunicorn settings.wsgi --bind 0.0.0.0:5000