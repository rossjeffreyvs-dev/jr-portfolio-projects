from services.fx_insights.service import app as fx_app
from services.semantic_patient_search.service import app as semantic_app
from services.smart_thermostat.service import app as thermo_app
from services.clinical_trial_evaluator.service import app as trial_app

from asgiref.wsgi import WsgiToAsgi
from services.resume_job_analyzer.app import app as flask_resume_app

resume_app = WsgiToAsgi(flask_resume_app)

HOST_MAP = {
    # production subdomains
    "resume-analyzer.jeffrey-ross.me": resume_app,
    "fx-insights.jeffrey-ross.me": fx_app,
    "smart-thermostat.jeffrey-ross.me": thermo_app,
    "clinical-trial-evaluator.jeffrey-ross.me": trial_app,
    "semantic-patient-search": semantic_app,

    # optional lightsail domain aliases
    "jr-portfolio-projects.dtw628ha8cm94.us-west-2.cs.amazonlightsail.com": fx_app,

    # local development aliases
    "localhost": resume_app,
    "127.0.0.1": resume_app,
}


def get_app_for_host(host: str):
    normalized_host = host.split(":")[0].lower()
    return HOST_MAP.get(normalized_host)