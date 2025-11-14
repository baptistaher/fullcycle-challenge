#!/bin/bash
echo "installing dependencies..."
pnpm install

echo "starting migrations..."
pnpm drizzle:migrate


echo "starting app..."
pnpm start:dev
# tail -f /dev/null