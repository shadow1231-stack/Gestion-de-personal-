FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Ejecutar como usuario no-root (§7 contenedores aislados)
RUN useradd --create-home --uid 1000 appuser

COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install .

COPY . .

USER appuser
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
