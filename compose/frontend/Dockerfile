FROM node:18.5.0

RUN mkdir /src && mkdir /compose

COPY /frontend /src

WORKDIR /src
RUN npm install
RUN npm install -g envsub
RUN npm install -g @angular/cli

COPY /compose/frontend/entrypoint /compose/entrypoint
RUN chmod +x /compose/entrypoint

COPY /compose/frontend/start /compose/start
RUN chmod +x /compose/start

COPY /compose/frontend/local-start /compose/local-start
RUN chmod +x /compose/local-start

ENTRYPOINT [ "/compose/entrypoint" ]