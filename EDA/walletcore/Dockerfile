FROM golang:1.25


WORKDIR /app/

COPY . .


RUN apt-get update  && \
  apt-get install -y librdkafka-dev default-mysql-client && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
# apt-get install -y default-mysql-client


RUN go install -tags "mysql" github.com/golang-migrate/migrate/v4/cmd/migrate@latest


RUN go mod tidy



RUN chmod +x /app/entrypoint/entrypoint.sh



ENTRYPOINT [ "sh", "/app/entrypoint/entrypoint.sh" ]

# CMD ["tail", "-f", "/dev/null"]