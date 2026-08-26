"""Catálogo de permisos del sistema (RBAC).

Los permisos son claves fijas definidas en código; los roles (dinámicos, en BD)
agrupan subconjuntos de estos permisos.
"""

from enum import StrEnum


class Permission(StrEnum):
    USERS_MANAGE = "users.manage"
    ROLES_MANAGE = "roles.manage"


ALL_PERMISSIONS: list[str] = [p.value for p in Permission]


def is_valid_permission(value: str) -> bool:
    return value in ALL_PERMISSIONS
