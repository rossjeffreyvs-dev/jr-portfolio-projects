from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from data import ACCOUNTS, get_account, build_lifecycle, run_agents

app = FastAPI(title="Agentic Customer Lifecycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "customer-lifecycle-agent"}


@app.get("/accounts")
def accounts():
    return {"items": ACCOUNTS}


@app.get("/accounts/{account_id}")
def account_detail(account_id: str):
    account = get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@app.get("/accounts/{account_id}/lifecycle")
def lifecycle(account_id: str):
    account = get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return build_lifecycle(account)


@app.post("/accounts/{account_id}/run-agents")
def run_lifecycle_agents(account_id: str):
    account = get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return run_agents(account)


@app.post("/accounts/{account_id}/interventions")
def trigger_intervention(account_id: str):
    account = get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return {
        "account_id": account_id,
        "status": "triggered",
        "message": "Customer success intervention triggered and logged to lifecycle timeline.",
    }


@app.post("/accounts/{account_id}/reset")
def reset_account(account_id: str):
    account = get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return {
        "account_id": account_id,
        "status": "reset",
        "message": "Demo state reset.",
    }