from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    score: int = Field(default=0, ge=0, le=100)
    summary: str = "No summary returned."
    matches: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    demo_mode: bool = False
    job_desc: str | None = None


class ErrorResponse(BaseModel):
    error: str
