from fastapi import APIRouter, HTTPException
from app.services.orchestrator import list_scenarios, run_scenario
router=APIRouter()
@router.get('/scenarios')
def scenarios(): return {'scenarios':list_scenarios()}
@router.post('/scenarios/{scenario_id}/run')
def run(scenario_id:str):
    if scenario_id not in {s.id for s in list_scenarios()}: raise HTTPException(status_code=404,detail='Scenario not found')
    return {'run':run_scenario(scenario_id)}
