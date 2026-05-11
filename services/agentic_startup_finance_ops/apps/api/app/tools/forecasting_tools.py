from app.data.seed_data import STARTUP, ASSUMPTIONS
class ForecastingTools:
    provider='forecasting_tools'
    def get_operating_baseline(self):
        return {'cash_balance':STARTUP['cash_balance'],'monthly_burn':STARTUP['monthly_burn'],'runway_months':round(STARTUP['cash_balance']/STARTUP['monthly_burn'],1)}
    def model_hiring_impact(self, headcount=None, role='engineer', cost_per_head=None):
        headcount=headcount or ASSUMPTIONS['default_engineer_count']; cost_per_head=cost_per_head or ASSUMPTIONS['engineer_fully_loaded_monthly_cost']
        cash=STARTUP['cash_balance']; burn=STARTUP['monthly_burn']; added=headcount*cost_per_head; new_burn=burn+added
        return {'headcount':headcount,'role':role,'cost_per_head':cost_per_head,'added_monthly_burn':added,'new_monthly_burn':new_burn,'current_runway_months':round(cash/burn,1),'new_runway_months':round(cash/new_burn,1),'runway_delta_months':round(cash/burn-cash/new_burn,1)}
    def build_runway_projection(self, added_monthly_burn=0, savings=0):
        cash=STARTUP['cash_balance']; current=STARTUP['monthly_burn']; hiring=current+added_monthly_burn; optimized=max(current-savings,0)
        return [{'month':m,'current_plan_cash':max(cash-current*m,0),'hiring_plan_cash':max(cash-hiring*m,0),'optimized_plan_cash':max(cash-optimized*m,0)} for m in range(13)]
    def build_burn_projection(self, added_monthly_burn=0, savings=0):
        current=STARTUP['monthly_burn']; return [{'label':'Current burn','value':float(current),'metadata':{}},{'label':'After hiring','value':float(current+added_monthly_burn),'metadata':{}},{'label':'After savings','value':float(max(current-savings,0)),'metadata':{}}]
