#! /bin/bash

FILE_PATH=$(realpath $0)

BASE_DIR=$(dirname $FILE_PATH)

# Build frontend

cd frontend && bash bash_frontend.sh

cd $BASE_DIR

# Start backend

cd backend && bash bash_backend.sh

