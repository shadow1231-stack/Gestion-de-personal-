# Gestor de Reportes Personal y Vehicular

Aplicación para gestionar reportes personales y vehiculares.
El desarrollo se rige de forma **obligatoria** por las directrices de
[`../AGENTS.md`](../AGENTS.md) (arquitectura, seguridad, BD, frontend, pruebas y DevOps).

## Stack

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL (migraciones con Alembic)
- **Frontend:** React + Vite + TypeScript (estricto)
- **Infra:** Docker / docker-compose

## Arquitectura por capas (§1)

```
api/  ->  services/  ->  repositories/ + db/
(UI)      (negocio)      (acceso a datos)
```

Cada capa depende solo de la inferior. Los modelos ORM viven en `models/`,
la validación de I/O en `schemas/` (Pydantic).

## Puesta en marcha

```bash
cp .env.example .env        # rellena los secretos reales
docker compose up --build
```

- API:      http://localhost:8000/api/v1
- Docs:     http://localhost:8000/docs
- Frontend: http://localhost:5173

## Desarrollo local (backend)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

## Calidad y pruebas (§2, §6)

```bash
# Backend
ruff check . && ruff format --check . && mypy app && pytest

# Frontend
cd frontend && npm run lint && npm run test
```

Toda función/componente nuevo requiere su prueba unitaria cubriendo
flujos correctos **y** de error.
