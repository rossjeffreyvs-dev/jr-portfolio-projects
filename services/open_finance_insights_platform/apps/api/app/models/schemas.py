from enum import Enum
from pydantic import BaseModel, Field
from typing import Literal

class AccountType(str, Enum):
    checking = "checking"
    savings = "savings"
    credit_card = "credit_card"
    loan = "loan"
    investment = "investment"

class Institution(BaseModel):
    id: str
    name: str
    type: str
    health_status: Literal["healthy", "degraded", "offline"] = "healthy"

class Account(BaseModel):
    id: str
    institution_id: str
    name: str
    type: AccountType
    mask: str
    current_balance: float
    available_balance: float | None = None
    currency: str = "USD"

class Transaction(BaseModel):
    id: str
    account_id: str
    date: str
    merchant_name: str
    raw_description: str
    amount: float = Field(description="Negative for outflow, positive for inflow")
    category: str | None = None
    subcategory: str | None = None
    is_pending: bool = False

class Merchant(BaseModel):
    id: str
    name: str
    normalized_name: str
    category: str
    recurring_likelihood: float

class RecurringPayment(BaseModel):
    merchant_name: str
    cadence: str
    average_amount: float
    last_seen: str
    confidence: float

class CashFlowSummary(BaseModel):
    monthly_income: float
    monthly_outflow: float
    net_cash_flow: float
    runway_months: float | None
    discretionary_spend: float
    recurring_spend: float

class FinancialSignal(BaseModel):
    id: str
    severity: Literal["low", "medium", "high"]
    title: str
    description: str
    recommendation: str

class FinancialProfile(BaseModel):
    institutions: list[Institution]
    accounts: list[Account]
    transactions: list[Transaction]
    merchants: list[Merchant]
    recurring_payments: list[RecurringPayment]
    cash_flow: CashFlowSummary
    signals: list[FinancialSignal]

class WorkflowEvent(BaseModel):
    id: str
    step: str
    status: Literal["queued", "running", "complete"]
    detail: str
    artifact: str | None = None
