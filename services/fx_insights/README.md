# FX Insights v2

Modernized FX Insights project using the shared portfolio architecture:

- `apps/api` — FastAPI backend
- `apps/web` — Next.js frontend

The root repository Dockerfile remains the deployment source of truth. This service folder intentionally does not include legacy per-service deployment files.

## Local development

### API

```powershell
cd services\fx_insights\apps\api

python -m venv .venv
.\.venv\Scripts\activate

pip install -r requirements.txt
copy .env.example .env

uvicorn app.main:app --reload --port 5001
```

Health check:

```powershell
curl.exe http://127.0.0.1:5001/health
```

### Web

Open a second terminal:

```powershell
cd services\fx_insights\apps\web

npm install
copy .env.local.example .env.local

npm run dev
```

Open:

```text
http://localhost:3003
```

## Environment variables

The app works in demo mode without external keys. Add these to `apps/api/.env` when you want live integrations:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
FX_API_KEY=
NEWS_API_KEY=
```

If `FX_API_KEY` or `NEWS_API_KEY` are missing, deterministic demo rates and headlines are used. If `OPENAI_API_KEY` is missing, deterministic demo commentary is streamed.

## API endpoints

```text
GET  /health
GET  /api/rates
GET  /api/news
GET  /api/insight
POST /api/report
GET  /api/report/stream
```

## Migration notes

Removed legacy artifacts:

- Flask development server
- Lambda-style local wrapper as primary app entrypoint
- Vite frontend
- per-service Docker/deploy scripts

Preserved:

- FX rate + news + AI commentary workflow
- SSE streaming report generation
- Project Description / Demo / PM Playbook portfolio structure
- Existing visual design system
