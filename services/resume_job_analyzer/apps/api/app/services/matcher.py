import json
import os

from openai import OpenAI

from app.models.schemas import AnalysisResult


def normalize_analysis_payload(payload: dict) -> AnalysisResult:
    return AnalysisResult(
        score=int(payload.get("score", 0) or 0),
        summary=payload.get("summary") or "No summary returned.",
        matches=payload.get("matches") or [],
        gaps=payload.get("gaps") or [],
        recommendations=payload.get("recommendations") or [],
    )


def generate_match_analysis(job_description: str, resume_text: str) -> AnalysisResult:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return AnalysisResult(
            score=0,
            summary="OpenAI is not configured for this environment.",
            matches=[],
            gaps=[],
            recommendations=[
                "Set OPENAI_API_KEY in apps/api/.env to enable AI-generated analysis."
            ],
        )

    client = OpenAI(api_key=api_key)

    prompt = f"""
You are an expert product hiring assistant.

Compare the following job description and resume.

Return ONLY valid JSON. Do not include markdown, code fences, explanations, or text outside the JSON.

Use this exact JSON shape:
{{
  "score": 0,
  "summary": "A concise 2-3 sentence overview of candidate fit.",
  "matches": [
    "Specific strength or matching requirement."
  ],
  "gaps": [
    "Specific missing or weaker requirement."
  ],
  "recommendations": [
    "Specific resume or positioning improvement."
  ]
}}

Scoring guidance:
- 90-100: exceptional match
- 75-89: strong match with minor gaps
- 60-74: partial match with meaningful gaps
- below 60: weak match

Job Description:
{job_description}

Resume:
{resume_text}
"""

    try:
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1400,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or "{}"
        return normalize_analysis_payload(json.loads(raw))
    except Exception as exc:
        return AnalysisResult(
            score=0,
            summary="Unable to generate structured analysis.",
            matches=[],
            gaps=[],
            recommendations=[f"Error generating match response: {exc}"],
        )
