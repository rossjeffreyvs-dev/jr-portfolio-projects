#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
ENV_FILE="$ROOT_DIR/.env"
ENV_EXAMPLE_FILE="$ROOT_DIR/.env.example"
VENV_DIR="$BACKEND_DIR/.venv"

echo "Starting FX Insights local setup..."
echo "Project root: $ROOT_DIR"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is not installed."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed."
  exit 1
fi

echo ""
echo "1) Setting up backend virtual environment..."
cd "$BACKEND_DIR"

if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
  echo "Created virtual environment at $VENV_DIR"
else
  echo "Virtual environment already exists at $VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

python -m pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "2) Setting up frontend dependencies..."
cd "$FRONTEND_DIR"
npm install

echo ""
echo "3) Preparing environment file..."
cd "$ROOT_DIR"

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$ENV_EXAMPLE_FILE" ]; then
    cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    echo "Created .env from .env.example"
  else
    cat > "$ENV_FILE" <<'EOF'
OPENAI_API_KEY=
NEWS_API_KEY=
FX_API_KEY=
EOF
    echo "Created new .env file"
  fi
else
  echo ".env already exists"
fi

echo ""
echo "Setup complete."
echo ""
echo "Next steps:"
echo "1. Edit $ENV_FILE and add your API keys:"
echo "   - OPENAI_API_KEY"
echo "   - NEWS_API_KEY"
echo "   - FX_API_KEY"
echo ""
echo "2. Start backend:"
echo "   cd $BACKEND_DIR"
echo "   source .venv/bin/activate"
echo "   python local_server.py"
echo ""
echo "3. Start frontend in a second terminal:"
echo "   cd $FRONTEND_DIR"
echo "   npm run dev"
echo ""
echo "Frontend URL: http://127.0.0.1:5173"
echo "Backend URL:  http://127.0.0.1:5001"