# stage: 1 — build
FROM node:lts-alpine as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install yarn

COPY . .

RUN yarn

COPY src ./src
COPY public ./public

EXPOSE 8080

ENTRYPOINT ["yarn", "start"]
