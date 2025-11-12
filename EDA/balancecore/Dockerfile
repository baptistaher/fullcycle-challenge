FROM node:22-slim

WORKDIR /home/node/app

# Configura PNPM global path
ENV PNPM_HOME="/usr/local/bin"
ENV PATH="$PNPM_HOME:$PATH"

# Instala pnpm e Nest CLI globalmente
RUN npm install -g pnpm 

COPY . .

RUN chmod +x /home/node/app/entrypoint/entrypoint.sh

CMD ["tail", "-f", "/dev/null"]
# # FROM guergeiro/pnpm:22-10-slim

# WORKDIR /home/node/app

# COPY . .


# RUN npm install   @nestjs/cli@11.0.10
# # RUN pnpm install -g @nestjs/cli@11.0.10

# RUN chmod +x /home/node/app/entrypoint/entrypoint.sh



# CMD ["tail", "-f", "/dev/null"]