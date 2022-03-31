FROM node:current-stretch-slim
COPY . /app
WORKDIR /app
RUN set NODE_OPTIONS=--max-old-space-size=30720
RUN npm install
SHELL ["/bin/bash", "-c"]
COPY ./image/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 80

