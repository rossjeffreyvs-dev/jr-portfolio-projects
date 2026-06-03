from __future__ import annotations

from datetime import datetime, timezone
import json
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import ReportRequest
from app.services.fx_service import (
    generate_report_payload,
    generate_report_stream,
    get_news_payload,
    get_rates_payload,
)

router = APIRouter()


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def sse(event_name: str, payload: dict) -> str:
    return f"event: {event_name}\ndata: {json.dumps(payload)}\n\n"


@router.get("/api/rates")
async def rates(base: str = "EUR", symbols: str = "USD,GBP,JPY") -> dict:
    try:
        payload = get_rates_payload(base, symbols)
        return {"timestamp": utc_timestamp(), **payload}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/api/news")
async def news(countries: str = "us,gb,jp", language: str = "en", limit: int = 5) -> dict:
    try:
        payload = get_news_payload(countries, language=language, limit=limit)
        return {"timestamp": utc_timestamp(), "headlines": payload.get("headlines", [])}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/report")
async def report(request: ReportRequest) -> dict:
    try:
        payload = generate_report_payload(request.base, request.rates, request.headlines)
        return {"timestamp": utc_timestamp(), **payload}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/api/insight")
async def insight(base: str = "EUR", symbols: str = "USD,GBP,JPY", countries: str = "us,gb,jp") -> dict:
    try:
        rates_payload = get_rates_payload(base, symbols)
        news_payload = get_news_payload(countries, language="en", limit=5)
        payload = generate_report_payload(
            base,
            rates_payload.get("rates", {}),
            news_payload.get("headlines", []),
        )
        return {"timestamp": utc_timestamp(), **payload}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/api/report/stream")
async def report_stream(
    base: str = "EUR",
    symbols: str = "USD,GBP,JPY",
    countries: str = "us,gb,jp",
) -> StreamingResponse:
    async def generate() -> AsyncGenerator[str, None]:
        insight_accum: list[str] = []
        rates: dict = {}
        headlines: list[str] = []

        try:
            yield sse("stage", {"stage": "rates", "progress": 10, "message": "Getting exchange rates..."})

            rates_payload = get_rates_payload(base, symbols)
            rates = rates_payload.get("rates", {})
            yield sse("rates", {"base": base.upper(), "rates": rates})
            yield sse("stage", {"stage": "rates", "progress": 33, "message": "Exchange rates received."})

            yield sse("stage", {"stage": "news", "progress": 40, "message": "Getting market news..."})
            news_payload = get_news_payload(countries, language="en", limit=5)
            headlines = news_payload.get("headlines", [])
            yield sse("news", {"headlines": headlines, "count": len(headlines)})
            yield sse("stage", {"stage": "news", "progress": 66, "message": "Market news received."})

            yield sse("stage", {"stage": "report", "progress": 75, "message": "Generating client report..."})
            for chunk in generate_report_stream(base, rates, headlines):
                insight_accum.append(chunk)
                yield sse("token", {"text": chunk})

            insight = "".join(insight_accum).strip()
            yield sse("stage", {"stage": "done", "progress": 100, "message": "Done."})
            yield sse(
                "done",
                {
                    "timestamp": utc_timestamp(),
                    "base": base.upper(),
                    "rates": rates,
                    "headlines": headlines,
                    "insight": insight,
                },
            )
        except Exception as exc:
            yield sse("error", {"error": str(exc)})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
