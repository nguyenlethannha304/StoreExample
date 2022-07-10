FROM python:3.10.5 AS django-builder

RUN apt update && apt install -y build-essential && apt install -y libpq-dev

COPY ./ /src

WORKDIR /src

RUN pip install -r requirement/production.txt \
    && rm -rf requirement

RUN chmod +x entrypoint
RUN chmod +x start

ENTRYPOINT [ "./entrypoint"]