from fastapi import APIRouter
from data import build_revenue_lifecycle, ingest_prospect

router = APIRouter(prefix="/lifecycle", tags=["lifecycle"])

@router.get("")
def get_lifecycle():
    return build_revenue_lifecycle()

@router.post("/ingest")
def ingest():
    return ingest_prospect()