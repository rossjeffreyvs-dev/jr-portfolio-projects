# FX Insights (Local Dev)

A small full-stack demo:
- **Backend:** Python (Lambda-style handler) + Flask dev server
- **Frontend:** Vite + React + TypeScript + Tailwind

## Prereqs
- Node.js 18+ (or 20+)
- Python 3.10+

## 1) Backend (API)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# from repo root, copy env example and fill values
cd ..
cp .env.example .env
# edit .env and add OPENAI_API_KEY and NEWS_API_KEY

cd backend
python local_server.py
```

Backend runs at: `http://127.0.0.1:5001`

## 2) Frontend (UI)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

The Vite dev server proxies `/api/*` requests to the backend dev server.

## 3) Use the app
Click **Generate Insight Now** to call:
`/api/insight?base=EUR&symbols=USD,GBP,JPY&countries=us,gb,jp`

## Notes
- If `OPENAI_API_KEY` is missing, the backend returns a helpful placeholder message.
- MarketAux requires `NEWS_API_KEY`.
