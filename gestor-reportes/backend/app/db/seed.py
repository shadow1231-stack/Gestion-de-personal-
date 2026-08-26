"""Siembra idempotente de los roles por defecto del sistema (RBAC)."""

from sqlalchemy.orm import Session

from app.core.permissions import ALL_PERMISSIONS, Permission
from app.repositories import role_repo


def _ensure(
    db: Session,
    name: str,
    description: str,
    permissions: list[str],
    *,
    is_system: bool,
    is_default: bool,
) -> None:
    if role_repo.get_by_name(db, name) is None:
        role_repo.create(
            db,
            name=name,
            description=description,
            permissions=permissions,
            is_system=is_system,
            is_default=is_default,
        )


def ensure_default_roles(db: Session) -> None:
    """Crea los roles base si no existen. Seguro de ejecutar varias veces."""
    _ensure(
        db,
        "admin",
        "Acceso total al sistema",
        ALL_PERMISSIONS,
        is_system=True,
        is_default=False,
    )
    _ensure(
        db,
        "gestor",
        "Gestiona usuarios",
        [Permission.USERS_MANAGE.value],
        is_system=False,
        is_default=False,
    )
    _ensure(
        db,
        "usuario",
        "Acceso básico a la aplicación",
        [],
        is_system=True,
        is_default=True,
    )
