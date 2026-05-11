from app.data.seed_data import STARTUP, FAILED_INVOICES, FAILED_PAYMENTS_TREND
class MockStripeTools:
    provider='mock_stripe_tools'
    def get_subscription_metrics(self):
        failed=sum(i['amount_due'] for i in FAILED_INVOICES)
        return {**STARTUP,'failed_payments_count':len(FAILED_INVOICES),'failed_payments_value':failed}
    def get_failed_invoices(self, segment=None, risk_type=None):
        invoices=FAILED_INVOICES
        if segment: invoices=[i for i in invoices if str(i.get('segment','')).lower()==segment.lower()]
        if risk_type: invoices=[i for i in invoices if str(i.get('risk','')).lower()==risk_type.lower()]
        return invoices
    def get_failed_payments_trend(self): return FAILED_PAYMENTS_TREND
    def get_revenue_at_risk(self, segment=None, risk_type=None):
        invoices=self.get_failed_invoices(segment=segment, risk_type=risk_type if risk_type=='payment_failure' else None)
        if not invoices and (segment or risk_type): invoices=self.get_failed_invoices()
        return {'failed_invoices':invoices,'failed_payments_count':len(invoices),'failed_payments_value':sum(i['amount_due'] for i in invoices),'segment_filter':segment,'risk_type_filter':risk_type,'revenue_risk_breakdown':[{'label':i['customer'],'value':float(i['amount_due']),'metadata':{'risk':i['risk'],'segment':i.get('segment'),'days_past_due':i['days_past_due']}} for i in invoices[:5]]}
