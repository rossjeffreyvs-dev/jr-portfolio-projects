from app.data.seed_data import CUSTOMER_HEALTH, ACTIVATION_FUNNEL
class CustomerHealthTools:
    provider='customer_health_tools'
    def identify_at_risk_accounts(self, segment=None, risk_type=None):
        accounts=[a for a in CUSTOMER_HEALTH if a['risk']!='healthy']
        if segment: accounts=[a for a in accounts if str(a.get('segment','')).lower()==segment.lower()] or accounts
        if risk_type and risk_type not in {'activation','payment_failure'}: accounts=[a for a in accounts if str(a.get('risk','')).lower()==risk_type.lower()] or accounts
        return accounts
    def calculate_at_risk_mrr(self, segment=None, risk_type=None):
        accounts=self.identify_at_risk_accounts(segment=segment,risk_type=risk_type); return {'at_risk_accounts':len(accounts),'at_risk_mrr':sum(a['mrr'] for a in accounts),'accounts':accounts,'segment_filter':segment,'risk_type_filter':risk_type}
    def detect_activation_dropoff(self, segment=None):
        drops=[{**s,'delta':round(s['current_rate']-s['prior_rate'],1)} for s in ACTIVATION_FUNNEL]; largest=min(drops,key=lambda x:x['delta'])
        return {'funnel':drops,'largest_drop_step':largest['step'],'largest_drop_delta':largest['delta'],'activation_decline_points':abs(largest['delta']),'segment_filter':segment}
