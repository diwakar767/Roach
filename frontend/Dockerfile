FROM node:18-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./
# The lockfile is npm v1. npm 7+ rewrites it and refetches every package record,
# which fails on flaky networks. npm 6 installs that lockfile directly.
RUN npm install -g npm@6 && npm ci

COPY . .

ARG REACT_APP_BACKEND_URL=
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV CI=false

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
