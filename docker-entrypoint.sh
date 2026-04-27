#!/usr/bin/env bash
set -euo pipefail

echo "Starting Clinical API on port 8000..."
uvicorn services.clinical_trial_matching_agent.apps.api.app.main:app --host 0.0.0.0 --port 8000 &

echo "Starting Clinical UI on port 3000..."
HOSTNAME=0.0.0.0 PORT=3000 node /app/clinical-web/server.js &

echo "Starting Customer Lifecycle API on port 8010..."
(
  cd /app/services/customer-lifecycle-agent/api
  uvicorn main:app --host 0.0.0.0 --port 8010
) &

echo "Starting Customer Lifecycle UI on port 3001..."
HOSTNAME=0.0.0.0 PORT=3001 node /app/customer-web/server.js &

echo "Starting Resume Analyzer UI on port 3002..."
python -m http.server 3002 \
  --directory /app/services/resume_job_analyzer/frontend/dist &

echo "Starting Gateway on port 8080..."
exec uvicorn gateway.main:app --host 0.0.0.0 --port 8080