"""Endpoints de administración de usuarios (solo admins, §5)."""

from fastapi import APIRouter

from app.api.deps import CurrentAdmin, DbSession
from app.schemas.common import ApiResponse
from app.schemas.user import UserRead, UserUpdate
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(admin: CurrentAdmin, db: DbSession) -> ApiResponse[list[UserRead]]:
    users = admin_service.list_users(db)
    return ApiResponse(data=[UserRead.model_validate(u) for u in users])


@router.patch("/users/{user_id}")
def update_user(
    user_id: int, payload: UserUpdate, admin: CurrentAdmin, db: DbSession
) -> ApiResponse[UserRead]:
    user = admin_service.update_user(db, user_id, payload)
    return ApiResponse(data=UserRead.model_validate(user), message="Usuario actualizado")


@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin: CurrentAdmin, db: DbSession) -> ApiResponse[None]:
    admin_service.delete_user(db, user_id, admin.id)
    return ApiResponse(message="Usuario eliminado")
