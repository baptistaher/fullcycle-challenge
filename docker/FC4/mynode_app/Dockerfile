
# ARG can only be change in build
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION} 



ENV PORT=3001
ENV MESSAGE="Hello DOCKER!"


# not recomended
# FROM node:latest

# creating a user 
RUN useradd -m mynode
# change to the user
USER mynode



# principal Directory
WORKDIR /app


COPY . .

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
  CMD [ "curl", "-f","http://localhost:3001" ]


CMD ["node","index.js"]