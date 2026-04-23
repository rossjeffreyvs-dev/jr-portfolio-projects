#!/usr/bin/env bash
set -euo pipefail

echo "Starting Clinical UI..."
HOSTNAME=0.0.0.0 PORT=3000 node /app/clinical-web/server.js &

echo "Starting Gateway..."
exec uvicorn gateway.main:app --host 0.0.0.0 --port 8080