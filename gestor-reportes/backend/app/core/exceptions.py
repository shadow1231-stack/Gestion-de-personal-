"""Excepciones de dominio y handlers globales (§3 manejo de errores).

Nunca se exponen detalles internos del servidor al cliente final.
"""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class DomainError(Exception):
    """Error de negocio esperado, seguro de mostrar al cliente."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(DomainError):
    def __init__(self, message: str = "Recurso no encontrado") -> None:
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class UnauthorizedError(DomainError):
    def __init__(self, message: str = "Credenciales inválidas") -> None:
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


def _envelope(success: bool, message: str) -> dict[str, object]:
    """Respuesta JSON uniforme (§5): {success, data, message}."""
    return {"success": success, "data": None, "message": message}


def register_exception_handlers(app: FastAPI) -> None:
    """Registra handlers que garantizan respuestas seguras y uniformes."""

    @app.exception_handler(DomainError)
    async def _domain_handler(_: Request, exc: DomainError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content=_envelope(False, exc.message))

    @app.exception_handler(RequestValidationError)
    async def _validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        # Envoltura uniforme para errores de validación (§5), sin filtrar internals.
        first = exc.errors()[0] if exc.errors() else {}
        field = ".".join(str(p) for p in first.get("loc", []) if p != "body")
        detail = first.get("msg", "Datos inválidos")
        message = f"{field}: {detail}" if field else detail
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_envelope(False, message),
        )

    @app.exception_handler(Exception)
    async def _unhandled_handler(_: Request, exc: Exception) -> JSONResponse:
        # Se registra el detalle real, pero al cliente solo un mensaje genérico.
        logger.error("unhandled_exception", error=str(exc), error_type=type(exc).__name__)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_envelope(False, "Error interno del servidor"),
        )
