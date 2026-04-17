#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT_DIR/../.." && pwd)"

echo "Installing backend dependencies into repo root .venv..."
"$REPO_ROOT/.venv/bin/pip" install -r "$ROOT_DIR/backend/requirements.txt"

echo "Setting up frontend..."
cd "$ROOT_DIR/frontend"
npm install

echo "Setup complete."
echo "Run 'mdev semantic' from the repo root."