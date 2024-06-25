#Use the official Golang image as the build stage
FROM golang:latest as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first for better caching
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN go build -o main ./cmd/grpcServer

# Start a new stage from scratch
FROM golang:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# Copy the proto directory (if needed by your application)
COPY ./proto ./proto

# Install SQLite3
RUN apt-get update && apt-get install -y sqlite3

# Expose port 50051 to the outside world
EXPOSE 50051

# Command to run the executable
CMD ["go","run","./cmd/grpcServer/main.go"]



# FROM golang:latest

# WORKDIR /app

# COPY . .


# RUN go mod tidy
# RUN go build -o main ./cmd/grpcServer



# RUN apt-get update && apt-get install -y sqlite3


# EXPOSE 50051

# CMD ["./main"]