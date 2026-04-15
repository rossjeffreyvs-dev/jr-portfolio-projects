FROM python:3.10-slim

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose gateway port
EXPOSE 8080

# Start FastAPI gateway
CMD ["uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "8080"]