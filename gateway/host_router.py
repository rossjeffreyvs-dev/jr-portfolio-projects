from asgiref.wsgi import WsgiToAsgi

from services.resume_job_analyzer.app import app as flask_resume_app
from services.fx_insights.service import app as fx_app
from services.semantic_patient_search.service import app as semantic_app


resume_api_app = WsgiToAsgi(flask_resume_app)


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


CUSTOMER_FRONTEND_URL = "http://127.0.0.1:3001"
CUSTOMER_API_URL = "http://127.0.0.1:8010"

CUSTOMER_PUBLIC_PREFIX = "/agentic-customer-lifecycle-platform"
CUSTOMER_INTERNAL_PAGE_PATH = "/projects/customer-lifecycle-agent"
CUSTOMER_API_PREFIX = f"{CUSTOMER_PUBLIC_PREFIX}/api"


CLAUDE_FRONTEND_URL = "http://127.0.0.1:3003"
CLAUDE_API_URL = "http://127.0.0.1:8020"

CLAUDE_PUBLIC_PREFIX = "/claude-clinical-protocol-reasoning-engine"
CLAUDE_API_PREFIX = f"{CLAUDE_PUBLIC_PREFIX}/api"

CLAUDE_HOSTS = {
    "claude-clinical-protocol-reasoning-engine.jeffrey-ross.me",
    "claude-clinical.local",
    "claude-protocol.local",
}

CLAUDE_API_PREFIXES = (
    "/health",
    "/dashboard",
    "/trials",
    "/patients",
    "/evaluations",
    "/evaluate",
    "/workflow",
    "/reviews",
)


HOST_MAP = {
    "fx-insights.jeffrey-ross.me": fx_app,
    "semantic-patient-search.jeffrey-ross.me": semantic_app,
    "fx.local": fx_app,
    "semantic.local": semantic_app,
}


def normalize_host(host: str) -> str:
    return host.split(":")[0].lower()


def proxy_target(url: str, path: str) -> dict[str, str]:
    return {"url": url, "path": path}


def is_next_static_asset(path: str) -> bool:
    return (
        path.startswith("/_next/")
        or path.startswith("/favicon")
        or path.startswith("/robots.txt")
        or path.startswith("/sitemap.xml")
        or path.startswith("/manifest")
        or path.startswith("/apple-touch-icon")
    )


def rewrite_prefixed_api_path(path: str, public_api_prefix: str) -> str:
    rewritten = path.replace(public_api_prefix, "", 1)
    return rewritten or "/"


def rewrite_prefixed_next_page_path(
    path: str,
    public_prefix: str,
    internal_page_path: str,
) -> str:
    if path == public_prefix or path == f"{public_prefix}/":
        return internal_page_path

    suffix = path.replace(public_prefix, "", 1)

    if suffix.startswith(internal_page_path):
        return suffix

    return f"{internal_page_path}{suffix}"


def route_customer_lifecycle(path: str):
    if path.startswith(CUSTOMER_API_PREFIX):
        return proxy_target(
            CUSTOMER_API_URL,
            rewrite_prefixed_api_path(path, CUSTOMER_API_PREFIX),
        )

    if is_next_static_asset(path):
        return proxy_target(CUSTOMER_FRONTEND_URL, path)

    if path == CUSTOMER_PUBLIC_PREFIX or path.startswith(f"{CUSTOMER_PUBLIC_PREFIX}/"):
        return proxy_target(
            CUSTOMER_FRONTEND_URL,
            rewrite_prefixed_next_page_path(
                path,
                CUSTOMER_PUBLIC_PREFIX,
                CUSTOMER_INTERNAL_PAGE_PATH,
            ),
        )

    return None


def route_claude(path: str):
    if path.startswith(CLAUDE_API_PREFIX):
        return proxy_target(
            CLAUDE_API_URL,
            rewrite_prefixed_api_path(path, CLAUDE_API_PREFIX),
        )

    if path == CLAUDE_PUBLIC_PREFIX or path.startswith(f"{CLAUDE_PUBLIC_PREFIX}/"):
        return proxy_target(CLAUDE_FRONTEND_URL, path)

    if path.startswith("/api"):
        return proxy_target(
            CLAUDE_API_URL,
            path.replace("/api", "", 1) or "/",
        )

    if path.startswith(CLAUDE_API_PREFIXES):
        return proxy_target(CLAUDE_API_URL, path)

    if is_next_static_asset(path):
        return proxy_target(CLAUDE_FRONTEND_URL, path)

    return proxy_target(CLAUDE_FRONTEND_URL, path)


def get_app_for_request(host: str, path: str):
    normalized_host = normalize_host(host)

    customer_target = route_customer_lifecycle(path)
    if customer_target:
        return customer_target

    claude_target = route_claude(path)
    if claude_target and (
        path == CLAUDE_PUBLIC_PREFIX
        or path.startswith(f"{CLAUDE_PUBLIC_PREFIX}/")
        or normalized_host in CLAUDE_HOSTS
    ):
        return claude_target

    if normalized_host in RESUME_HOSTS:
        if path.startswith(RESUME_API_PREFIXES):
            return resume_api_app
        return RESUME_FRONTEND_URL

    if normalized_host in CLINICAL_HOSTS:
        if path.startswith(CLINICAL_API_PREFIXES):
            return CLINICAL_API_URL
        return CLINICAL_FRONTEND_URL

    return HOST_MAP.get(normalized_host, RESUME_FRONTEND_URL)


def get_app_for_host(host: str):
    return get_app_for_request(host, "/")