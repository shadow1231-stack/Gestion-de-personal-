"""Lógica de negocio de autenticación (§1 capa de negocio)."""

from sqlalchemy.orm import Session

from app.core.exceptions import DomainError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories import role_repo, user_repo
from app.schemas.user import UserCreate, UserLogin


def register(db: Session, payload: UserCreate) -> User:
    """Crea un usuario con el rol por defecto (§3: el cliente nunca elige rol)."""
    if user_repo.get_by_email(db, payload.email) is not None:
        raise DomainError("El email ya está registrado")
    default_role = role_repo.get_default(db)
    if default_role is None:
        raise DomainError("No hay un rol por defecto configurado")
    return user_repo.create(
        db,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role_id=default_role.id,
    )


def login(db: Session, payload: UserLogin) -> str:
    """Valida credenciales y devuelve un JWT firmado."""
    user = user_repo.get_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise UnauthorizedError()
    if not user.is_active:
        raise UnauthorizedError("Usuario inactivo")
    return create_access_token(subject=str(user.id))
