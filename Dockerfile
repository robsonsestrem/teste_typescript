FROM node:20.19.0-alpine3.21

RUN apk add --no-cache bash

USER node

WORKDIR /home/node/app
