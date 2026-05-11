from fastapi import APIRouter
from app.models.schemas import QuestionRequest
from app.services.orchestrator import ask_question
router=APIRouter()
@router.post('/questions/ask')
def ask(payload:QuestionRequest): return ask_question(payload.question)
