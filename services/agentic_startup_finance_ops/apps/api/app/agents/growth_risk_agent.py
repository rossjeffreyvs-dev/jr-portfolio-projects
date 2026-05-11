from app.models.schemas import AgentFinding, confidence_detail
from app.tools.tool_utils import make_tool_call
class GrowthRiskAgent:
    name='Growth Risk Agent'
    def __init__(self,customer_health_tools): self.customer_health_tools=customer_health_tools
    def run(self,context):
        intent=context.intent if hasattr(context,'intent') else str(context)
        params=context.parameters if hasattr(context,'parameters') else {}
        segment=params.get('segment'); risk_type=params.get('risk_type')
        r=self.customer_health_tools.calculate_at_risk_mrr(segment=segment,risk_type=risk_type); a=self.customer_health_tools.detect_activation_dropoff(segment=segment)
        calls=[make_tool_call(self.name,'customers.calculate_at_risk_mrr',f"Identify at-risk accounts. Filters: segment={segment or 'all'}, risk_type={risk_type or 'all'}.",f"{r['at_risk_accounts']} accounts at risk; ${r['at_risk_mrr']:,.0f} MRR exposed.",['customer_health','mrr_by_account','semantic_filters'],720,r),make_tool_call(self.name,'customers.detect_activation_dropoff',f"Compare current activation funnel to prior period. Segment={segment or 'all'}.",f"Largest drop at {a['largest_drop_step']} ({a['largest_drop_delta']} pts).",['activation_funnel','conversion_rates'],790,a)]
        if intent=='activation_dropoff': title='Activation friction is concentrated around integration setup'; finding=f"Activation declined most sharply at '{a['largest_drop_step']}', down {abs(a['largest_drop_delta']):.1f} percentage points from the prior period for segment={segment or 'all'}."
        else: title='Customer concentration and activation risk require monitoring'; finding=f"{r['at_risk_accounts']} accounts show risk signals, representing ${r['at_risk_mrr']:,.0f} in monthly recurring revenue."
        return AgentFinding(agent=self.name,title=title,finding=finding,confidence=.86,confidence_detail=confidence_detail(.86),evidence=['customer_health','activation_status','mrr_by_account','semantic_filters'],metrics={**r,**a},tool_calls=calls)
