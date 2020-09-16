FROM node:14

RUN mkdir /code
RUN mkdir /code/backend
WORKDIR /code/backend

VOLUME /code/backend
VOLUME /code/backend/node_modules

CMD ["yarn", "dev"]