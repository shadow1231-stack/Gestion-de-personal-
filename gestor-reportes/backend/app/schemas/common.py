"""Envoltura de respuesta uniforme para la API (§5 AGENTS.md)."""

from pydantic import BaseModel


class ApiResponse[T](BaseModel):
    """Formato estándar: {success, data, message}."""

    success: bool = True
    data: T | None = None
    message: str = ""


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"  # noqa: S105  ("bearer" es el esquema, no un secreto)
