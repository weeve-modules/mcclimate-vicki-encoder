FROM node:alpine

# copy docker-entrypoint to initialize multi-stage build
COPY ./docker/docker-entrypoint.sh /app/
COPY ./package.json /app/
WORKDIR /app
RUN set NODE_OPTIONS=--max-old-space-size=30720
RUN npm install
SHELL ["/bin/bash", "-c"]
COPY ./src /app/src
RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# expose docker container port 80 according to weeve spec
EXPOSE 80

