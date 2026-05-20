from fastapi import APIRouter
from app.services.insights import cash_flow_summary, detect_recurring_payments, financial_profile, financial_signals

router = APIRouter(prefix="/open-finance", tags=["analysis"])

@router.get("/profile")
def get_profile():
    return financial_profile()

@router.get("/cash-flow")
def get_cash_flow():
    return cash_flow_summary()

@router.get("/recurring-payments")
def get_recurring_payments():
    return detect_recurring_payments()

@router.get("/signals")
def get_signals():
    return financial_signals()
