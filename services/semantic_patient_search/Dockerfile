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

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt \
 && pip install --no-cache-dir gunicorn asgiref

COPY backend/ ./backend
RUN mkdir -p ./backend/static
COPY --from=frontend_build /app/frontend/dist/ ./backend/static/

EXPOSE 5002
CMD ["gunicorn", "-w", "1", "--threads", "8", "-b", "0.0.0.0:5002", "backend.local_server:app"]
