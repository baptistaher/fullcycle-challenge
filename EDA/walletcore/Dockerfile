# FROM golang:alpine AS builder


# RUN apk update && apk add --no-cache git

# WORKDIR /app/

# COPY . .




FROM golang:1.23


WORKDIR /app/

RUN apt-get update  && \
  apt-get install -y  librdkafka-dev


RUN go install github.com/golang-migrate/migrate/v4/cmd/migrate@latest




CMD ["tail", "-f", "/dev/null"]