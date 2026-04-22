from fastapi import APIRouter, HTTPException

from app.models.schemas import ReviewDecisionRequest
from app.services.store import EVALUATIONS, REVIEWS

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("")
def list_reviews():
    return {"items": [review.model_dump() for review in REVIEWS.values()]}


@router.post("/{review_id}/decision")
def submit_review_decision(review_id: str, payload: ReviewDecisionRequest):
    review = REVIEWS.get(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review task not found")

    updated_review = review.model_copy(
        update={
            "review_status": "Resolved",
            "reviewer_decision": payload.decision,
            "reviewer_note": payload.note,
        }
    )
    REVIEWS[review_id] = updated_review

    evaluation = EVALUATIONS.get(review.evaluation_id)
    if evaluation:
        EVALUATIONS[evaluation.id] = evaluation.model_copy(
            update={
                "reviewer_action": payload.decision,
                "workflow_status": "Completed",
            }
        )

    return {
        "message": "Review decision recorded",
        "review": updated_review.model_dump(),
    }
