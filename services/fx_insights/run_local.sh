#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

cleanup() {
  echo ""
  echo "Stopping services..."
  jobs -p | xargs -r kill
}
trap cleanup EXIT INT TERM

echo "Starting backend..."
cd "$BACKEND_DIR"
# shellcheck disable=SC1091
source .venv/bin/activate
python local_server.py &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "FX Insights is starting..."
echo "Frontend: http://127.0.0.1:5173"
echo "Backend:  http://127.0.0.1:5001"
echo ""
echo "Press Ctrl+C to stop both services."

wait $BACKEND_PID $FRONTEND_PID