FROM golang:latest AS builder

LABEL maintainer="bosshentai"
LABEL env="production"


WORKDIR /app
COPY . .
RUN CGO_ENABLE=0 go build -ldflags="-s -w" -o server main.go




# Final stage
FROM scratch
USER 1001
COPY --from=builder /app/server /server
ENTRYPOINT  ["./server"]
CMD ["8080"]

