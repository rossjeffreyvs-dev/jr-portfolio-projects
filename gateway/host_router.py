from asgiref.wsgi import WsgiToAsgi

from services.resume_job_analyzer.app import app as flask_resume_app
from services.fx_insights.service import app as fx_app
from services.semantic_patient_search.service import app as semantic_app


# Keep Flask resume app available as backend/API fallback.
resume_api_app = WsgiToAsgi(flask_resume_app)


# Resume Analyzer
RESUME_FRONTEND_URL = "http://127.0.0.1:3002"

RESUME_HOSTS = {
    "resume-analyzer.jeffrey-ross.me",
    "resume.local",
    "localhost",
    "127.0.0.1",
}

RESUME_API_PREFIXES = (
    "/api/analyze",
    "/api/demo",
    "/analyze",
    "/demo",
    "/api/resume",
    "/api/resume-analyzer",
)


# Clinical Trial Matching Agent
CLINICAL_FRONTEND_URL = "http://127.0.0.1:3000"
CLINICAL_API_URL = "http://127.0.0.1:8000"

CLINICAL_HOSTS = {
    "clinical-trial-patient-agent.jeffrey-ross.me",
    "clinical-trial.local",
}

CLINICAL_API_PREFIXES = (
    "/trials",
    "/patients",
    "/evaluations",
    "/workflow",
    "/reviews",
)


# Customer Lifecycle Agent
CUSTOMER_FRONTEND_URL = "http://127.0.0.1:3001"
CUSTOMER_API_URL = "http://127.0.0.1:8010"

CUSTOMER_PATH_PREFIX = "/customer-lifecycle-agent"
CUSTOMER_API_PATH_PREFIX = "/customer-lifecycle-agent/api"


HOST_MAP = {
    # Production subdomains
    "fx-insights.jeffrey-ross.me": fx_app,
    "semantic-patient-search.jeffrey-ross.me": semantic_app,

    # Local development aliases
    "fx.local": fx_app,
    "semantic.local": semantic_app,
}


def normalize_host(host: str) -> str:
    return host.split(":")[0].lower()


def get_app_for_request(host: str, path: str):
    """
    Route requests by host and path.

    Returns either:
    - an ASGI app, for in-process services
    - a URL string, for proxied frontend/backend services
    """
    normalized_host = normalize_host(host)

    # Resume Analyzer subdomain/local-host routing.
    #
    # Frontend:
    #   http://127.0.0.1:3002
    #
    # Backend/API fallback:
    #   in-process Flask app
    if normalized_host in RESUME_HOSTS:
        if path.startswith(RESUME_API_PREFIXES):
            return resume_api_app
        return RESUME_FRONTEND_URL

    # Customer Lifecycle path-based routing.
    if path.startswith(CUSTOMER_API_PATH_PREFIX):
        return CUSTOMER_API_URL

    if path == CUSTOMER_PATH_PREFIX or path.startswith(f"{CUSTOMER_PATH_PREFIX}/"):
        return CUSTOMER_FRONTEND_URL

    # Clinical Trial subdomain/local-host routing.
    if normalized_host in CLINICAL_HOSTS:
        if path.startswith(CLINICAL_API_PREFIXES):
            return CLINICAL_API_URL
        return CLINICAL_FRONTEND_URL

    # Existing simple host-based services.
    return HOST_MAP.get(normalized_host, RESUME_FRONTEND_URL)


def get_app_for_host(host: str):
    """
    Backward-compatible helper.

    For path-sensitive traffic, gateway.main should call:
      get_app_for_request(host, path)
    """
    return get_app_for_request(host, "/")