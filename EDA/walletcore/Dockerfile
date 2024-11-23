FROM golang:1.23


WORKDIR /app/

RUN apt-get update  && \
  apt-get install -y  librdkafka-dev


RUN go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest



CMD ["tail", "-f", "/dev/null"]