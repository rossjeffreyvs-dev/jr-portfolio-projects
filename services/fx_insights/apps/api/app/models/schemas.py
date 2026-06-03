from __future__ import annotations

from pydantic import BaseModel, Field


class ReportRequest(BaseModel):
    base: str = Field(default="EUR")
    rates: dict[str, float] = Field(default_factory=dict)
    headlines: list[str] = Field(default_factory=list)


class ReportResponse(BaseModel):
    timestamp: str
    base: str
    rates: dict[str, float]
    insight: str


class RatesResponse(BaseModel):
    timestamp: str
    base: str
    rates: dict[str, float]


class NewsResponse(BaseModel):
    timestamp: str
    headlines: list[str]
