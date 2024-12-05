FROM node:22.12.0-slim

WORKDIR /home/node/app

USER root
RUN apt-get update && apt-get install -y iputils-ping && rm -rf /var/lib/apt/lists/*


USER node

CMD [ "tail", "-f", "/dev/null" ]