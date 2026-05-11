from app.data.seed_data import STARTUP
from app.models.schemas import AgentFinding, confidence_detail
from app.tools.tool_utils import make_tool_call
class InvestorUpdateAgent:
    name='Investor Update Agent'
    def run(self):
        runway=round(STARTUP['cash_balance']/STARTUP['monthly_burn'],1)
        call=make_tool_call(self.name,'investor.prepare_operating_snapshot','Prepare ARR, NRR, runway, and key operating risks for board-level summary.',f"ARR ${STARTUP['annual_recurring_revenue']:,.0f}, NRR {STARTUP['net_revenue_retention']:.0f}%, runway {runway} months.",['arr','nrr','runway_months'],680,{'arr':STARTUP['annual_recurring_revenue'],'nrr':STARTUP['net_revenue_retention'],'runway_months':runway})
        return AgentFinding(agent=self.name,title='Board summary is ready for founder review',finding=f"{STARTUP['name']} is at ${STARTUP['annual_recurring_revenue']:,.0f} ARR, {STARTUP['net_revenue_retention']:.0f}% NRR, and {runway} months of runway. Recommended focus: recover failed payments, preserve runway, and sequence hiring after collections improve.",confidence=.9,confidence_detail=confidence_detail(.9),evidence=['arr','nrr','runway_months','failed_payments_value'],metrics={'arr':STARTUP['annual_recurring_revenue'],'nrr':STARTUP['net_revenue_retention'],'runway_months':runway},tool_calls=[call])
