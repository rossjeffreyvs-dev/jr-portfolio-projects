# ---------- Build Resume Analyzer frontend ----------
FROM node:20-bookworm-slim AS resume_builder
WORKDIR /build/services/resume_job_analyzer/frontend
COPY services/resume_job_analyzer/frontend/package*.json ./
RUN npm ci
COPY services/resume_job_analyzer/frontend/ ./
RUN npm run build


# ---------- Build FX frontend ----------
FROM node:20-bookworm-slim AS fx_builder
WORKDIR /build/services/fx_insights/frontend
COPY services/fx_insights/frontend/package*.json ./
RUN npm ci
COPY services/fx_insights/frontend/ ./
RUN npm run build


# ---------- Build Semantic frontend ----------
FROM node:20-bookworm-slim AS semantic_builder
WORKDIR /build/services/semantic_patient_search/frontend
COPY services/semantic_patient_search/frontend/package*.json ./
RUN npm ci
COPY services/semantic_patient_search/frontend/ ./
RUN npm run build


# ---------- Build Clinical Next app ----------
FROM node:20-bookworm-slim AS clinical_builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /build/services/clinical_trial_matching_agent/apps/web
COPY services/clinical_trial_matching_agent/apps/web/package*.json ./
RUN npm ci
COPY services/clinical_trial_matching_agent/apps/web/ ./
RUN npm run build


# ---------- Build Customer Lifecycle Next app ----------
FROM node:20-bookworm-slim AS customer_builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_CUSTOMER_LIFECYCLE_API_BASE_URL=/agentic-customer-lifecycle-platform/api

WORKDIR /build/services/customer-lifecycle-agent/apps/web
COPY services/customer-lifecycle-agent/apps/web/package*.json ./
RUN npm ci
COPY services/customer-lifecycle-agent/apps/web/ ./
RUN npm run build


# ---------- Build Claude Clinical Protocol Reasoning Engine Next app ----------
FROM node:20-bookworm-slim AS claude_builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_CLAUDE_API_BASE_URL=/api

WORKDIR /build/services/claude-clinical-protocol-reasoning-engine/frontend
COPY services/claude-clinical-protocol-reasoning-engine/frontend/package*.json ./
RUN npm ci
COPY services/claude-clinical-protocol-reasoning-engine/frontend/ ./
RUN npm run build


# ---------- Runtime ----------
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install Node.js runtime for Next standalone servers
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install root Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt \
 && pip install --no-cache-dir uvicorn gunicorn asgiref

# Install service-specific Python deps
COPY services/fx_insights/backend/requirements.txt fx.txt
COPY services/semantic_patient_search/backend/requirements.txt sem.txt
COPY services/clinical_trial_matching_agent/apps/api/requirements.txt clinical_api.txt
COPY services/claude-clinical-protocol-reasoning-engine/backend/requirements.txt claude_api.txt

RUN pip install --no-cache-dir -r fx.txt \
 && pip install --no-cache-dir -r sem.txt \
 && pip install --no-cache-dir -r clinical_api.txt \
 && pip install --no-cache-dir -r claude_api.txt

# Copy app source
COPY gateway ./gateway
COPY services ./services

# Copy built Resume Analyzer frontend
COPY --from=resume_builder /build/services/resume_job_analyzer/frontend/dist \
  ./services/resume_job_analyzer/frontend/dist

# Copy built static frontends
COPY --from=fx_builder /build/services/fx_insights/frontend/dist \
  ./services/fx_insights/backend/static

COPY --from=semantic_builder /build/services/semantic_patient_search/frontend/dist \
  ./services/semantic_patient_search/backend/static

# Copy built Claude frontend
COPY --from=claude_builder /build/services/claude-clinical-protocol-reasoning-engine/frontend/dist \
  ./services/claude-clinical-protocol-reasoning-engine/frontend/dist

# Copy Claude standalone build
COPY --from=claude_builder \
  /build/services/claude-clinical-protocol-reasoning-engine/frontend/.next/standalone \
  /app/claude-web

COPY --from=claude_builder \
  /build/services/claude-clinical-protocol-reasoning-engine/frontend/.next/static \
  /app/claude-web/.next/static

COPY --from=claude_builder \
  /build/services/claude-clinical-protocol-reasoning-engine/frontend/public \
  /app/claude-web/public
  
# Copy Customer Lifecycle standalone build
COPY --from=customer_builder \
  /build/services/customer-lifecycle-agent/apps/web/.next/standalone \
  /app/customer-web

COPY --from=customer_builder \
  /build/services/customer-lifecycle-agent/apps/web/.next/static \
  /app/customer-web/.next/static

COPY --from=customer_builder \
  /build/services/customer-lifecycle-agent/apps/web/public \
  /app/customer-web/public

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8080

CMD ["/app/docker-entrypoint.sh"]