from app.models.schemas import AgentFinding, confidence_detail
from app.tools.tool_utils import make_tool_call
class RevenueIntelligenceAgent:
    name='Revenue Intelligence Agent'
    def __init__(self,stripe_tools): self.stripe_tools=stripe_tools
    def run(self,context):
        intent=context.intent if hasattr(context,'intent') else str(context)
        params=context.parameters if hasattr(context,'parameters') else {}
        segment=params.get('segment'); risk_type=params.get('risk_type')
        m=self.stripe_tools.get_subscription_metrics(); r=self.stripe_tools.get_revenue_at_risk(segment=segment,risk_type=risk_type)
        calls=[make_tool_call(self.name,'stripe.get_subscription_metrics','Retrieve MRR, ARR, NRR, active customers, and failed payment totals.',f"MRR ${m['monthly_recurring_revenue']:,.0f}, NRR {m['net_revenue_retention']:.0f}%, failed payments ${m['failed_payments_value']:,.0f}.",['stripe.subscriptions','stripe.invoices'],520,m),make_tool_call(self.name,'stripe.get_revenue_at_risk',f"Analyze failed invoices and revenue-at-risk accounts. Filters: segment={segment or 'all'}, risk_type={risk_type or 'all'}.",f"{r['failed_payments_count']} failed invoices totaling ${r['failed_payments_value']:,.0f}.",['stripe.invoices','failed_payment_value','filters'],610,r)]
        if intent=='revenue_at_risk':
            title='Revenue at risk is concentrated in failed payments and customer-health signals'
            finding=f"Revenue risk analysis found ${r['failed_payments_value']:,.0f} in failed invoices across {r['failed_payments_count']} accounts, with filters segment={segment or 'all'} and risk_type={risk_type or 'all'}."
        else:
            title='Revenue base remains healthy but payment failures need attention'
            finding=f"MRR is ${m['monthly_recurring_revenue']:,.0f} with {m['net_revenue_retention']:.0f}% NRR, but ${m['failed_payments_value']:,.0f} in payment failures could reduce operating flexibility."
        return AgentFinding(agent=self.name,title=title,finding=finding,confidence=.89,confidence_detail=confidence_detail(.89),evidence=['monthly_recurring_revenue','failed_payments_value','net_revenue_retention','semantic_filters'],metrics={'mrr':m['monthly_recurring_revenue'],'arr':m['annual_recurring_revenue'],'failed_payments_value':r['failed_payments_value'],'failed_payments_count':r['failed_payments_count'],'nrr':m['net_revenue_retention'],'revenue_risk_breakdown':r['revenue_risk_breakdown'],'segment':segment,'risk_type':risk_type},tool_calls=calls)
