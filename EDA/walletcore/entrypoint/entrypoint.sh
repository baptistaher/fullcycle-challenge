#!/bin/bash

echo "Waiting for MySql to be ready..."

until mysqladmin ping -h "mysql-wallet" --silent; do
  echo "Waiting for MySql to be ready..."
  sleep 2
done

echo "MySql is ready!"

# Run database migrations

migrate -path=/opt/app/internal/database/migrations -database "mysql://root:root@tcp(mysql-wallet:3306)/wallet?parseTime=true" -verbose up

# run the seed

migrate -path=/opt/app/internal/database/seed -database "mysql://root:root@tcp(mysql-wallet:3306)/wallet?parseTime=true" -verbose up

# Start the application
/opt/app/wallet-core
