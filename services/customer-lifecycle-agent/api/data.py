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


def get_account(account_id: str):
    return next((account for account in ACCOUNTS if account["id"] == account_id), None)


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
    risk_level = "high" if account["activation_risk"] >= 70 else "medium" if account["activation_risk"] >= 40 else "low"

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