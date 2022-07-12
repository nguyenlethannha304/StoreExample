FROM node:18.5.0 AS angular-builder

COPY . /src

WORKDIR /src

RUN npm install -g @angular/cli

RUN npm install

RUN chmod +x entrypoint

ENTRYPOINT [ "./entrypoint" ]