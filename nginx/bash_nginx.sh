
#! /bin/bash

mkdir -p /var/www/

# Copy angular to 
cp -rp ./frontend /var/www/

# Copy django static for admin page
cp -rp ./static /var/www/

# Get variable from django env
export $(sed '/#/d' ../env/django_env)

envsubst '$DJ_ADDRESS' < ./default-template.nginx > ./default #replace Varialbe in template
cp -p ./default /etc/nginx/sites-available/
nginx -s reload