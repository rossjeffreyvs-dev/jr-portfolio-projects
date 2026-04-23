from services.resume_job_analyzer.app import app as flask_resume_app
from services.fx_insights.service import app as fx_app
from services.semantic_patient_search.service import app as semantic_app
from asgiref.wsgi import WsgiToAsgi

resume_app = WsgiToAsgi(flask_resume_app)

CLINICAL_FRONTEND_URL = "http://127.0.0.1:3000"
CLINICAL_API_URL = "http://127.0.0.1:8000"

CLINICAL_API_PREFIXES = (
    "/trials",
    "/patients",
    "/evaluations",
    "/workflow",
    "/reviews",
)

HOST_MAP = {
    # production subdomains
    "resume-analyzer.jeffrey-ross.me": resume_app,
    "fx-insights.jeffrey-ross.me": fx_app,
    "semantic-patient-search.jeffrey-ross.me": semantic_app,

    # local development aliases
    "resume.local": resume_app,
    "fx.local": fx_app,
    "semantic.local": semantic_app,
}


def get_app_for_request(host: str, path: str):
    normalized_host = host.split(":")[0].lower()

    if normalized_host in {
        "clinical-trial-patient-agent.jeffrey-ross.me",
        "clinical-trial.local",
    }:
        if path.startswith(CLINICAL_API_PREFIXES):
            return CLINICAL_API_URL
        return CLINICAL_FRONTEND_URL

    return HOST_MAP.get(normalized_host, resume_app)


def get_app_for_host(host: str):
    """
    Backward-compatible helper.
    For clinical traffic, request path matters, so gateway.main should call
    get_app_for_request(host, path) instead.
    """
    return get_app_for_request(host, "/")