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

start_claude_api() {
  echo "Starting Claude API on port 8020..."
  (
    cd /app/services/claude-clinical-protocol-reasoning-engine/backend
    uvicorn app.main:app --host 0.0.0.0 --port 8020
  ) &
}

start_startup_finance_api() {
  echo "Starting Startup Finance API on port 8030..."
  (
    cd /app/services/agentic_startup_finance_ops/apps/api
    uvicorn app.main:app --host 0.0.0.0 --port 8030
  ) &
}

start_open_finance_api() {
  echo "Starting Open Finance API on port 8040..."
  (
    cd /app/services/open_finance_insights_platform/apps/api
    uvicorn app.main:app --host 0.0.0.0 --port 8040
  ) &
}

# --- Clinical Trial Matching ---

start_service \
  "Clinical API on port 8000" \
  uvicorn services.clinical_trial_matching_agent.apps.api.app.main:app \
    --host 0.0.0.0 \
    --port 8000

start_service \
  "Clinical UI on port 3000" \
  env HOSTNAME=0.0.0.0 PORT=3000 \
  node /app/clinical-web/server.js

# --- Customer Lifecycle ---

start_customer_api

start_service \
  "Customer Lifecycle UI on port 3001" \
  env HOSTNAME=0.0.0.0 PORT=3001 \
  node /app/customer-web/server.js

# --- Resume Analyzer ---

start_service \
  "Resume Analyzer UI on port 3002" \
  python -m http.server 3002 \
    --directory /app/services/resume_job_analyzer/frontend/dist

# --- Claude Clinical Protocol Reasoning Engine ---

start_claude_api

start_service \
  "Claude UI on port 3003" \
  env HOSTNAME=0.0.0.0 PORT=3003 \
  node /app/claude-web/server.js

# --- TrainJazz ---

start_service \
  "TrainJazz UI on port 3004" \
  env HOSTNAME=0.0.0.0 PORT=3004 \
  node /app/train-jazz-web/server.js

# --- Agentic Startup Finance Ops ---

start_startup_finance_api

start_service \
  "Startup Finance UI on port 3005" \
  env HOSTNAME=0.0.0.0 PORT=3005 \
  node /app/startup-finance-web/server.js

# --- Open Finance Insights Platform ---

start_open_finance_api

start_service \
  "Open Finance UI on port 3006" \
  env HOSTNAME=0.0.0.0 PORT=3006 \
  node /app/open-finance-web/server.js

# --- Gateway ---

echo "Starting Gateway on port 8080..."
exec uvicorn gateway.main:app --host 0.0.0.0 --port 8080