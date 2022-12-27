FROM node:18-slim As development

WORKDIR /usr/src/app

RUN apt-get -y update
RUN apt-get -y upgrade

RUN apt-get -y install python3 make g++ openssl procps

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
