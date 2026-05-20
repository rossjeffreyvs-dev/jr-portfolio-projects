from collections import defaultdict
from statistics import mean
from app.data.seed_data import ACCOUNTS, INSTITUTIONS
from app.models.schemas import CashFlowSummary, FinancialProfile, FinancialSignal, RecurringPayment
from app.services.normalizer import merchants, normalized_transactions

RECURRING_CATEGORIES = {"Income", "Housing", "Software", "Entertainment"}
DISCRETIONARY_CATEGORIES = {"Food", "Travel", "Entertainment"}


def detect_recurring_payments() -> list[RecurringPayment]:
    grouped = defaultdict(list)
    for txn in normalized_transactions():
        grouped[txn.merchant_name].append(txn)

    payments = []
    for merchant, txns in grouped.items():
        if len(txns) >= 2 or (txns[0].category in RECURRING_CATEGORIES and abs(txns[0].amount) > 20):
            payments.append(
                RecurringPayment(
                    merchant_name=merchant,
                    cadence="monthly",
                    average_amount=round(mean(abs(t.amount) for t in txns), 2),
                    last_seen=max(t.date for t in txns),
                    confidence=0.92 if len(txns) >= 3 else 0.74,
                )
            )
    return sorted(payments, key=lambda p: p.average_amount, reverse=True)


def cash_flow_summary() -> CashFlowSummary:
    txns = normalized_transactions()
    income = sum(t.amount for t in txns if t.amount > 0) / 3
    outflow = abs(sum(t.amount for t in txns if t.amount < 0)) / 3
    recurring_merchants = {p.merchant_name for p in detect_recurring_payments()}
    recurring = sum(abs(t.amount) for t in txns if t.merchant_name in recurring_merchants and t.amount < 0) / 3
    discretionary = sum(abs(t.amount) for t in txns if t.category in DISCRETIONARY_CATEGORIES and t.amount < 0) / 3
    liquid_assets = sum(a.current_balance for a in ACCOUNTS if a.type.value in {"checking", "savings"})
    runway = liquid_assets / outflow if outflow else None
    return CashFlowSummary(
        monthly_income=round(income, 2),
        monthly_outflow=round(outflow, 2),
        net_cash_flow=round(income - outflow, 2),
        runway_months=round(runway, 1) if runway else None,
        discretionary_spend=round(discretionary, 2),
        recurring_spend=round(recurring, 2),
    )


def financial_signals() -> list[FinancialSignal]:
    cf = cash_flow_summary()
    signals = [
        FinancialSignal(
            id="sig_001",
            severity="medium",
            title="Recurring software spend concentration",
            description="Cloud, design, and AI platform transactions appear as repeatable operating costs.",
            recommendation="Create a recurring vendor review workflow and flag tools with low utilization before renewal.",
        ),
        FinancialSignal(
            id="sig_002",
            severity="low" if (cf.runway_months or 0) > 6 else "medium",
            title="Liquidity runway is stable but monitorable",
            description=f"Available checking and savings balances imply roughly {cf.runway_months} months of runway at the current outflow rate.",
            recommendation="Track net cash flow monthly and trigger review if runway falls below six months.",
        ),
        FinancialSignal(
            id="sig_003",
            severity="medium",
            title="Discretionary spend is visible and categorizable",
            description="Travel, food, and entertainment spend can be separated from fixed obligations for affordability analysis.",
            recommendation="Expose discretionary categories as filters in the recommendation panel for PM-facing decisioning.",
        ),
    ]
    return signals


def financial_profile() -> FinancialProfile:
    return FinancialProfile(
        institutions=INSTITUTIONS,
        accounts=ACCOUNTS,
        transactions=normalized_transactions(),
        merchants=merchants(),
        recurring_payments=detect_recurring_payments(),
        cash_flow=cash_flow_summary(),
        signals=financial_signals(),
    )
