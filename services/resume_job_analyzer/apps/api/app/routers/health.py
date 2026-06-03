from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"service": "resume-job-analyzer-api", "status": "ok"}
