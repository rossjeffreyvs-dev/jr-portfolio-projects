from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import StartEvaluationRequest
from app.services.evaluation_service import start_evaluation
from app.services.store import EVALUATIONS, list_evaluations

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


@router.get("")
def list_all_evaluations(trial_id: str | None = Query(default=None)):
    items = list_evaluations(trial_id=trial_id)
    return {"items": [evaluation.model_dump() for evaluation in items]}


@router.post("/start")
def create_evaluation(payload: StartEvaluationRequest):
    evaluation = start_evaluation(payload)
    return evaluation.model_dump()


@router.get("/{evaluation_id}")
def get_evaluation(evaluation_id: str):
    evaluation = EVALUATIONS.get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluation.model_dump()


@router.get("/{evaluation_id}/results")
def get_evaluation_results(evaluation_id: str):
    evaluation = EVALUATIONS.get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    return {
        "evaluation_id": evaluation.id,
        "recommendation": evaluation.recommendation,
        "match_score": evaluation.match_score,
        "confidence": evaluation.confidence,
        "blockers": evaluation.blockers,
        "missing_information": evaluation.missing_information,
        "explanation": evaluation.explanation,
        "criterion_results": [
            item.model_dump() for item in evaluation.criterion_results
        ],
    }