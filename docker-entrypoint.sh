#!/usr/bin/env bash
set -euo pipefail

echo "Starting Clinical API on port 8000..."
uvicorn services.clinical_trial_matching_agent.apps.api.app.main:app --host 0.0.0.0 --port 8000 &

echo "Starting Clinical UI on port 3000..."
HOSTNAME=0.0.0.0 PORT=3000 node /app/clinical-web/server.js &

echo "Starting Resume Analyzer UI on port 3002..."
python -m http.server 3002 \
  --directory /app/services/resume_job_analyzer/frontend/dist &

echo "Starting Gateway on port 8080..."
exec uvicorn gateway.main:app --host 0.0.0.0 --port 8080