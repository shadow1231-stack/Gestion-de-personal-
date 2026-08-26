"""Acceso a datos de roles vía ORM (§3 cero SQL manual)."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User


def get_by_id(db: Session, role_id: int) -> Role | None:
    return db.get(Role, role_id)


def get_by_name(db: Session, name: str) -> Role | None:
    return db.scalar(select(Role).where(Role.name == name))


def get_default(db: Session) -> Role | None:
    return db.scalar(select(Role).where(Role.is_default.is_(True)))


def list_all(db: Session) -> list[Role]:
    return list(db.scalars(select(Role).order_by(Role.id)))


def count_users(db: Session, role_id: int) -> int:
    total = db.scalar(select(func.count()).select_from(User).where(User.role_id == role_id))
    return total or 0


def create(
    db: Session,
    *,
    name: str,
    description: str = "",
    permissions: list[str] | None = None,
    is_system: bool = False,
    is_default: bool = False,
) -> Role:
    role = Role(
        name=name,
        description=description,
        permissions=permissions or [],
        is_system=is_system,
        is_default=is_default,
    )
    db.add(role)
    db.commit()
    db.refresh(role)
    return role


def update(db: Session, role: Role, **fields: object) -> Role:
    for key, value in fields.items():
        setattr(role, key, value)
    db.commit()
    db.refresh(role)
    return role


def delete(db: Session, role: Role) -> None:
    db.delete(role)
    db.commit()
