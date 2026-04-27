from __future__ import annotations

from datetime import datetime, timezone
from random import choice, randint
from typing import Literal

LifecycleStage = Literal[
    "prospect",
    "qualified",
    "evaluated",
    "in_review",
    "converted",
    "rejected",
]

VALUE_PER_CONVERTED_CUSTOMER = 18000

ACCOUNTS = [
    {
        "id": "acct_plaid_001",
        "name": "Northstar Lending",
        "segment": "Mid-market fintech",
        "stage": "Activation",
        "health_score": 72,
        "activation_risk": 64,
        "churn_risk": 28,
        "revenue_opportunity": 42000,
        "current_plan": "Growth",
        "users": 48,
        "integration_status": "Connected sandbox API, production pending",
        "last_event": "Created first linked bank account flow",
    },
    {
        "id": "acct_retail_002",
        "name": "Harbor Retail Bank",
        "segment": "Enterprise banking",
        "stage": "Onboarding",
        "health_score": 58,
        "activation_risk": 81,
        "churn_risk": 36,
        "revenue_opportunity": 125000,
        "current_plan": "Enterprise pilot",
        "users": 16,
        "integration_status": "API keys created, webhook setup incomplete",
        "last_event": "Invited compliance reviewer",
    },
    {
        "id": "acct_saas_003",
        "name": "LedgerFlow",
        "segment": "B2B SaaS",
        "stage": "Retention",
        "health_score": 86,
        "activation_risk": 18,
        "churn_risk": 12,
        "revenue_opportunity": 27000,
        "current_plan": "Scale",
        "users": 122,
        "integration_status": "Production traffic active",
        "last_event": "Expanded usage to payments workflow",
    },
]

PROSPECTS = [
    {
        "id": "prospect_101",
        "name": "Beacon Credit Union",
        "segment": "Regional financial institution",
        "source": "Partner referral",
        "stage": "qualified",
        "fit_score": 86,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "High API fit; lending use case confirmed.",
        "next_action": "Run activation readiness evaluation",
        "created_at": "2026-04-25T10:00:00+00:00",
    },
    {
        "id": "prospect_102",
        "name": "Atlas Pay",
        "segment": "Payments startup",
        "source": "Inbound demo request",
        "stage": "evaluated",
        "fit_score": 79,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Sandbox usage detected; production review not scheduled.",
        "next_action": "Send production checklist",
        "created_at": "2026-04-25T10:04:00+00:00",
    },
    {
        "id": "prospect_103",
        "name": "Cedar Mortgage",
        "segment": "Mortgage lender",
        "source": "Outbound target account",
        "stage": "in_review",
        "fit_score": 91,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Strong revenue fit; legal/security review blocking conversion.",
        "next_action": "Escalate technical review",
        "created_at": "2026-04-25T10:07:00+00:00",
    },
    {
        "id": "prospect_104",
        "name": "Summit Treasury",
        "segment": "Treasury management SaaS",
        "source": "Product-led signup",
        "stage": "converted",
        "fit_score": 88,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "Production workflow completed.",
        "next_action": "Expansion opportunity review",
        "created_at": "2026-04-25T10:11:00+00:00",
    },
]

