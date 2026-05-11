# Agentic Startup Finance & Operations Frontend

Next.js frontend for `/agentic-startup-finance-ops`.

## Install

```bash
cd services/agentic_startup_finance_ops/apps/web
npm install
```

## Run

Make sure the FastAPI backend is running on port 8020:

```bash
cd services/agentic_startup_finance_ops/apps/api
source .venv/bin/activate
uvicorn app.main:app --reload --port 8020
```

Then start the frontend:

```bash
cd services/agentic_startup_finance_ops/apps/web
npm run dev
```

Open:

```text
http://localhost:3003
```

## Optional env

Create `.env.local` in `apps/web` if the API is not running at the default URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8020
```

## Included UI

- Portfolio header/nav
- Hero metrics
- Project Description / Demo / PM Playbook tabs
- Founder question input
- Scenario cards
- Semantic extraction panel
- Dynamic workflow planner panel
- Agent/tool activity trace
- OpenAI reasoning summary
- Ranked recommendations
- Human review queue
- Charts for runway and revenue/activation risk
