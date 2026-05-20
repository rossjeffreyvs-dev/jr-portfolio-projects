from fastapi import APIRouter
from app.data.seed_data import ACCOUNTS, INSTITUTIONS, TRANSACTIONS

router = APIRouter(prefix="/open-finance", tags=["open-finance"])

@router.get("/institutions")
def list_institutions():
    return INSTITUTIONS

@router.get("/accounts")
def list_accounts():
    return ACCOUNTS

@router.get("/transactions/raw")
def raw_transactions():
    return TRANSACTIONS
