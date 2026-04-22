from fastapi import APIRouter, HTTPException, Query, status

from ...models.schemas import StartEvaluationRequest
from ...services.evaluation_service import start_evaluation
from ...services.store import (
    EVALUATIONS,
    REVIEWS,
    list_evaluations,
    reset_demo_state,
)

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


@router.get("")
def list_all_evaluations(trial_id: str | None = Query(default=None)):
    items = list_evaluations(trial_id=trial_id)
    return {"items": [evaluation.model_dump() for evaluation in items]}


@router.post("/start")
def create_evaluation(payload: StartEvaluationRequest):
    evaluation = start_evaluation(payload)
    return evaluation.model_dump()


@router.post("/reset")
def reset_evaluations_demo_data():
    return reset_demo_state()


@router.delete("/{evaluation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evaluation(evaluation_id: str):
    evaluation = EVALUATIONS.get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    review_ids_to_delete = [
        review_id
        for review_id, review in REVIEWS.items()
        if review.evaluation_id == evaluation_id
    ]

    for review_id in review_ids_to_delete:
        del REVIEWS[review_id]

    del EVALUATIONS[evaluation_id]
    return None


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
        "review_required": evaluation.review_required,
        "review_reason": evaluation.review_reason,
        "matched_inclusion": evaluation.matched_inclusion,
        "exclusion_hits": evaluation.exclusion_hits,
        "explanation": evaluation.explanation,
        "criterion_results": [
            item.model_dump() for item in evaluation.criterion_results
        ],
    }