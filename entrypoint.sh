#!/bin/sh
set -e

echo "Starting entrypoint script..."

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL found — running migrations"
  npm run db:migrate || echo "Migrations failed or none to run"
  echo "Seeding database (if configured)"
  npm run db:seed || echo "Seeding failed or none to run"
else
  echo "DATABASE_URL not set — skipping migrations and seeds"
fi

# Start the app
echo "Starting application"
exec npm start
