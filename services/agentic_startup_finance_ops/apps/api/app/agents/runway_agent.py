from app.models.schemas import AgentFinding, confidence_detail
from app.tools.tool_utils import make_tool_call
class RunwayForecastingAgent:
    name='Runway Forecasting Agent'
    def __init__(self,forecasting_tools): self.forecasting_tools=forecasting_tools
    def run(self,context):
        headcount=int(context.parameters.get('headcount',2)); role=str(context.parameters.get('role','engineer')); impact=self.forecasting_tools.model_hiring_impact(headcount=headcount,role=role)
        call=make_tool_call(self.name,'forecasting.model_hiring_impact',f'Model fully loaded cost of {headcount} {role}(s) against cash and burn.',f"Added burn ${impact['added_monthly_burn']:,.0f}; runway moves from {impact['current_runway_months']} to {impact['new_runway_months']} months.",['cash_balance','monthly_burn','headcount','cost_per_head'],760,impact)
        return AgentFinding(agent=self.name,title='Hiring is possible but creates a tighter fundraising window',finding=f"Hiring {headcount} {role}{'' if headcount==1 else 's'} would increase monthly burn by ${impact['added_monthly_burn']:,.0f} and reduce runway from {impact['current_runway_months']} to {impact['new_runway_months']} months.",confidence=.92,confidence_detail=confidence_detail(.92),evidence=['cash_balance','monthly_burn','engineer_cost_assumption','headcount'],metrics=impact,tool_calls=[call])
