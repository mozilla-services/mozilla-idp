FROM node:0.8

copy . /app
RUN cd /app; npm install
