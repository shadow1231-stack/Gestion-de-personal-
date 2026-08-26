"""Punto de entrada de la API FastAPI.

Ensambla middlewares de seguridad (CORS, rate limiting), observabilidad
(Sentry, logging estructurado) y handlers de errores (§3, §5, §7).
"""

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.rate_limit import limiter

settings = get_settings()
configure_logging()
logger = get_logger(__name__)

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        traces_sample_rate=0.1,
        # No enviar datos personales (cabeceras, cookies, cuerpo) a Sentry (§3).
        send_default_pii=False,
    )

app = FastAPI(title="Gestor de Reportes API", version="0.1.0")

# Rate limiting por IP (§5)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(_: object, __: RateLimitExceeded) -> object:
    from fastapi.responses import JSONResponse

    return JSONResponse(
        status_code=429,
        content={"success": False, "data": None, "message": "Demasiadas peticiones"},
    )


# CORS restrictivo al dominio oficial (§5)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

register_exception_handlers(app)
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Sonda de salud para orquestadores y balanceadores."""
    return {"status": "ok"}
