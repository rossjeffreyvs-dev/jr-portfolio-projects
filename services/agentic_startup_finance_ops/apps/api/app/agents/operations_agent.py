from app.models.schemas import AgentFinding, confidence_detail
from app.tools.tool_utils import make_tool_call
class OperationsOptimizationAgent:
    name='Operations Optimization Agent'
    def __init__(self,expense_tools): self.expense_tools=expense_tools
    def run(self,context=None):
        params=getattr(context,'parameters',{}) if context else {}
        department=params.get('department'); expense_type=params.get('expense_type')
        s=self.expense_tools.calculate_monthly_savings(department=department,expense_type=expense_type); call=make_tool_call(self.name,'expenses.calculate_monthly_savings',f"Scan vendor expenses. Filters: department={department or 'all'}, expense_type={expense_type or 'all'}.",f"Identified ${s['monthly_savings']:,.0f}/month in potential savings across {len(s['vendors'])} vendors.",['expense_status','monthly_vendor_costs','semantic_filters'],840,s)
        filter_phrase=f" for {department} {expense_type or 'vendor'} spend" if department else ''
        return AgentFinding(agent=self.name,title='Spend optimization can recover meaningful runway',finding=f"Underutilized, overlapping, or deferrable vendors{filter_phrase} represent ${s['monthly_savings']:,.0f} in monthly savings potential, or ${s['annual_savings']:,.0f} annually.",confidence=.84,confidence_detail=confidence_detail(.84),evidence=['expense_status','monthly_vendor_costs','semantic_filters'],metrics=s,tool_calls=[call])
