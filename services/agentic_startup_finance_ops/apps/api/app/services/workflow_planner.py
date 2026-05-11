from app.models.schemas import ScenarioContext, WorkflowPlan

AGENT_TOOLS={
    'Revenue Intelligence Agent':['stripe.get_subscription_metrics','stripe.get_revenue_at_risk','stripe.get_failed_payments_trend'],
    'Runway Forecasting Agent':['forecasting.model_hiring_impact','forecasting.build_runway_projection','forecasting.build_burn_projection'],
    'Operations Optimization Agent':['expenses.calculate_monthly_savings','expenses.find_savings_opportunities'],
    'Growth Risk Agent':['customers.calculate_at_risk_mrr','customers.detect_activation_dropoff'],
    'Investor Update Agent':['investor.prepare_operating_snapshot','openai.generate_summary'],
}
ALL_AGENTS=list(AGENT_TOOLS.keys())

def build_workflow_plan(ctx: ScenarioContext) -> WorkflowPlan:
    if ctx.intent=='hiring_runway':
        selected=['Revenue Intelligence Agent','Runway Forecasting Agent','Operations Optimization Agent','Growth Risk Agent','Investor Update Agent']
        objective=f"Evaluate hiring {ctx.parameters.get('headcount',2)} {ctx.parameters.get('role','engineer')}(s) against revenue quality, runway, savings, and customer risk."
        rationale='Hiring decisions require revenue durability, runway modeling, savings options, customer risk, and an executive-ready recommendation.'
    elif ctx.intent=='revenue_at_risk':
        selected=['Revenue Intelligence Agent','Growth Risk Agent','Investor Update Agent']
        objective='Identify payment, churn, and customer-health exposure in current recurring revenue.'
        rationale='Revenue-risk questions need Stripe-like invoice/subscription signals and customer-health analysis; runway modeling is skipped unless hiring or burn is part of the question.'
    elif ctx.intent=='cost_optimization':
        selected=['Operations Optimization Agent','Runway Forecasting Agent','Investor Update Agent']
        objective=f"Identify overspending and estimate runway impact for {ctx.parameters.get('department','general')} expenses."
        rationale='Cost questions need vendor savings and burn/runway impact; revenue and growth-risk agents are skipped unless revenue risk is explicit.'
    elif ctx.intent=='activation_dropoff':
        selected=['Growth Risk Agent','Revenue Intelligence Agent','Investor Update Agent']
        objective='Diagnose activation funnel deterioration and quantify revenue exposure from onboarding friction.'
        rationale='Activation questions need funnel/customer-health tools plus revenue context to size impact.'
    else:
        selected=['Revenue Intelligence Agent','Runway Forecasting Agent','Operations Optimization Agent','Growth Risk Agent','Investor Update Agent']
        objective='Prepare an investor-ready operating narrative across revenue, runway, operations, and growth risk.'
        rationale='Board updates require a cross-functional operating snapshot and LLM-based synthesis.'
    tools=[]
    for agent in selected: tools.extend(AGENT_TOOLS[agent])
    skipped=[a for a in ALL_AGENTS if a not in selected]
    return WorkflowPlan(intent=ctx.intent,objective=objective,selected_agents=selected,selected_tools=tools,skipped_agents=skipped,rationale=rationale,parameters=ctx.parameters)
