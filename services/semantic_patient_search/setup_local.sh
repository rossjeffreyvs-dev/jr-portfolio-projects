#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Setting up backend..."
cd "$ROOT_DIR/backend"
python3 -m venv .venv || true
source .venv/bin/activate
pip install -r requirements.txt

echo "Setting up frontend..."
cd "$ROOT_DIR/frontend"
npm install

echo "Setup complete."
echo "Run ./run_local.sh to start both backend and frontend."
