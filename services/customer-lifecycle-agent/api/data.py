from datetime import datetime, timezone
from random import choice, randint

VALUE_PER_CONVERTED_CUSTOMER = 18000


def utc_now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


# -----------------------------
# STATIC DEMO DATA
# -----------------------------

PROSPECTS = [
    {
        "id": "prospect_101",
        "name": "Beacon Credit Union",
        "segment": "Regional bank",
        "source": "Partner referral",
        "stage": "qualified",
        "fit_score": 86,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Strong API fit for lending use case",
        "next_action": "Run activation evaluation",
        "created_at": "2026-04-25T10:00:00+00:00",
    },
    {
        "id": "prospect_102",
        "name": "Atlas Pay",
        "segment": "Payments startup",
        "source": "Inbound demo",
        "stage": "evaluated",
        "fit_score": 79,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Sandbox active, no production usage",
        "next_action": "Send production checklist",
        "created_at": "2026-04-25T10:04:00+00:00",
    },
    {
        "id": "prospect_103",
        "name": "Cedar Mortgage",
        "segment": "Mortgage lender",
        "source": "Outbound",
        "stage": "in_review",
        "fit_score": 91,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Blocked on security review",
        "next_action": "Escalate review",
        "created_at": "2026-04-25T10:07:00+00:00",
    },
    {
        "id": "prospect_104",
        "name": "Summit Treasury",
        "segment": "Treasury SaaS",
        "source": "Product-led",
        "stage": "converted",
        "fit_score": 88,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Production workflow completed",
        "next_action": "Expansion review",
        "created_at": "2026-04-25T10:11:00+00:00",
    },
]


REVIEW_QUEUE = [
    {
        "id": "review_201",
        "prospect_id": "prospect_103",
        "priority": "High",
        "reason": [
            "High-fit prospect blocked in review",
            "Security approval pending",
        ],
        "recommended_action": "Schedule security review",
        "status": "open",
    }
]


# -----------------------------
# CORE LIFECYCLE LOGIC
# -----------------------------

def build_revenue_lifecycle():
    prospects = PROSPECTS

    qualified = [p for p in prospects if p["stage"] in ["qualified", "evaluated", "in_review", "converted"]]
    evaluated = [p for p in prospects if p["stage"] in ["evaluated", "in_review", "converted"]]
    in_review = [p for p in prospects if p["stage"] == "in_review"]
    converted = [p for p in prospects if p["stage"] == "converted"]

    potential_value = len(prospects) * VALUE_PER_CONVERTED_CUSTOMER
    realized_value = len(converted) * VALUE_PER_CONVERTED_CUSTOMER
    leakage_value = max((len(evaluated) - len(converted)) * VALUE_PER_CONVERTED_CUSTOMER, 0)

    if in_review:
        insight = {
            "stage": "review_to_conversion",
            "severity": "high",
            "reason": "High-fit prospects stuck in human review",
            "recommendation": "Prioritize review queue to unlock revenue",
            "estimated_gain": VALUE_PER_CONVERTED_CUSTOMER * len(in_review),
        }
    else:
        insight = {
            "stage": "qualification_to_evaluation",
            "severity": "medium",
            "reason": "Qualified prospects not evaluated",
            "recommendation": "Auto-evaluate top prospects",
            "estimated_gain": VALUE_PER_CONVERTED_CUSTOMER,
        }

    return {
        "customer_profile": {
            "title": "API-driven fintech customer lifecycle",
            "buyer": "Head of Product / Growth",
            "user": "Customer success + engineering",
            "value_per_converted_customer": VALUE_PER_CONVERTED_CUSTOMER,
            "target_customer_profile": {
                "segment": "Fintech / banking / SaaS",
                "use_case": "API integration from sandbox to production",
                "success_criteria": [
                    "API keys created",
                    "Sandbox flow completed",
                    "Production workflow launched",
                ],
                "conversion_risks": [
                    "Incomplete setup",
                    "Security blocker",
                    "No production usage",
                ],
            },
        },
        "prospect_feed": sorted(prospects, key=lambda x: x["created_at"], reverse=True),
        "funnel": {
            "prospects": len(prospects),
            "qualified": len(qualified),
            "evaluated": len(evaluated),
            "in_review": len(in_review),
            "converted": len(converted),
            "potential_value": potential_value,
            "realized_value": realized_value,
            "leakage_value": leakage_value,
        },
        "review_queue": [
            {
                **r,
                "prospect": next(p for p in prospects if p["id"] == r["prospect_id"]),
                "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
            }
            for r in REVIEW_QUEUE if r["status"] == "open"
        ],
        "agent_insight": insight,
    }


# -----------------------------
# INGEST MOCK PROSPECT
# -----------------------------

def ingest_prospect():
    new_id = f"prospect_{200 + len(PROSPECTS)}"

    stage = choice(["prospect", "qualified", "evaluated", "in_review"])
    score = randint(50, 95)

    prospect = {
        "id": new_id,
        "name": choice([
            "BlueRiver Finance",
            "Orbit Lending",
            "Keystone Pay",
            "Apex Capital",
        ]),
        "segment": choice(["Fintech", "Bank", "SaaS"]),
        "source": choice(["Inbound", "Outbound", "Referral"]),
        "stage": stage,
        "fit_score": score,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "New prospect added to lifecycle",
        "next_action": "Evaluate prospect",
        "created_at": utc_now(),
    }

    PROSPECTS.append(prospect)

    if stage == "in_review":
        REVIEW_QUEUE.append({
            "id": f"review_{300 + len(REVIEW_QUEUE)}",
            "prospect_id": new_id,
            "priority": "High",
            "reason": ["Requires human validation"],
            "recommended_action": "Review account",
            "status": "open",
        })

    return {
        "message": "Prospect ingested",
        "prospect": prospect,
    }