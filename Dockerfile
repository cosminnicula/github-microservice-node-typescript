FROM node:18.9.0-alpine3.15

RUN addgroup appgroup
RUN adduser --ingroup appgroup --disabled-password app
USER app

WORKDIR /home/app

COPY target/application.js application.js
COPY swagger-openapi3.yml swagger-openapi3.yml
ENTRYPOINT ["node","application.js"]