REVIEW_QUEUE = [
    {
        "id": "review_201",
        "prospect_id": "prospect_103",
        "priority": "High",
        "reason": [
            "High-value account is blocked between evaluation and conversion.",
            "Security review is incomplete despite strong product fit.",
        ],
        "recommended_action": "Schedule solutions review and send security packet.",
        "status": "open",
    }
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def get_account(account_id: str):
    return next((account for account in ACCOUNTS if account["id"] == account_id), None)


def reset_account_state(account_id: str):
    return True


def build_lifecycle(account):
    return {
        "account_id": account["id"],
        "journey": [
            {
                "stage": "Onboarding",
                "status": "complete" if account["stage"] != "Onboarding" else "at_risk",
                "score": 78 if account["stage"] != "Onboarding" else 52,
                "signal": "Workspace configured, team invited",
            },
            {
                "stage": "Activation",
                "status": "at_risk" if account["activation_risk"] > 60 else "healthy",
                "score": 100 - account["activation_risk"],
                "signal": "First meaningful API workflow not fully completed",
            },
            {
                "stage": "Retention",
                "status": "healthy" if account["churn_risk"] < 30 else "watch",
                "score": 100 - account["churn_risk"],
                "signal": "Recurring weekly product usage detected",
            },
            {
                "stage": "Expansion",
                "status": "opportunity" if account["revenue_opportunity"] > 30000 else "watch",
                "score": min(95, account["revenue_opportunity"] // 1500),
                "signal": "Additional product fit detected from usage patterns",
            },
        ],
    }


def run_agents(account):
    risk_level = (
        "high"
        if account["activation_risk"] >= 70
        else "medium"
        if account["activation_risk"] >= 40
        else "low"
    )

    return {
        "account_id": account["id"],
        "risk_level": risk_level,
        "recommendation": {
            "title": "Trigger guided activation intervention",
            "summary": (
                "The account has completed initial setup but has not reached the activation milestone. "
                "Recommend a targeted success playbook focused on webhook completion and first production workflow."
            ),
            "primary_action": "Send technical onboarding checklist and schedule solutions review",
            "expected_impact": "Increase activation likelihood by 18–24%",
            "confidence": 0.84,
        },
        "agents": [
            {
                "name": "Onboarding Agent",
                "status": "complete",
                "finding": "Workspace setup is mostly complete, but technical configuration is not production-ready.",
            },
            {
                "name": "Activation Agent",
                "status": "attention",
                "finding": "Activation risk is elevated because the first production API workflow is incomplete.",
            },
            {
                "name": "Personalization Agent",
                "status": "complete",
                "finding": "Recommended intervention should focus on engineering enablement, not generic customer success outreach.",
            },
            {
                "name": "Revenue Agent",
                "status": "opportunity",
                "finding": f"Potential expansion opportunity estimated at ${account['revenue_opportunity']:,}.",
            },
        ],
    }


def build_revenue_lifecycle():
    prospects = PROSPECTS
    qualified = [p for p in prospects if p["stage"] in {"qualified", "evaluated", "in_review", "converted"}]
    evaluated = [p for p in prospects if p["stage"] in {"evaluated", "in_review", "converted"}]
    in_review = [p for p in prospects if p["stage"] == "in_review"]
    converted = [p for p in prospects if p["stage"] == "converted"]

    potential_value = len(prospects) * VALUE_PER_CONVERTED_CUSTOMER
    realized_value = len(converted) * VALUE_PER_CONVERTED_CUSTOMER
    leakage_value = max((len(evaluated) - len(converted)) * VALUE_PER_CONVERTED_CUSTOMER, 0)

    open_reviews = [review for review in REVIEW_QUEUE if review["status"] == "open"]

    if open_reviews:
        insight_reason = "High-fit prospects are stalling in human review before conversion."
        recommendation = "Prioritize review-blocked accounts and trigger technical/security enablement."
        stage = "review_to_conversion"
    else:
        insight_reason = "Qualified prospects are available but not enough have reached evaluation."
        recommendation = "Auto-prioritize the highest-fit prospects for activation evaluation."
        stage = "qualification_to_evaluation"

    return {
        "customer_profile": {
            "title": "Fintech API customer lifecycle",
            "buyer": "Head of Product, Growth, or Developer Experience",
            "user": "Customer success, solutions engineering, and growth teams",
            "value_per_converted_customer": VALUE_PER_CONVERTED_CUSTOMER,
            "target_customer_profile": {
                "segment": "Fintech, banking, lending, payments, or SaaS platform",
                "use_case": "API integration that must progress from sandbox setup to production usage",
                "success_criteria": [
                    "API keys created",
                    "First sandbox workflow completed",
                    "Webhook or production checklist completed",
                    "Human review resolved",
                ],
                "conversion_risks": [
                    "Incomplete technical setup",
                    "Security or compliance blocker",
                    "No production workflow after sandbox activity",
                ],
            },
        },
        "prospect_feed": sorted(prospects, key=lambda item: item["created_at"], reverse=True),
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
                **review,
                "prospect": next(
                    (prospect for prospect in prospects if prospect["id"] == review["prospect_id"]),
                    None,
                ),
                "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
            }
            for review in open_reviews
        ],
        "agent_insight": {
            "stage": stage,
            "severity": "high" if leakage_value >= VALUE_PER_CONVERTED_CUSTOMER * 2 else "medium",
            "reason": insight_reason,
            "recommendation": recommendation,
            "estimated_gain": min(leakage_value, VALUE_PER_CONVERTED_CUSTOMER * 3),
        },
    }


