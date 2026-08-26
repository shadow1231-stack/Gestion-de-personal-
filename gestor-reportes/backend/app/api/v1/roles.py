"""Endpoints de administración de roles (permiso roles.manage, §5)."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import DbSession, require_any_permission, require_permission
from app.core.permissions import ALL_PERMISSIONS, Permission
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.role import RoleCreate, RoleRead, RoleUpdate
from app.services import role_service

router = APIRouter(prefix="/admin", tags=["roles"])

ManageRoles = Annotated[User, Depends(require_permission(Permission.ROLES_MANAGE))]
# Listar roles: también quien gestiona usuarios (los necesita para asignar).
ViewRoles = Annotated[
    User, Depends(require_any_permission(Permission.USERS_MANAGE, Permission.ROLES_MANAGE))
]


@router.get("/permissions")
def list_permissions(admin: ManageRoles) -> ApiResponse[list[str]]:
    """Catálogo de permisos disponibles para construir roles."""
    return ApiResponse(data=ALL_PERMISSIONS)


@router.get("/roles")
def list_roles(admin: ViewRoles, db: DbSession) -> ApiResponse[list[RoleRead]]:
    roles = role_service.list_roles(db)
    return ApiResponse(data=[RoleRead.model_validate(r) for r in roles])


@router.post("/roles", status_code=status.HTTP_201_CREATED)
def create_role(payload: RoleCreate, admin: ManageRoles, db: DbSession) -> ApiResponse[RoleRead]:
    role = role_service.create_role(db, payload)
    return ApiResponse(data=RoleRead.model_validate(role), message="Rol creado")


@router.patch("/roles/{role_id}")
def update_role(
    role_id: int, payload: RoleUpdate, admin: ManageRoles, db: DbSession
) -> ApiResponse[RoleRead]:
    role = role_service.update_role(db, role_id, payload)
    return ApiResponse(data=RoleRead.model_validate(role), message="Rol actualizado")


@router.delete("/roles/{role_id}")
def delete_role(role_id: int, admin: ManageRoles, db: DbSession) -> ApiResponse[None]:
    role_service.delete_role(db, role_id)
    return ApiResponse(message="Rol eliminado")
