FROM node:16.15.0-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm i allure-commandline -g
RUN apk add openjdk8-jre
ADD . /app/
ENTRYPOINT ["sh", "run.sh"]