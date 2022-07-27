FROM nginx:1.23.0

RUN mkdir -p /var/www && mkdir /compose && mkdir /src

COPY /nginx /src

COPY /compose/nginx/ /compose/
RUN chmod +x /compose/*

ENTRYPOINT ["/compose/entrypoint"]