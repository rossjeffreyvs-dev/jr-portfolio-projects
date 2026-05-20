from fastapi import APIRouter
from app.services.normalizer import cdm_snapshot

router = APIRouter(prefix="/open-finance", tags=["cdm"])

@router.get("/cdm")
def get_common_data_model():
    return cdm_snapshot()
