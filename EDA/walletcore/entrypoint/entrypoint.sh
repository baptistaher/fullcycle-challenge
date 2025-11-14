#!/bin/bash
echo "Go project"

MAX_RETRIES=30
COUNTER=0



echo "Waiting for MySQL to be ready..."

until mysqladmin ping -h "mysql" -u root -proot --protocol=TCP --skip-ssl --silent; do
  echo "Waiting for MySQL to respond..."
  sleep 2
  COUNTER=$((COUNTER + 1))
  if [ $COUNTER -gt $MAX_RETRIES ]; then
    echo "MySQL is not ready after $MAX_RETRIES attempts."
    exit 1
  fi
done


echo "MySQL is ready!"

# Run database migrations

if [ -d "/app/internal/database/migrations" ]; then
  echo "Starting migrations..."
  migrate -path /app/internal/database/migrations \
    -database "mysql://root:root@tcp(mysql:3306)/wallet?parseTime=true&tls=false" \
    -verbose up || {
    echo "Migrations failed!"
    exit 1
  }
  sleep 2
else
  echo "Migration directory not found!"
  exit 1
fi

echo "migrations done"

SEED_PATH=/app/internal/database/seed

if [ -d "$SEED_PATH" ]; then
  echo "Starting seed..."
  for file in "$SEED_PATH"/*.up.sql; do

    echo "Executing seed file: $file"
    mysql -h mysql --protocol=TCP --skip-ssl -u root -proot wallet <"$file"

    # Check if the command succeeded
    if [ $? -eq 0 ]; then
      echo "Successfully executed: $file"
    else
      echo "Failed to execute: $file"
      exit 1
    fi
  done

else
  echo "Seed PATH not found!"
  exit 1

fi

# Start the application
go run /app/cmd/walletcore/main.go



# until mysqladmin ping -h mysql -u root -proot  --silent; do
#     echo "Waiting for MySQL..."
#     sleep 2
# done


# tail -f /dev/null