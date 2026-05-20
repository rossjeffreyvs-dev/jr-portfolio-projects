# AI Platform and Workflow Systems Portfolio

Applied AI platforms and operational workflow systems spanning healthcare, finance, semantic retrieval, and enterprise SaaS workflows.

This repository powers a portfolio of interactive AI applications focused on workflow orchestration, explainable decision systems, semantic interfaces, and technical product execution.

Rather than isolated prototypes, the projects in this repository are designed as modular, deployable systems that combine:

- AI-assisted workflow orchestration
- semantic retrieval and search
- streaming operational interfaces
- human-in-the-loop review patterns
- reusable deployment infrastructure
- full-stack product architecture

The repository functions as both:

1. a portfolio of applied AI product systems
2. a shared platform architecture for multi-service deployment

---

## Featured Systems

### Agentic Clinical Trial Eligibility

Multi-step clinical eligibility evaluation workflow with explainable recommendations, patient review flows, and human-in-the-loop decision support.

Capabilities include:

- structured workflow orchestration
- explainable recommendation generation
- clinical-style review pipelines
- streaming workflow activity
- operational audit visibility

---

### Semantic Patient Search

Natural-language semantic retrieval system for patient and clinical-style data exploration.

Features include:

- meaning-based search
- semantic ranking
- structured clinical-style filtering
- vector-style retrieval workflows
- operational search interfaces

---

### AI Résumé Match

AI-assisted résumé and role evaluation workflow that compares candidate profiles against job requirements and generates structured fit analysis.

Includes:

- semantic job matching
- structured scoring
- recommendation generation
- workflow-oriented UI patterns

---

### AI FX Insights

AI-generated FX reporting workflow that transforms market signals into concise client-facing summaries.

Features include:

- streaming AI responses
- financial signal summarization
- operational reporting flows
- real-time interface patterns

---

### Agentic Startup Finance and Operations

Operational AI workflow platform for startup finance, revenue analysis, and scenario-driven recommendations.

Includes:

- agent workflow orchestration
- operational analytics
- adaptive recommendation flows
- Stripe-oriented operational modeling
- streaming tool activity interfaces

---

## Why this Repository Exists

This repository explores how AI-native products can be designed as operational systems rather than isolated demos.

The architecture emphasizes:

- modular service boundaries
- reusable orchestration patterns
- scalable deployment workflows
- shared routing infrastructure
- product-oriented interaction design
- explainable workflow visibility

The goal is to demonstrate how applied AI systems can integrate product strategy, workflow orchestration, and hands-on engineering execution.

---

## Platform Architecture

At a high level, the platform works as follows:

1. A shared gateway receives requests for project-specific routes or subdomains
2. Traffic is routed to independently deployed services
3. Each service manages its own workflow logic, APIs, and UI behavior
4. Shared deployment tooling packages the platform into containerized workloads
5. AWS Lightsail deployment templates expose projects through a unified portfolio layer

This structure allows multiple AI applications to operate within a shared operational platform while maintaining project-level isolation.

---

## Repository Structure

```text
.
├── gateway/                    # shared routing and orchestration layer
├── services/
│   ├── clinical_trial_matching_agent/
│   ├── semantic_patient_search/
│   ├── resume_job_analyzer/
│   ├── fx_insights/
│   ├── agentic_startup_finance_ops/
│   └── additional workflow experiments
├── scripts/                    # deployment and build automation
├── Dockerfile                  # multi-service container build
├── Makefile                    # build and deployment helpers
├── requirements.txt
└── lightsail.json.template
```

---

## Technology Stack

Core technologies used across the platform include:

- Python
- FastAPI / Starlette
- Flask
- React / Next.js / Vite
- OpenAI APIs
- HTTPX
- Docker
- AWS Lightsail
- Uvicorn / Gunicorn

Platform capabilities include:

- streaming interfaces
- semantic retrieval workflows
- document processing
- operational orchestration patterns
- containerized multi-service deployment

---

## Local Development

### Prerequisites

- Python 3.10+
- Docker
- AWS CLI
- environment variables for AI-enabled services

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Useful Commands

```bash
make help
make build
make generate-lightsail-json
make deploy
```

---

## Deployment

The platform is designed for containerized deployment on AWS Lightsail.

Deployment workflows include:

- container image builds
- Lightsail image publishing
- automated deployment template generation
- environment variable injection
- subdomain and path-based routing

---

## Platform Focus

This repository is an active applied AI portfolio workspace.

Projects evolve continuously as workflows, orchestration patterns, and operational interfaces are refined.

Primary focus areas include:

- AI workflow orchestration
- operational AI systems
- semantic retrieval interfaces
- enterprise data workflows
- technical product systems
- explainable AI interaction patterns

---

## Related Repository

Portfolio website:

https://github.com/rossjeffreyvs-dev/ross-jeffrey-projects-site

---

## Author

**Jeff Ross**  
Technical product leader focused on AI platforms, workflow systems, enterprise data architecture, and applied operational AI.
