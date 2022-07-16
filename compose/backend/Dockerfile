FROM python:3.10.5

RUN apt update && apt install -y build-essential && apt install -y libpq-dev

RUN mkdir /src && mkdir /compose

COPY /backend /src

RUN pip install -r /src/requirement/production.txt \
    && rm -rf requirement
    
COPY /compose/backend/entrypoint /compose/entrypoint
RUN chmod +x /compose/entrypoint

COPY /compose/backend/start /compose/start
RUN chmod +x /compose/start

ENTRYPOINT [ "/compose/entrypoint"]