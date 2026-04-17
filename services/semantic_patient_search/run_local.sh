#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "$ROOT_DIR/backend"
python3 -m venv .venv >/dev/null 2>&1 || true
source .venv/bin/activate
pip install -r requirements.txt >/dev/null
python local_server.py &
BACKEND_PID=$!

cd "$ROOT_DIR/frontend"
npm install
npm run dev
