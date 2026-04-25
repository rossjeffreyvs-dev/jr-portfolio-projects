from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, HTTPException

from data import build_revenue_lifecycle, ingest_prospect, update_review

router = APIRouter(prefix="/lifecycle", tags=["lifecycle"])


@router.get("")
def get_lifecycle_summary():
    return build_revenue_lifecycle()


@router.post("/ingest")
def ingest_mock_prospect():
    return ingest_prospect()


@router.post("/reviews/{review_id}/{action}")
def review_action(review_id: str, action: Literal["approve", "reject", "request_data"]):
    result = update_review(review_id, action)

    if not result:
        raise HTTPException(status_code=404, detail="Review not found")

    return result