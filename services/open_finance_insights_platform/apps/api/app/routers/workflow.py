import asyncio
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.schemas import WorkflowEvent
from app.services.insights import financial_profile

router = APIRouter(prefix="/open-finance", tags=["workflow"])

WORKFLOW_EVENTS = [
    WorkflowEvent(id="wf_001", step="Ingest mock Plaid-style data", status="complete", detail="Loaded institutions, accounts, balances, and transaction records.", artifact="source_records"),
    WorkflowEvent(id="wf_002", step="Normalize into Common Financial Data Model", status="complete", detail="Mapped source fields into Institution, Account, Transaction, Merchant, Category, and CashFlow objects.", artifact="cdm_snapshot"),
    WorkflowEvent(id="wf_003", step="Categorize merchants", status="complete", detail="Applied deterministic merchant rules to classify income, housing, software, food, travel, and subscriptions.", artifact="merchant_index"),
    WorkflowEvent(id="wf_004", step="Detect recurring payments", status="complete", detail="Identified repeatable payroll, rent, software, and subscription patterns.", artifact="recurring_payments"),
    WorkflowEvent(id="wf_005", step="Summarize cash flow", status="complete", detail="Calculated monthly income, outflow, net cash flow, discretionary spend, recurring spend, and runway.", artifact="cash_flow_summary"),
    WorkflowEvent(id="wf_006", step="Generate risk and opportunity signals", status="complete", detail="Created product-ready recommendations from normalized account and transaction intelligence.", artifact="financial_signals"),
]

@router.get("/workflow/events")
def workflow_events():
    return WORKFLOW_EVENTS

@router.get("/workflow/stream")
async def workflow_stream():
    async def event_generator():
        for event in WORKFLOW_EVENTS:
            await asyncio.sleep(0.35)
            yield f"data: {event.model_dump_json()}\n\n"
        await asyncio.sleep(0.2)
        yield "data: " + json.dumps({"type": "profile", "payload": financial_profile().model_dump()}) + "\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")
