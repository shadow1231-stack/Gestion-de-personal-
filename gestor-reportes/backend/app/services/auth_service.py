"""Lógica de negocio de autenticación (§1 capa de negocio)."""

from sqlalchemy.orm import Session

from app.core.exceptions import DomainError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories import user_repo
from app.schemas.user import UserCreate, UserLogin


def register(db: Session, payload: UserCreate) -> User:
    """Crea un usuario con contraseña hasheada (Argon2)."""
    if user_repo.get_by_email(db, payload.email) is not None:
        raise DomainError("El email ya está registrado")
    return user_repo.create(
        db,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )


def login(db: Session, payload: UserLogin) -> str:
    """Valida credenciales y devuelve un JWT firmado."""
    user = user_repo.get_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise UnauthorizedError()
    if not user.is_active:
        raise UnauthorizedError("Usuario inactivo")
    return create_access_token(subject=str(user.id))
