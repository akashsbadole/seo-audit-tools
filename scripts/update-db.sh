#!/bin/bash

# Run the migration
echo "Running database migration..."
npx prisma migrate dev --name add_nextauth_tables

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database update completed!" 