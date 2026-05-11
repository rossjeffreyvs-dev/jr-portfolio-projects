from __future__ import annotations
from datetime import datetime, timedelta
from uuid import uuid4
from app.agents.revenue_agent import RevenueIntelligenceAgent
from app.agents.runway_agent import RunwayForecastingAgent
from app.agents.operations_agent import OperationsOptimizationAgent
from app.agents.growth_risk_agent import GrowthRiskAgent
from app.agents.investor_agent import InvestorUpdateAgent
from app.data.seed_data import SCENARIOS, STARTUP
from app.models.schemas import Recommendation, ReviewItem, Scenario, StartupMetrics, WorkflowEvent, WorkflowRun, confidence_detail
from app.services.semantic_router import get_matched_scenario, route_question
from app.services.workflow_planner import build_workflow_plan
from app.tools.provider import get_tool_registry

RUN_STORE={}
FEEDBACK_STORE=[]

def now_iso(ms=0): return (datetime.utcnow()+timedelta(milliseconds=ms)).isoformat()+'Z'

def get_metrics():
    t=get_tool_registry(); sub=t.stripe.get_subscription_metrics(); base=t.forecasting.get_operating_baseline(); churn=t.customer_health.calculate_at_risk_mrr()
    return StartupMetrics(startup_id=STARTUP['startup_id'],name=STARTUP['name'],cash_balance=base['cash_balance'],monthly_recurring_revenue=sub['monthly_recurring_revenue'],annual_recurring_revenue=sub['annual_recurring_revenue'],monthly_burn=base['monthly_burn'],runway_months=base['runway_months'],net_revenue_retention=sub['net_revenue_retention'],gross_revenue_retention=sub['gross_revenue_retention'],active_customers=sub['active_customers'],failed_payments_count=sub['failed_payments_count'],failed_payments_value=sub['failed_payments_value'],expansion_pipeline=sub['expansion_pipeline'],churn_risk_accounts=churn['at_risk_accounts'])

def list_scenarios(): return [Scenario(**s) for s in SCENARIOS]

def _event(run_id, seq, finding, offset):
    dur=950+seq*180; status='warning' if finding.agent=='Operations Optimization Agent' else 'requires_review' if finding.agent=='Investor Update Agent' else 'completed'
    return WorkflowEvent(id=f'evt_{uuid4().hex[:8]}',run_id=run_id,sequence=seq,agent=finding.agent,title=finding.title,message=finding.finding,status=status,evidence=finding.evidence,started_at=now_iso(offset),completed_at=now_iso(offset+dur),duration_ms=dur,tool_call=finding.tool_calls[0] if finding.tool_calls else None)

def _metadata(ctx, findings):
    if ctx.intent=='hiring_runway':
        headcount=int(ctx.parameters.get('headcount',2)); role=ctx.parameters.get('role','engineer')
        per_head=44000 if role=='engineer' else 36000 if role=='sales rep' else 32000
        return 'hiring','high',float(headcount*per_head),'sequence_hiring'
    if ctx.intent=='revenue_at_risk': return 'revenue','high',42000.0,'recover_failed_payments'
    if ctx.intent=='cost_optimization': return 'operations','medium',364800.0,'reduce_vendor_spend'
    if ctx.intent=='activation_dropoff': return 'growth','medium',39600.0,'fix_activation_dropoff'
    return 'investor','medium',88000.0,'prepare_board_update'

def _agent_instances(t):
    return {
        'Revenue Intelligence Agent': RevenueIntelligenceAgent(t.stripe),
        'Runway Forecasting Agent': RunwayForecastingAgent(t.forecasting),
        'Operations Optimization Agent': OperationsOptimizationAgent(t.expenses),
        'Growth Risk Agent': GrowthRiskAgent(t.customer_health),
        'Investor Update Agent': InvestorUpdateAgent(),
    }

def _run_agent(agent, ctx):
    if isinstance(agent,RunwayForecastingAgent): return agent.run(ctx)
    if isinstance(agent,GrowthRiskAgent): return agent.run(ctx)
    if isinstance(agent,RevenueIntelligenceAgent): return agent.run(ctx)
    if isinstance(agent,OperationsOptimizationAgent): return agent.run(ctx)
    return agent.run()

def _feedback_weight_for(action_type:str, rec_type:str) -> float:
    if not FEEDBACK_STORE: return 0.0
    relevant=[f for f in FEEDBACK_STORE if f.get('recommended_action_type')==action_type or f.get('recommendation_type')==rec_type]
    if not relevant: return 0.0
    score=0.0
    for f in relevant:
        if f.get('decision') in {'approved','executed'}: score+=0.06
        elif f.get('decision')=='modified': score+=0.02
        elif f.get('decision')=='rejected': score-=0.08
        if isinstance(f.get('user_rating'),int): score+=(f['user_rating']-3)*0.015
    return max(min(score,0.18),-0.18)

def _rank_recommendations(recs):
    priority_base={'critical':1.0,'high':0.82,'medium':0.58,'low':0.35}
    for r in recs:
        weight=_feedback_weight_for(r.recommended_action_type,r.type)
        r.feedback_weight=round(weight,3)
        r.rank_score=round(priority_base.get(r.priority,0.5)+(r.confidence*.2)+weight,3)
    return sorted(recs,key=lambda r:r.rank_score,reverse=True)

