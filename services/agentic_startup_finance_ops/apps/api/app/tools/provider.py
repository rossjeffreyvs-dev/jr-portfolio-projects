from dataclasses import dataclass
from app.tools.mock_stripe_tools import MockStripeTools
from app.tools.forecasting_tools import ForecastingTools
from app.tools.expense_tools import ExpenseAnalysisTools
from app.tools.customer_health_tools import CustomerHealthTools
from app.tools.investor_summary_tools import InvestorSummaryTool
@dataclass
class ToolRegistry:
    stripe: MockStripeTools; forecasting: ForecastingTools; expenses: ExpenseAnalysisTools; customer_health: CustomerHealthTools; investor_summary: InvestorSummaryTool
def get_tool_registry():
    return ToolRegistry(MockStripeTools(),ForecastingTools(),ExpenseAnalysisTools(),CustomerHealthTools(),InvestorSummaryTool())
