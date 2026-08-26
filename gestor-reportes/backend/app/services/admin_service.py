"""Lógica de negocio de administración de usuarios (§1, §3)."""

from sqlalchemy.orm import Session

from app.core.exceptions import DomainError, NotFoundError
from app.models.user import User
from app.repositories import user_repo
from app.schemas.user import UserUpdate


def list_users(db: Session) -> list[User]:
    return user_repo.list_all(db)


def update_user(db: Session, user_id: int, payload: UserUpdate) -> User:
    """Actualiza campos de un usuario; valida unicidad del email si cambia."""
    user = user_repo.get_by_id(db, user_id)
    if user is None:
        raise NotFoundError("Usuario no encontrado")

    data = payload.model_dump(exclude_unset=True)
    new_email = data.get("email")
    if new_email is not None and new_email != user.email:
        if user_repo.get_by_email(db, new_email) is not None:
            raise DomainError("El email ya está registrado")

    return user_repo.update(db, user, **data)


def delete_user(db: Session, user_id: int, current_admin_id: int) -> None:
    """Elimina un usuario; un admin no puede eliminarse a sí mismo (§3)."""
    user = user_repo.get_by_id(db, user_id)
    if user is None:
        raise NotFoundError("Usuario no encontrado")
    if user.id == current_admin_id:
        raise DomainError("No puedes eliminar tu propia cuenta")
    user_repo.delete(db, user)