def _recommendations(run_id, ctx, findings):
    scen,_,impact,action=_metadata(ctx,findings); recs=[]
    rev=next((f for f in findings if f.agent=='Revenue Intelligence Agent'),None); ops=next((f for f in findings if f.agent=='Operations Optimization Agent'),None); growth=next((f for f in findings if f.agent=='Growth Risk Agent'),None); runway=next((f for f in findings if f.agent=='Runway Forecasting Agent'),None)
    if ctx.intent=='hiring_runway':
        h=int(ctx.parameters.get('headcount',2)); role=ctx.parameters.get('role','engineer'); added=float((runway.metrics or {}).get('added_monthly_burn',h*44000)) if runway else h*44000
        recs.append(Recommendation(id=f'rec_{uuid4().hex[:8]}',run_id=run_id,type='hiring',priority='high',title=f"Sequence hiring of {h} {role}{'s' if h!=1 and not str(role).endswith('s') else ''} after payment recovery",impact=f'${added:,.0f} monthly fixed-burn decision',confidence=.91,confidence_detail=confidence_detail(.91),rationale='The hiring plan should be sequenced after payment recovery and vendor optimization so growth investment does not compress the fundraising window.',evidence=['runway_delta_months','failed_payments_value','monthly_savings','headcount','role'],scenario_type=scen,estimated_financial_impact=impact,recommended_action_type=action))
    if ctx.intent in {'hiring_runway','revenue_at_risk','investor_update'}:
        val=float((rev.metrics or {}).get('failed_payments_value',42000)) if rev else 42000.0; recs.append(Recommendation(id=f'rec_{uuid4().hex[:8]}',run_id=run_id,type='revenue',priority='high',title='Recover enterprise failed payments before expanding burn',impact=f'${val:,.0f} near-term cash recovery',confidence=.88,confidence_detail=confidence_detail(.88),rationale='Payment recovery improves operating flexibility without reducing growth investment.',evidence=['failed_payments_value','enterprise_accounts'],scenario_type=scen,estimated_financial_impact=val,recommended_action_type='recover_failed_payments'))
    if ctx.intent in {'cost_optimization','hiring_runway','investor_update'}:
        val=float((ops.metrics or {}).get('monthly_savings',30400)) if ops else 30400.0; dept=ctx.parameters.get('department')
        recs.append(Recommendation(id=f'rec_{uuid4().hex[:8]}',run_id=run_id,type='operations',priority='medium',title=f"Reduce {'targeted ' + dept + ' ' if dept and dept!='general' else ''}overlapping and underutilized vendor spend",impact=f'${val:,.0f}/month savings opportunity',confidence=.84,confidence_detail=confidence_detail(.84),rationale='Vendor optimization can extend runway before new fixed-cost commitments.',evidence=['expense_status','monthly_vendor_costs','department_filter'],scenario_type=scen,estimated_financial_impact=val*12,recommended_action_type='reduce_vendor_spend'))
    if ctx.intent in {'activation_dropoff','revenue_at_risk'}:
        val=float((growth.metrics or {}).get('at_risk_mrr',39600)) if growth else 39600.0; segment=ctx.parameters.get('segment')
        recs.append(Recommendation(id=f'rec_{uuid4().hex[:8]}',run_id=run_id,type='growth',priority='medium',title=f"Prioritize onboarding intervention for {'the ' + segment + ' segment' if segment else 'at-risk accounts'}",impact=f'${val:,.0f} MRR protected',confidence=.86,confidence_detail=confidence_detail(.86),rationale='Activation and usage issues are concentrated in accounts with meaningful revenue exposure.',evidence=['activation_funnel','customer_health','at_risk_mrr','segment_filter'],scenario_type=scen,estimated_financial_impact=val,recommended_action_type='fix_activation_dropoff'))
    if ctx.intent=='investor_update': recs.append(Recommendation(id=f'rec_{uuid4().hex[:8]}',run_id=run_id,type='investor',priority='medium',title='Prepare board update around runway, collections, and hiring sequence',impact='Board-ready operating narrative',confidence=.9,confidence_detail=confidence_detail(.9),rationale='The investor narrative should connect growth quality, collections, runway preservation, and hiring discipline.',evidence=['arr','nrr','runway_months','recommendations'],scenario_type=scen,estimated_financial_impact=impact,recommended_action_type='prepare_board_update'))
    return _rank_recommendations(recs)

def _reviews(recs): return [ReviewItem(id=f'rev_{uuid4().hex[:8]}',run_id=r.run_id,title=f'Review: {r.title}',priority=r.priority,recommendation_id=r.id,estimated_impact=r.impact) for r in recs]

