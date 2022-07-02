#!/bin/bash

# Import variable
export $(sed '/^\#/d' ../env/django_env)
export $(sed '/^\#/d' ../env/post_env)

gunicorn settings.wsgi --bind 0.0.0.0:5000