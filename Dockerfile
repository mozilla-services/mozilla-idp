FROM node:0.8

WORKDIR /app
COPY . /app

# install libgmp-dev for fast crypto and 
# remove cached data to reduce container size
RUN apt update && \
    apt install -y libgmp-dev && \
    npm install && \
    rm -rf /root/.node-gyp && \
    apt-get clean