def ingest_prospect():
    source = choice(
        [
            "Product-led signup",
            "Partner referral",
            "Inbound demo request",
            "Outbound target account",
            "Developer community",
        ]
    )
    segment = choice(
        [
            "Fintech startup",
            "Regional bank",
            "Lending platform",
            "Payments company",
            "B2B SaaS platform",
        ]
    )
    stage: LifecycleStage = choice(["prospect", "qualified", "evaluated", "in_review"])
    score = randint(48, 94)
    prospect_number = 200 + len(PROSPECTS) + randint(1, 50)

    prospect = {
        "id": f"prospect_{prospect_number}",
        "name": choice(
            [
                "BlueRiver Finance",
                "Orbit Lending",
                "Keystone Pay",
                "Apex Capital",
                "Relay Banking",
                "BridgeFlow",
            ]
        ),
        "segment": segment,
        "source": source,
        "stage": stage,
        "fit_score": score,
        "estimated_value": VALUE_PER_CONVERTED_CUSTOMER,
        "signal": "New account activity detected and added to lifecycle funnel.",
        "next_action": (
            "Send activation checklist"
            if stage in {"prospect", "qualified"}
            else "Route to human review"
            if stage == "in_review"
            else "Run agent evaluation"
        ),
        "created_at": utc_now(),
    }

    PROSPECTS.append(prospect)

    if stage == "in_review":
        REVIEW_QUEUE.append(
            {
                "id": f"review_{300 + len(REVIEW_QUEUE)}",
                "prospect_id": prospect["id"],
                "priority": "High" if score >= 80 else "Medium",
                "reason": [
                    "New high-fit prospect requires human decision before conversion.",
                    "Agent detected a blocker between evaluation and production activation.",
                ],
                "recommended_action": "Assign solutions engineer and confirm production readiness.",
                "status": "open",
            }
        )

    return {
        "message": "Mock prospect ingested",
        "ingested_at": utc_now(),
        "prospect": prospect,
    }


def update_review(review_id, action):
    review = next((item for item in REVIEW_QUEUE if item["id"] == review_id), None)

    if not review:
        return None

    prospect = next(
        (item for item in PROSPECTS if item["id"] == review["prospect_id"]),
        None,
    )

    if action == "approve" and prospect:
        prospect["stage"] = "converted"
        prospect["signal"] = "Human approved account for conversion"
        prospect["next_action"] = "Begin expansion monitoring"
        review["status"] = "resolved"
        review["workflow_status"] = "Converted"

    elif action == "reject" and prospect:
        prospect["stage"] = "rejected"
        prospect["signal"] = "Human rejected account from pipeline"
        prospect["next_action"] = "Recycle into nurture campaign"
        review["status"] = "resolved"
        review["workflow_status"] = "Rejected"

    elif action == "request_data" and prospect:
        prospect["stage"] = "in_review"
        prospect["signal"] = "Awaiting additional information"
        prospect["next_action"] = "Follow up for missing technical or commercial data"
        review["status"] = "open"
        review["workflow_status"] = "Awaiting Info"
        review["reason"] = [
            "Additional information requested",
            "Conversion paused until missing data is resolved",
        ]
        review["recommended_action"] = "Follow up with customer and solutions engineer"

    return {
        "review_id": review_id,
        "action": action,
        "status": review["status"],
        "workflow_status": review.get("workflow_status"),
        "message": "Human review action captured.",
    }
