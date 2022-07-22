FROM ubuntu:18.04

WORKDIR /src

RUN mkdir db && mkdir backup

COPY ./compose/database-backup /src

RUN chmod +x entrypoint

ENTRYPOINT [ "/src/entrypoint" ]