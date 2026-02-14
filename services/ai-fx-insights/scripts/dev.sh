#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/.venv"

echo "== FX Insights: dev =="
echo "Root: $ROOT_DIR"

# --- Backend deps (Python venv + pip install) ---
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating backend venv at $VENV_DIR"
  python3 -m venv "$VENV_DIR"
fi

echo "Installing backend requirements (pip)..."
"$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt" >/dev/null

# --- Frontend deps (npm install) ---
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Installing frontend dependencies (npm install)..."
  (cd "$FRONTEND_DIR" && npm install)
fi

# --- Run both servers ---
echo "Starting backend (http://127.0.0.1:5001) and frontend (http://127.0.0.1:5173)..."
# Start backend in background
"$VENV_DIR/bin/python" "$BACKEND_DIR/local_server.py" &
BACKEND_PID=$!

# Ensure backend is stopped if this script exits
cleanup() {
  kill "$BACKEND_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# Run frontend in foreground (ctrl+c stops both)
(cd "$FRONTEND_DIR" && npm run dev)
