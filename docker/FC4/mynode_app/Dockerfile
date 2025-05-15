
# ARG can only be change in build
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION} 
# FROM node:${NODE_VERSION}-alpine
# FROM node:${NODE_VERSION}-slim

RUN apt-get update && \
  apt-get install -y vim && \ 
  rn -rf /var/lib/apt/lists/*

ENV PORT=3001
ENV MESSAGE="Hello DOCKER!"


# not recomended
# FROM node:latest




# principal Directory
WORKDIR /app


COPY package*.json ./

RUN npm install


COPY . .


# creating a user 
# RUN useradd -m mynode
# change to the user
# USER mynode







HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
  CMD [ "curl", "-f","http://localhost:3001" ]


VOLUME [ "/data" ]  

CMD ["node","index.js"]