FROM nginx:1.23.0

RUN mkdir -p /var/www

COPY . /src

WORKDIR /src

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x entrypoint

ENTRYPOINT ["./entrypoint"]