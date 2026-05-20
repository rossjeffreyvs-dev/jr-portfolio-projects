from collections import defaultdict
from app.data.seed_data import ACCOUNTS, INSTITUTIONS, TRANSACTIONS
from app.models.schemas import Merchant, Transaction

CATEGORY_RULES = {
    "payroll": ("Income", "Payroll"),
    "rent": ("Housing", "Rent"),
    "cloudhost": ("Software", "Cloud infrastructure"),
    "figma": ("Software", "Design tools"),
    "openai": ("Software", "AI platform"),
    "delta": ("Travel", "Flights"),
    "whole foods": ("Food", "Groceries"),
    "netflix": ("Entertainment", "Subscription"),
}

RECURRING_HINTS = {"netflix", "figma", "cloudhost", "openai", "rent", "payroll"}


def normalize_category(txn: Transaction) -> Transaction:
    haystack = f"{txn.merchant_name} {txn.raw_description}".lower()
    category, subcategory = ("Uncategorized", "Review")
    for key, value in CATEGORY_RULES.items():
        if key in haystack:
            category, subcategory = value
            break
    return txn.model_copy(update={"category": category, "subcategory": subcategory})


def normalized_transactions() -> list[Transaction]:
    return [normalize_category(txn) for txn in TRANSACTIONS]


def merchants() -> list[Merchant]:
    grouped = defaultdict(list)
    for txn in normalized_transactions():
        grouped[txn.merchant_name].append(txn)

    results = []
    for idx, (name, txns) in enumerate(sorted(grouped.items()), start=1):
        sample = txns[0]
        recurring_likelihood = 0.85 if name.lower() in RECURRING_HINTS or len(txns) >= 3 else 0.25
        results.append(
            Merchant(
                id=f"mer_{idx:03d}",
                name=name,
                normalized_name=name.lower().replace(" ", "_"),
                category=sample.category or "Uncategorized",
                recurring_likelihood=recurring_likelihood,
            )
        )
    return results


def cdm_snapshot():
    return {
        "institutions": INSTITUTIONS,
        "accounts": ACCOUNTS,
        "transactions": normalized_transactions(),
        "merchants": merchants(),
    }
