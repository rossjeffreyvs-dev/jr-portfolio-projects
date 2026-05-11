from fastapi import APIRouter, HTTPException
from app.services.orchestrator import get_run
router=APIRouter()
@router.get('/reasoning/{run_id}')
def reasoning(run_id:str):
    run=get_run(run_id)
    if not run: raise HTTPException(status_code=404,detail='Workflow run not found')
    return {'llm_reasoning':run.llm_reasoning}
