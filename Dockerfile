FROM node:0.10

copy . /app
RUN cd /app; npm install
