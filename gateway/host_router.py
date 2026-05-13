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


TRAINJAZZ_FRONTEND_URL = "http://127.0.0.1:3004"

TRAINJAZZ_PUBLIC_PREFIX = "/train-jazz"
TRAINJAZZ_LEGACY_PUBLIC_PREFIX = "/services/train-jazz"


STARTUP_FINANCE_FRONTEND_URL = "http://127.0.0.1:3005"
STARTUP_FINANCE_API_URL = "http://127.0.0.1:8030"

STARTUP_FINANCE_PUBLIC_PREFIX = "/agentic-startup-finance-ops"
STARTUP_FINANCE_API_PREFIX = f"{STARTUP_FINANCE_PUBLIC_PREFIX}/api"

STARTUP_FINANCE_HOSTS = {
    "agentic-startup-finance-ops.jeffrey-ross.me",
    "startup-finance.local",
    "startup-finance-ops.local",
}


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
    internal_page_path: str | None = None,
) -> str:
    if not internal_page_path:
        return path

    if path == public_prefix or path == f"{public_prefix}/":
        return internal_page_path

    suffix = path.replace(public_prefix, "", 1)

    if suffix.startswith(internal_page_path):
        return suffix

    return f"{internal_page_path}{suffix}"


def rewrite_trainjazz_path(path: str) -> str:
    if path == TRAINJAZZ_LEGACY_PUBLIC_PREFIX:
        return TRAINJAZZ_PUBLIC_PREFIX

    if path.startswith(f"{TRAINJAZZ_LEGACY_PUBLIC_PREFIX}/"):
        suffix = path.replace(TRAINJAZZ_LEGACY_PUBLIC_PREFIX, "", 1)
        return f"{TRAINJAZZ_PUBLIC_PREFIX}{suffix}"

    return path


def route_clinical(path: str):
    if path.startswith(CLINICAL_API_PREFIXES):
        return proxy_target(CLINICAL_API_URL, path)

    return proxy_target(CLINICAL_FRONTEND_URL, path)


def route_customer_lifecycle(path: str):
    if path.startswith(CUSTOMER_API_PREFIX):
        return proxy_target(
            CUSTOMER_API_URL,
            rewrite_prefixed_api_path(path, CUSTOMER_API_PREFIX),
        )

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

    return proxy_target(CLAUDE_FRONTEND_URL, path)


def route_trainjazz(path: str):
    if path == TRAINJAZZ_PUBLIC_PREFIX or path.startswith(f"{TRAINJAZZ_PUBLIC_PREFIX}/"):
        return proxy_target(TRAINJAZZ_FRONTEND_URL, rewrite_trainjazz_path(path))

    if path == TRAINJAZZ_LEGACY_PUBLIC_PREFIX or path.startswith(
        f"{TRAINJAZZ_LEGACY_PUBLIC_PREFIX}/"
    ):
        return proxy_target(TRAINJAZZ_FRONTEND_URL, rewrite_trainjazz_path(path))

    return None


def route_startup_finance(path: str):
    if path.startswith(STARTUP_FINANCE_API_PREFIX):
        return proxy_target(
            STARTUP_FINANCE_API_URL,
            rewrite_prefixed_api_path(path, STARTUP_FINANCE_API_PREFIX),
        )

    if path == STARTUP_FINANCE_PUBLIC_PREFIX or path.startswith(
        f"{STARTUP_FINANCE_PUBLIC_PREFIX}/"
    ):
        return proxy_target(STARTUP_FINANCE_FRONTEND_URL, path)

    return None


def get_app_for_request(host: str, path: str):
    normalized_host = normalize_host(host)

    # Host-specific Next.js assets.
    # Important: do not let one app globally capture /_next/* for all projects.
    if is_next_static_asset(path):
        if normalized_host in CLINICAL_HOSTS:
            return proxy_target(CLINICAL_FRONTEND_URL, path)

        if normalized_host in STARTUP_FINANCE_HOSTS:
            return proxy_target(STARTUP_FINANCE_FRONTEND_URL, path)

        if normalized_host in CLAUDE_HOSTS:
            return proxy_target(CLAUDE_FRONTEND_URL, path)

        # Default public Lightsail /_next assets currently belong to path-based apps.
        # Customer lifecycle is the main affected path-based project.
        return proxy_target(CUSTOMER_FRONTEND_URL, path)

    trainjazz_target = route_trainjazz(path)
    if trainjazz_target:
        return trainjazz_target

    startup_finance_target = route_startup_finance(path)
    if startup_finance_target:
        return startup_finance_target

    if normalized_host in STARTUP_FINANCE_HOSTS:
        return route_startup_finance(path) or proxy_target(
            STARTUP_FINANCE_FRONTEND_URL,
            path,
        )

    if normalized_host in CLINICAL_HOSTS:
        return route_clinical(path)

    if normalized_host in HOST_MAP:
        return HOST_MAP[normalized_host]

    if normalized_host in CLAUDE_HOSTS:
        return route_claude(path)

    customer_target = route_customer_lifecycle(path)
    if customer_target:
        return customer_target

    claude_target = route_claude(path)
    if claude_target and (
        path == CLAUDE_PUBLIC_PREFIX
        or path.startswith(f"{CLAUDE_PUBLIC_PREFIX}/")
    ):
        return claude_target

    if normalized_host in RESUME_HOSTS:
        if path.startswith(RESUME_API_PREFIXES):
            return resume_api_app
        return RESUME_FRONTEND_URL

    return RESUME_FRONTEND_URL


def get_app_for_host(host: str):
    return get_app_for_request(host, "/")