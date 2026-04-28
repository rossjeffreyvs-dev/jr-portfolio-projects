#!/usr/bin/env bash
set -euo pipefail

start_service() {
  local name="$1"
  shift

  echo "Starting ${name}..."
  "$@" &
}

start_customer_api() {
  echo "Starting Customer Lifecycle API on port 8010..."
  (
    cd /app/services/customer-lifecycle-agent/api
    uvicorn main:app --host 0.0.0.0 --port 8010
  ) &
}

start_service \
  "Clinical API on port 8000" \
  uvicorn services.clinical_trial_matching_agent.apps.api.app.main:app \
    --host 0.0.0.0 \
    --port 8000

start_service \
  "Clinical UI on port 3000" \
  env HOSTNAME=0.0.0.0 PORT=3000 \
  node /app/clinical-web/server.js

start_customer_api

start_service \
  "Customer Lifecycle UI on port 3001" \
  env HOSTNAME=0.0.0.0 PORT=3001 \
  node /app/customer-web/server.js

start_service \
  "Resume Analyzer UI on port 3002" \
  python -m http.server 3002 \
    --directory /app/services/resume_job_analyzer/frontend/dist

echo "Starting Gateway on port 8080..."
exec uvicorn gateway.main:app --host 0.0.0.0 --port 8080