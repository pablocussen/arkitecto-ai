FROM python:3.11-slim

WORKDIR /app

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY main.py .
COPY apu_catalog.py .
COPY auth_middleware.py .
COPY firebase_service.py .
COPY schemas.py .
COPY pdf_generator.py .
COPY security.py .

# Exponer puerto
EXPOSE 8000

# Cloud Run usa variable PORT
ENV PORT=8080

# Comando de inicio
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
