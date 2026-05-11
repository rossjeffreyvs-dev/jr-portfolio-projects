import asyncio, json
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from app.services.orchestrator import get_run
router=APIRouter()
@router.get('/workflow/{run_id}')
def workflow(run_id:str):
    run=get_run(run_id)
    if not run: raise HTTPException(status_code=404,detail='Workflow run not found')
    return run
@router.get('/workflow/{run_id}/events')
def workflow_events(run_id:str):
    run=get_run(run_id)
    if not run: raise HTTPException(status_code=404,detail='Workflow run not found')
    return {'events':run.events}
@router.get('/workflow/{run_id}/stream')
async def workflow_stream(run_id:str):
    run=get_run(run_id)
    if not run: raise HTTPException(status_code=404,detail='Workflow run not found')
    async def gen():
        for event in run.events:
            await asyncio.sleep(.2)
            yield {'event':'workflow_event','data':event.model_dump_json() if hasattr(event,'model_dump_json') else json.dumps(event.dict())}
    return EventSourceResponse(gen())
