"""Dependencias compartidas de la API: usuario actual vía JWT (§5)."""

from collections.abc import Callable
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.permissions import Permission
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories import user_repo

_bearer = HTTPBearer(auto_error=False)

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> User:
    """Valida el token Bearer y devuelve el usuario autenticado."""
    if credentials is None:
        raise UnauthorizedError("Token de acceso requerido")
    subject = decode_access_token(credentials.credentials)
    if subject is None:
        raise UnauthorizedError("Token inválido o expirado")
    user = user_repo.get_by_id(db, int(subject))
    if user is None or not user.is_active:
        raise UnauthorizedError("Usuario no válido")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_permission(permission: Permission) -> Callable[[User], User]:
    """Crea una dependencia que exige un permiso concreto del rol (§3, §5)."""

    def dependency(user: CurrentUser) -> User:
        if not user.has_permission(permission.value):
            raise ForbiddenError("No tienes permiso para esta acción")
        return user

    return dependency


def require_any_permission(*permissions: Permission) -> Callable[[User], User]:
    """Crea una dependencia que exige al menos uno de los permisos dados (§3, §5)."""

    def dependency(user: CurrentUser) -> User:
        if not any(user.has_permission(p.value) for p in permissions):
            raise ForbiddenError("No tienes permiso para esta acción")
        return user

    return dependency
