# ---------- Frontend build ----------
FROM node:20-alpine AS frontend_build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---------- Backend runtime ----------
FROM python:3.11-slim AS backend_runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend deps
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt \
 && pip install --no-cache-dir gunicorn

# Copy backend code
COPY backend/ ./backend

# Copy built frontend assets into backend static directory
# (We’ll serve them from Flask)
RUN mkdir -p ./backend/static
COPY --from=frontend_build /app/frontend/dist/ ./backend/static/

# Expose container port
EXPOSE 5001

# Run via gunicorn (threaded helps SSE; keep workers=1 for simplest streaming)
CMD ["gunicorn", "-w", "1", "--threads", "8", "-b", "0.0.0.0:5001", "backend.local_server:app"]
