# JR Portfolio Projects

A multi-project AI application platform that powers a portfolio of interactive demos, including clinical trial eligibility, semantic patient search, résumé matching, FX insights, and other agentic workflow experiments.

This repository is structured as a **shared application platform** rather than a single app. It combines a routing gateway, multiple independently developed services, and deployment tooling for AWS Lightsail so each demo can be exposed through a clean project-specific experience.

## Live Project Themes

This repo currently includes services for:

- **Agentic Clinical Trial Eligibility** — multi-step eligibility evaluation with explainable recommendations and human-in-the-loop review
- **Semantic Patient Search** — natural language search across patient and clinical-style data using meaning-based retrieval
- **AI Résumé Match** — compares résumés against role descriptions and generates structured fit analysis
- **AI FX Insights** — summarizes foreign exchange signals into concise client-ready reporting
- **Smart Thermostat** — agentic workflow demo for decisioning and automation patterns

## Why this repo exists

The goal of this repository is to showcase how AI products can be designed as **modular, deployable systems** rather than isolated prototypes.

Instead of treating each demo as a one-off app, this codebase explores a reusable pattern:

- a shared **gateway layer** for routing and orchestration
- individual **services** for each use case
- reproducible **containerized deployment**
- support for **subdomain-based project hosting**
- a structure that can scale from one demo to many

This makes the repository useful as both:
1. a portfolio of applied AI products, and
2. a reference architecture for multi-app deployment.

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