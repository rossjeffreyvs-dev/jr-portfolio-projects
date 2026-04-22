from services.resume_job_analyzer.app import app as flask_resume_app
from services.fx_insights.service import app as fx_app
from services.semantic_patient_search.service import app as semantic_app
from services.clinical_trial_matching_agent.apps import app as trial_app
from asgiref.wsgi import WsgiToAsgi

resume_app = WsgiToAsgi(flask_resume_app)

HOST_MAP = {
    # production subdomains
    "resume-analyzer.jeffrey-ross.me": resume_app,
    "fx-insights.jeffrey-ross.me": fx_app,
    "semantic-patient-search.jeffrey-ross.me": semantic_app,
    "clinical-trial-patient-agent.jeffrey-ross.me": trial_app,
    # "smart-thermostat.jeffrey-ross.me": thermo_app,

    # optional lightsail domain aliases
    # "jr-portfolio-projects.dtw628ha8cm94.us-west-2.cs.amazonlightsail.com": fx_app,

    # local development aliases
    "localhost": resume_app,
    "127.0.0.1": resume_app,
}


def get_app_for_host(host: str):
    normalized_host = host.split(":")[0].lower()
    return HOST_MAP.get(normalized_host)