def _charts(ctx, findings):
    t=get_tool_registry(); runway=next((f for f in findings if f.agent=='Runway Forecasting Agent'),None); ops=next((f for f in findings if f.agent=='Operations Optimization Agent'),None); rev=next((f for f in findings if f.agent=='Revenue Intelligence Agent'),None); growth=next((f for f in findings if f.agent=='Growth Risk Agent'),None)
    added=float((runway.metrics or {}).get('added_monthly_burn',0)) if runway else 0; savings=float((ops.metrics or {}).get('monthly_savings',0)) if ops else 0
    charts={'runway_projection':t.forecasting.build_runway_projection(added,savings),'burn_projection':t.forecasting.build_burn_projection(added,savings),'revenue_risk_breakdown':(rev.metrics or {}).get('revenue_risk_breakdown',[]) if rev else [],'failed_payments_trend':t.stripe.get_failed_payments_trend()}
    if growth and (growth.metrics or {}).get('funnel'): charts['activation_funnel']=[{'label':i['step'],'value':float(i['current_rate']),'metadata':{'prior_rate':i['prior_rate'],'delta':i['delta']}} for i in growth.metrics['funnel']]
    return charts

def run_context(ctx):
    t=get_tool_registry(); plan=build_workflow_plan(ctx); run_id=f"run_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid4().hex[:6]}"; findings=[]; agents=_agent_instances(t)
    for agent_name in plan.selected_agents:
        findings.append(_run_agent(agents[agent_name],ctx))
    scen,severity,impact,action=_metadata(ctx,findings); recs=_recommendations(run_id,ctx,findings); llm=t.investor_summary.generate_summary(ctx.scenario_id,ctx.question,findings,recs); reviews=_reviews(recs); charts=_charts(ctx,findings); tool_calls=[tc for f in findings for tc in f.tool_calls]
    events=[WorkflowEvent(id=f'evt_{uuid4().hex[:8]}',run_id=run_id,sequence=1,agent='Orchestrator',title='Dynamic workflow plan selected',message=f"Intent={ctx.intent}; objective={plan.objective}; parameters={ctx.parameters or {}}.",status='completed',evidence=['scenario_id','question','intent','parameters','workflow_plan'],started_at=now_iso(0),completed_at=now_iso(350),duration_ms=350)]
    off=500
    for i,f in enumerate(findings,start=2): events.append(_event(run_id,i,f,off)); off+=1250
    run=WorkflowRun(run_id=run_id,scenario_id=ctx.scenario_id,question=ctx.question,intent=ctx.intent,scenario_type=scen,severity=severity,estimated_financial_impact=impact,recommended_action_type=action,parameters=ctx.parameters,plan=plan,events=events,findings=findings,recommendations=recs,reviews=reviews,charts=charts,tool_calls=tool_calls,llm_reasoning=llm)
    RUN_STORE[run_id]=run; return run

def run_scenario(scenario_id):
    sc=get_matched_scenario(scenario_id); ctx=route_question(sc['question']); ctx.scenario_id=scenario_id; return run_context(ctx)
def ask_question(question):
    ctx=route_question(question); sc=get_matched_scenario(ctx.scenario_id); return {'question':question,'intent':ctx.intent,'matched_scenario_id':ctx.scenario_id,'matched_scenario_question':sc['question'],'parameters':ctx.parameters,'plan':build_workflow_plan(ctx),'run':run_context(ctx)}
def get_run(run_id): return RUN_STORE.get(run_id)
def get_all_reviews():
    out=[]
    for r in RUN_STORE.values(): out.extend(r.reviews)
    return out

def _find_recommendation_for_review(review_id):
    for run in RUN_STORE.values():
        for review in run.reviews:
            if review.id==review_id:
                rec=next((r for r in run.recommendations if r.id==review.recommendation_id),None)
                return run,review,rec
    return None,None,None

def add_feedback(review_id,payload):
    run,review,rec=_find_recommendation_for_review(review_id)
    entry={'review_id':review_id,**payload}
    if rec:
        entry.update({'recommendation_id':rec.id,'recommendation_type':rec.type,'recommended_action_type':rec.recommended_action_type,'run_id':rec.run_id})
    FEEDBACK_STORE.append(entry); return {'status':'recorded','feedback':FEEDBACK_STORE[-1]}

def learning_signals():
    if not FEEDBACK_STORE:
        return {'signals':[{'signal':'No feedback captured yet','description':'Founder decisions will tune future recommendation priority and confidence.','recommendation':'Collect approval/rejection and actual outcome data.','confidence_delta':0.0}]}
    approved=sum(1 for f in FEEDBACK_STORE if f.get('decision') in {'approved','executed'})
    rejected=sum(1 for f in FEEDBACK_STORE if f.get('decision')=='rejected')
    by_action={}
    for f in FEEDBACK_STORE:
        action=f.get('recommended_action_type','unknown'); by_action.setdefault(action,{'approved':0,'rejected':0,'modified':0,'executed':0,'total':0}); by_action[action][f.get('decision','modified')]=by_action[action].get(f.get('decision','modified'),0)+1; by_action[action]['total']+=1
    return {'signals':[{'signal':'Recommendation feedback captured','description':f'{approved} approved/executed and {rejected} rejected recommendations recorded.','recommendation':'Use action-level acceptance rates to adjust recommendation ranking in future runs.','confidence_delta':round((approved-rejected)*0.03,3),'by_action':by_action}]}
