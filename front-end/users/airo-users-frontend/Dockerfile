# Dockerfile

# preferred node version chosen here (LTS = 20.17.0 as of 30/08/24)
FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

CMD ng serve --host 0.0.0.0