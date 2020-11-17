FROM node:12.19.1-stretch

RUN apt-get update -y

RUN apt-get install -y openjdk-8-jre

RUN npm install -g firebase-tools
