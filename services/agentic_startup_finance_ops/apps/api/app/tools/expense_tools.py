from app.data.seed_data import EXPENSES
class ExpenseAnalysisTools:
    provider='expense_analysis_tools'
    def find_savings_opportunities(self, department=None, expense_type=None):
        vendors=[e for e in EXPENSES if e['status'] in {'overlapping','underutilized','deferrable'}]
        if department and department!='general':
            vendors=[e for e in vendors if e.get('department','general')==department] or vendors
        if expense_type and expense_type!='vendor':
            vendors=[e for e in vendors if e.get('expense_type','software')==expense_type] or vendors
        return vendors
    def calculate_monthly_savings(self, department=None, expense_type=None):
        v=self.find_savings_opportunities(department=department, expense_type=expense_type); monthly=sum(x['monthly_cost'] for x in v); return {'monthly_savings':monthly,'annual_savings':monthly*12,'vendors':v,'department_filter':department,'expense_type_filter':expense_type}
