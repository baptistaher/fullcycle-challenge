FROM golang:alpine AS builder

RUN apk update && apk add --no-cache git

WORKDIR $GOPATH/src/

COPY . .

# Using go get.
RUN go get -d -v

# Build the binary.
RUN go build -o /go/bin/main


FROM scratch

COPY --from=builder /go/bin/main /go/bin/main


CMD ["/go/bin/main"]
