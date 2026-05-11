from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)

def test_health(): assert client.get('/health').json()['status']=='ok'
def test_metrics(): assert client.get('/metrics').json()['failed_payments_value']==42000
def test_scenarios(): assert len(client.get('/scenarios').json()['scenarios'])==5

def test_dynamic_hiring_and_tools():
    data=client.post('/questions/ask',json={'question':'Can we afford to hire 3 engineers before fundraising?'}).json()
    assert data['parameters']['headcount']==3
    assert data['parameters']['role']=='engineer'
    assert data['run']['plan']['objective']
    run=data['run']; assert any(tc['tool_name']=='forecasting.model_hiring_impact' for tc in run['tool_calls'])
    runway=next(f for f in run['findings'] if f['agent']=='Runway Forecasting Agent')
    assert runway['metrics']['added_monthly_burn']==66000

def test_revenue_parameter_extraction_and_plan():
    data=client.post('/questions/ask',json={'question':'Which enterprise customers are most likely to churn next quarter?'}).json()
    assert data['intent']=='revenue_at_risk'
    assert data['parameters']['segment']=='enterprise'
    assert data['parameters']['risk_type']=='churn'
    assert 'Runway Forecasting Agent' in data['run']['plan']['skipped_agents']
    assert any(tc['tool_name']=='customers.calculate_at_risk_mrr' for tc in data['run']['tool_calls'])

def test_cost_parameter_extraction_and_tools():
    data=client.post('/questions/ask',json={'question':'Where are we overspending on GTM software tools?'}).json()
    assert data['intent']=='cost_optimization'
    assert data['parameters']['department']=='gtm'
    assert data['parameters']['expense_type']=='software'
    assert any(tc['tool_name']=='expenses.calculate_monthly_savings' for tc in data['run']['tool_calls'])

def test_activation_question():
    data=client.post('/questions/ask',json={'question':'Why are enterprise activation rates declining?'}).json()
    assert data['intent']=='activation_dropoff'
    assert data['parameters']['segment']=='enterprise'
    assert 'activation_funnel' in data['run']['charts']

def test_feedback_weighting():
    data=client.post('/questions/ask',json={'question':'Where are we overspending?'}).json()
    review_id=data['run']['reviews'][0]['id']
    fb=client.post(f'/reviews/{review_id}/feedback',json={'decision':'approved','reason':'Good recommendation','user_rating':5}).json()
    assert fb['status']=='recorded'
    data2=client.post('/questions/ask',json={'question':'Where are we overspending?'}).json()
    assert data2['run']['recommendations'][0]['feedback_weight'] >= 0
    signals=client.get('/learning/signals').json()['signals']
    assert signals

def test_all_core_questions():
    qs=['Can we afford to hire 2 engineers?','What revenue is at risk?','Where are we overspending?','Why are activation rates declining?','Generate a board-ready update.']
    for q in qs:
        r=client.post('/questions/ask',json={'question':q}); assert r.status_code==200; assert r.json()['run']['tool_calls']
