# AI-Powered Open Finance Data Platform

Portfolio MVP for Plaid-aligned open finance product work.

## Concept

Ingest mock bank/account/transaction data, normalize it into a common financial data model, and generate financial insights through an explainable AI-style workflow.

## Project structure

```text
services/open_finance_insights_platform/
  apps/
    api/      FastAPI backend, seed data, CDM models, insights, workflow SSE
    web/      Next.js frontend with Project Description / Demo / PM Playbook tabs
  docs/       implementation notes and content
```

## Local run

Backend:

```bash
cd services/open_finance_insights_platform/apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8036
```

Frontend:

```bash
cd services/open_finance_insights_platform/apps/web
npm install
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8036 npm run dev
```

Open:

```text
http://localhost:3006
```

## API endpoints

- `GET /health`
- `GET /open-finance/institutions`
- `GET /open-finance/accounts`
- `GET /open-finance/transactions/raw`
- `GET /open-finance/cdm`
- `GET /open-finance/profile`
- `GET /open-finance/cash-flow`
- `GET /open-finance/recurring-payments`
- `GET /open-finance/signals`
- `GET /open-finance/workflow/events`
- `GET /open-finance/workflow/stream`

## Portfolio framing

This should be described as a product/data platform, not a budgeting chatbot. The differentiator is the normalized financial data model and explainable workflow layer.
