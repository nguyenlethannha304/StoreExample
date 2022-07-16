FROM nginx:1.23.0

RUN mkdir -p /var/www && mkdir /compose && mkdir /src

COPY /nginx /src

COPY /compose/nginx/entrypoint /compose/entrypoint
RUN chmod +x /compose/entrypoint

COPY /compose/nginx/start /compose/start
RUN chmod +x /compose/start

COPY /compose/nginx/local-start /compose/local-start
RUN chmod +x /compose/local-start

ENTRYPOINT ["/compose/entrypoint"]