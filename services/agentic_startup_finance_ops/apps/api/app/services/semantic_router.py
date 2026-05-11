import re
from app.data.seed_data import ASSUMPTIONS, SCENARIOS
from app.models.schemas import ScenarioContext

NUMBER_WORDS={'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10}
ROLE_ALIASES={
    'engineer':['engineer','engineers','developer','developers','backend engineer','frontend engineer'],
    'sales rep':['sales rep','sales reps','salesperson','salespeople','account executive','aes','ae'],
    'designer':['designer','designers','product designer'],
    'product manager':['pm','pms','product manager','product managers'],
    'customer success manager':['csm','csms','customer success','success manager'],
}
SEGMENTS=['enterprise','growth','startup','smb','mid-market','mid market']
RISK_TYPES={'churn':['churn','cancel','renewal','retention'],'payment_failure':['failed payment','failed invoice','collections','past due','dunning'],'activation':['activation','onboarding','conversion','dropoff','drop-off'],'usage_decline':['usage decline','usage','engagement']}
DEPARTMENTS={'gtm':['gtm','sales','marketing','go-to-market','go to market'],'engineering':['engineering','dev','developer'],'support':['support','customer success','success'],'general':['vendor','vendors','saas','software','tools']}
TIMEFRAMES={'before fundraising':'before fundraising','next quarter':'next quarter','this quarter':'this quarter','next month':'next month','next 30 days':'next 30 days','board meeting':'board meeting'}

def _extract_headcount(q:str):
    n=q.lower(); m=re.search(r'\b(\d+)\s+(?:more\s+)?(?:engineers?|developers?|hires?|people|employees|reps?|salespeople|designers?|pms?|product managers?|csms?)\b',n)
    if m: return int(m.group(1))
    for w,v in NUMBER_WORDS.items():
        if re.search(rf'\b{w}\s+(?:more\s+)?(?:engineers?|developers?|hires?|people|employees|reps?|salespeople|designers?|pms?|product managers?|csms?)\b',n): return v
    return ASSUMPTIONS['default_engineer_count']

def _extract_role(q:str):
    n=q.lower()
    for canonical,aliases in ROLE_ALIASES.items():
        if any(a in n for a in aliases): return canonical
    return 'engineer'

def _extract_timeframe(q:str):
    n=q.lower()
    for phrase,val in TIMEFRAMES.items():
        if phrase in n: return val
    m=re.search(r'next\s+(\d+)\s+(days?|weeks?|months?)',n)
    if m: return f"next {m.group(1)} {m.group(2)}"
    return 'next quarter'

def _extract_segment(q:str):
    n=q.lower()
    for s in SEGMENTS:
        if s in n: return 'mid-market' if s=='mid market' else s
    return None

def _extract_risk_type(q:str):
    n=q.lower()
    for risk,terms in RISK_TYPES.items():
        if any(t in n for t in terms): return risk
    return None

def _extract_department(q:str):
    n=q.lower()
    for dept,terms in DEPARTMENTS.items():
        if any(t in n for t in terms): return dept
    return None

def _context(intent:str,scenario_id:str,question:str,**params):
    clean={k:v for k,v in params.items() if v is not None}
    return ScenarioContext(intent=intent,scenario_id=scenario_id,question=question,parameters=clean)

def route_question(question):
    q=question.lower()
    # Hiring intent wins even if the founder mentions fundraising/board timing.
    if any(t in q for t in ['hire','engineer','developer','headcount','recruit','sales rep','salespeople','designer','product manager','csm']):
        return _context('hiring_runway','hiring_runway',question,headcount=_extract_headcount(question),role=_extract_role(question),timeframe=_extract_timeframe(question))
    if any(t in q for t in ['revenue at risk','at risk','failed payment','failed invoice','churn','collections','renewal','retention','past due']):
        return _context('revenue_at_risk','revenue_at_risk',question,segment=_extract_segment(question),risk_type=_extract_risk_type(question) or 'payment_failure',timeframe=_extract_timeframe(question))
    if any(t in q for t in ['overspending','spend','cost','vendor','savings','burn','saas','software','tools']):
        return _context('cost_optimization','cost_optimization',question,department=_extract_department(question) or 'general',expense_type='software' if any(t in q for t in ['saas','software','tools']) else 'vendor',timeframe=_extract_timeframe(question))
    if any(t in q for t in ['activation','conversion','onboarding','dropoff','drop-off','plg','funnel']):
        return _context('activation_dropoff','activation_dropoff',question,segment=_extract_segment(question),risk_type='activation',timeframe=_extract_timeframe(question))
    if any(t in q for t in ['board','investor','update','summary','fundraising','series a']):
        return _context('investor_update','investor_update',question,audience='board' if 'board' in q else 'investor',timeframe=_extract_timeframe(question))
    return _context('hiring_runway','hiring_runway',question,headcount=ASSUMPTIONS['default_engineer_count'],role='engineer',timeframe='next quarter')

def get_matched_scenario(scenario_id): return next((s for s in SCENARIOS if s['id']==scenario_id),SCENARIOS[0])
