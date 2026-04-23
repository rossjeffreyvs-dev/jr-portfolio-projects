# JR Portfolio Projects

A multi-project AI application platform that powers a portfolio of interactive demos, including clinical trial eligibility, semantic patient search, résumé matching, FX insights, and other agentic workflow experiments.

This repository is structured as a **shared application platform** rather than a single app. It combines a routing gateway, multiple independently developed services, and deployment tooling for AWS Lightsail so each demo can be exposed through a clean project-specific experience.

---

## Live Project Themes

This repo currently includes services for:

- **Agentic Clinical Trial Eligibility** — multi-step eligibility evaluation with explainable recommendations and human-in-the-loop review
- **Semantic Patient Search** — natural language search across patient and clinical-style data using meaning-based retrieval
- **AI Résumé Match** — compares résumés against role descriptions and generates structured fit analysis
- **AI FX Insights** — summarizes foreign exchange signals into concise client-ready reporting
- **Smart Thermostat** — agentic workflow demo for decisioning and automation patterns

---

## Why this repo exists

The goal of this repository is to showcase how AI products can be designed as **modular, deployable systems** rather than isolated prototypes.

Instead of treating each demo as a one-off app, this codebase explores a reusable pattern:

- a shared **gateway layer** for routing and orchestration
- individual **services** for each use case
- reproducible **containerized deployment**
- support for **subdomain-based project hosting**
- a structure that can scale from one demo to many

This makes the repository useful as both:

1. a portfolio of applied AI products
2. a reference architecture for multi-app deployment

---

## Repository structure

```text
.
├── gateway/                    # shared gateway / routing layer
├── services/
│   ├── clinical_trial_matching_agent/
│   ├── fx_insights/
│   ├── resume_job_analyzer/
│   ├── semantic_patient_search/
│   └── smart_thermostat/
├── scripts/                    # build and deployment automation
├── Dockerfile                  # container build
├── Makefile                    # build / deploy helpers
├── requirements.txt            # Python dependencies
└── lightsail.json.template     # AWS Lightsail deployment template
```

---

## Architecture

At a high level, the platform works like this:

1. A gateway receives requests for project-specific routes or subdomains
2. Traffic is routed to the appropriate service
3. Each service implements its own product logic, UI, and API behavior
4. The full platform is packaged and deployed as a containerized workload
5. Deployment metadata is generated for AWS Lightsail

This pattern supports a cleaner portfolio experience and reduces duplicated deployment setup across demos.

---

## Technology stack

Core technologies used across this repository include:

- Python
- FastAPI / Starlette
- Flask
- HTTPX
- OpenAI API
- Gunicorn / Uvicorn
- Docker
- AWS Lightsail

Some services also work with uploaded documents and structured text processing.

---

## Local development

### Prerequisites

- Python 3.10+
- Docker
- AWS CLI (for deployment workflows)
- Environment variables for the services you want to run

### Install dependencies

```bash
pip install -r requirements.txt
```

### Useful commands

```bash
make help
make build
make generate-lightsail-json
make deploy
```

---

## Deployment

This repository is designed for container deployment to **AWS Lightsail**.

The deployment flow includes:

- building a Linux container image
- pushing the image to Lightsail
- generating `lightsail.json`
- deploying a public gateway container
- injecting environment variables for service integrations

---

## Notes

This repo is an active portfolio workspace, so some services evolve quickly as demos are improved, restructured, or prepared for public presentation.

The focus is on showcasing:

- applied AI product design
- modular architecture
- explainable workflows
- real deployment patterns

---

## Related repositories

- Portfolio site: https://github.com/rossjeffreyvs-dev/ross-jeffrey-projects-site

---

## Author

**Jeff Ross**  
Product and technology leader focused on AI applications, enterprise data platforms, workflow automation, and applied system design.
