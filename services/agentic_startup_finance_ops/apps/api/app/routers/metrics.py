from fastapi import APIRouter
from app.services.orchestrator import get_metrics
router=APIRouter()
@router.get('/metrics')
def metrics(): return get_metrics()
