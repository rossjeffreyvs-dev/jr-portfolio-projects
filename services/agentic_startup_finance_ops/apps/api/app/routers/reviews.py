from fastapi import APIRouter
from app.models.schemas import ReviewFeedbackRequest
from app.services.orchestrator import add_feedback, get_all_reviews, learning_signals
router=APIRouter()
@router.get('/reviews')
def reviews(): return {'reviews':get_all_reviews()}
@router.post('/reviews/{review_id}/feedback')
def feedback(review_id:str,payload:ReviewFeedbackRequest): return add_feedback(review_id,payload.model_dump() if hasattr(payload,'model_dump') else payload.dict())
@router.get('/learning/signals')
def signals(): return learning_signals()
