#! /bin/bash

mkdir -p /var/www/

cp -p ../frontend/dist/frontend /var/www/

cp -p ./default /etc/nginx/