# Agentic Startup Finance & Operations API — Phase 1.4 Tools

Adds tool-using agents and dynamic scenario parameters.

## New architecture

Agents now call tool interfaces instead of reading seeded data directly:

- `MockStripeTools`
- `ForecastingTools`
- `ExpenseAnalysisTools`
- `CustomerHealthTools`
- `InvestorSummaryTool`

Tool calls appear in:

- `run.tool_calls`
- `finding.tool_calls`
- `workflow_event.tool_call`

This makes the future frontend visibly agentic.

## Supported questions

- Can we afford to hire 2 engineers?
- Can we afford to hire 3 engineers before fundraising?
- What revenue is at risk?
- Where are we overspending?
- Why are activation rates declining?
- Generate a board-ready update.

## Run

```bash
cd services/agentic_startup_finance_ops/apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8020
```

## Test

```bash
pytest
./smoke_test.sh
```

## Phase 1.5 — Adaptive operational planning

This update moves the backend from fixed scenario routing toward adaptive operational planning.

Added:

- Structured parameter extraction for headcount, role, timeframe, segment, risk type, department, and expense type.
- Dynamic workflow planning with `WorkflowPlan` payloads that explain selected/skipped agents and selected tools.
- Tool-selection traces for Stripe-like revenue tools, forecasting tools, expense tools, customer-health tools, and OpenAI summary tools.
- Adaptive recommendations that use extracted parameters and available agent findings.
- Feedback-weighted recommendation ranking via `/reviews/{review_id}/feedback` and `/learning/signals`.

Examples:

```bash
curl -X POST http://127.0.0.1:8020/questions/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Can we afford to hire 3 engineers before fundraising?"}'
```

```bash
curl -X POST http://127.0.0.1:8020/questions/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Which enterprise customers are most likely to churn next quarter?"}'
```

```bash
curl -X POST http://127.0.0.1:8020/questions/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Where are we overspending on GTM software tools?"}'
```
