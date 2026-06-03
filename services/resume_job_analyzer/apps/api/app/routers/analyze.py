from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.models.schemas import AnalysisResult
from app.services.document_parser import extract_text_from_path, extract_text_from_upload
from app.services.matcher import generate_match_analysis

router = APIRouter(prefix="/api", tags=["analysis"])

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
SAMPLE_JOB_DESC_PATH = DATA_DIR / "test-job-description.docx"
SAMPLE_RESUME_PATH = DATA_DIR / "test-resume.docx"


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    job_desc: str = Form(...),
    resume_file: UploadFile = File(...),
) -> AnalysisResult:
    clean_job_desc = job_desc.strip()
    if not clean_job_desc:
        raise HTTPException(status_code=400, detail="Please provide a job description.")

    try:
        resume_text = await extract_text_from_upload(resume_file)
        result = generate_match_analysis(clean_job_desc, resume_text)
        result.demo_mode = False
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/demo", response_model=AnalysisResult)
def analyze_sample() -> AnalysisResult:
    try:
        job_desc = extract_text_from_path(SAMPLE_JOB_DESC_PATH)
        resume_text = extract_text_from_path(SAMPLE_RESUME_PATH)
        result = generate_match_analysis(job_desc, resume_text)
        result.demo_mode = True
        result.job_desc = job_desc
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Demo failed: {exc}") from exc
