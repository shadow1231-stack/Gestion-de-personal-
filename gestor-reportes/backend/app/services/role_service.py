"""Lógica de negocio de roles (RBAC dinámico, §1, §3)."""

from sqlalchemy.orm import Session

from app.core.exceptions import DomainError, NotFoundError
from app.models.role import Role
from app.repositories import role_repo
from app.schemas.role import RoleCreate, RoleUpdate


def list_roles(db: Session) -> list[Role]:
    return role_repo.list_all(db)


def create_role(db: Session, payload: RoleCreate) -> Role:
    if role_repo.get_by_name(db, payload.name) is not None:
        raise DomainError("Ya existe un rol con ese nombre")
    return role_repo.create(
        db,
        name=payload.name,
        description=payload.description,
        permissions=payload.permissions,
    )


def update_role(db: Session, role_id: int, payload: RoleUpdate) -> Role:
    role = role_repo.get_by_id(db, role_id)
    if role is None:
        raise NotFoundError("Rol no encontrado")
    data = payload.model_dump(exclude_unset=True)
    return role_repo.update(db, role, **data)


def delete_role(db: Session, role_id: int) -> None:
    """Elimina un rol; protege los del sistema, el rol por defecto y los que están en uso."""
    role = role_repo.get_by_id(db, role_id)
    if role is None:
        raise NotFoundError("Rol no encontrado")
    if role.is_system:
        raise DomainError("No se puede eliminar un rol del sistema")
    if role.is_default:
        raise DomainError("No se puede eliminar el rol por defecto")
    if role_repo.count_users(db, role_id) > 0:
        raise DomainError("No se puede eliminar un rol asignado a usuarios")
    role_repo.delete(db, role)
