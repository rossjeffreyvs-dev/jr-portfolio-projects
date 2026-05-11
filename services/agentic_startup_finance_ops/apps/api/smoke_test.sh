#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-http://127.0.0.1:8020}

echo "Health"
curl -s "$BASE/health" | python -m json.tool

echo "Metrics"
curl -s "$BASE/metrics" | python -m json.tool

echo "Scenarios"
curl -s "$BASE/scenarios" | python -m json.tool

echo "Dynamic hiring question"
curl -s -X POST "$BASE/questions/ask" \
  -H "Content-Type: application/json" \
  -d '{"question":"Can we afford to hire 3 engineers before fundraising?"}' | python -m json.tool

echo "Revenue risk question"
curl -s -X POST "$BASE/questions/ask" \
  -H "Content-Type: application/json" \
  -d '{"question":"Which enterprise customers are most likely to churn next quarter?"}' | python -m json.tool

echo "Cost optimization question"
curl -s -X POST "$BASE/questions/ask" \
  -H "Content-Type: application/json" \
  -d '{"question":"Where are we overspending on GTM software tools?"}' | python -m json.tool
