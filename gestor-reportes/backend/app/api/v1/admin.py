"""Endpoints de administración de usuarios (permiso users.manage, §5)."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import DbSession, require_permission
from app.core.permissions import Permission
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.user import AdminUserCreate, UserRead, UserUpdate
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["admin"])

ManageUsers = Annotated[User, Depends(require_permission(Permission.USERS_MANAGE))]


@router.get("/users")
def list_users(admin: ManageUsers, db: DbSession) -> ApiResponse[list[UserRead]]:
    users = admin_service.list_users(db)
    return ApiResponse(data=[UserRead.model_validate(u) for u in users])


@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(
    payload: AdminUserCreate, admin: ManageUsers, db: DbSession
) -> ApiResponse[UserRead]:
    user = admin_service.create_user(db, payload)
    return ApiResponse(data=UserRead.model_validate(user), message="Usuario creado")


@router.patch("/users/{user_id}")
def update_user(
    user_id: int, payload: UserUpdate, admin: ManageUsers, db: DbSession
) -> ApiResponse[UserRead]:
    user = admin_service.update_user(db, user_id, payload)
    return ApiResponse(data=UserRead.model_validate(user), message="Usuario actualizado")


@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin: ManageUsers, db: DbSession) -> ApiResponse[None]:
    admin_service.delete_user(db, user_id, admin.id)
    return ApiResponse(message="Usuario eliminado")
