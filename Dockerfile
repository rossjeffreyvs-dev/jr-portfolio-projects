# ---------- Build FX Insights frontend ----------
FROM node:20-alpine AS fx_frontend_builder

WORKDIR /build/services/fx_insights/frontend

COPY services/fx_insights/frontend/package*.json ./
RUN npm install

COPY services/fx_insights/frontend/ ./
RUN npm run build


# ---------- Build Semantic Patient Search frontend ----------
FROM node:20-alpine AS semantic_frontend_builder

WORKDIR /build/services/semantic_patient_search/frontend

COPY services/semantic_patient_search/frontend/package*.json ./
RUN npm install

COPY services/semantic_patient_search/frontend/ ./
RUN npm run build


# ---------- Python runtime ----------
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
ENV PYTHONPATH=/app

WORKDIR /app

# Minimal OS packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install root gateway/runtime deps first for layer caching
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install service-specific backend deps
COPY services/fx_insights/backend/requirements.txt ./fx_requirements.txt
COPY services/semantic_patient_search/backend/requirements.txt ./semantic_requirements.txt

RUN pip install --no-cache-dir -r fx_requirements.txt && \
    pip install --no-cache-dir -r semantic_requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copy app source
COPY gateway ./gateway
COPY services ./services

# Copy built FX frontend into FX backend static folder
COPY --from=fx_frontend_builder \
    /build/services/fx_insights/frontend/dist \
    ./services/fx_insights/backend/static

# Copy built Semantic frontend into Semantic backend static folder
COPY --from=semantic_frontend_builder \
    /build/services/semantic_patient_search/frontend/dist \
    ./services/semantic_patient_search/backend/static

EXPOSE 8080

# Run the gateway
CMD ["uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "8080"]