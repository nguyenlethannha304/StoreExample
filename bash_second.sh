#! /bin/bash

# Start nginx (must run with sudo)

cd nginx && bash bash_nginx.sh && rm -rf ./frontend ./static
systemctlsystemctl restart nginx.service