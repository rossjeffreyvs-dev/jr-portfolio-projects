from fastapi import APIRouter, HTTPException

from ...services.store import EVALUATIONS

router = APIRouter(prefix="/workflow", tags=["workflow"])


@router.get("/{evaluation_id}")
def get_workflow(evaluation_id: str):
    evaluation = EVALUATIONS.get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return {
        "evaluation_id": evaluation.id,
        "workflow_status": evaluation.workflow_status,
        "events": [event.model_dump() for event in evaluation.workflow_events],
    }


@router.get("/{evaluation_id}/events")
def get_workflow_events(evaluation_id: str):
    evaluation = EVALUATIONS.get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return {"items": [event.model_dump() for event in evaluation.workflow_events]}
