FROM node:0.10.44

WORKDIR /app


# add a non-privileged user for installing and running
# the application
RUN groupadd --gid 10001 app && \
    useradd --uid 10001 --gid 10001 --home /app --create-home app

# install libgmp-dev for fast crypto and 
RUN apt update && \
    apt install -y libgmp-dev

# Install node requirements and clean up unneeded cache data
COPY package.json package.json

RUN npm install && \
    rm -rf /root/.node-gyp && \
    apt-get clean

COPY . /app

# generates a placeholder set of pub/private keys
# make sure to overide these in an actual deployment
RUN ./scripts/gen_keys.js

ENTRYPOINT ["npm"]
CMD ["start"]

USER app
