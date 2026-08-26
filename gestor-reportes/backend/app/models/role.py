"""Modelo ORM de rol (RBAC dinámico, §3)."""

from typing import TYPE_CHECKING

from sqlalchemy import JSON, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(200), default="", server_default="")
    # Conjunto de permisos (claves del catálogo) almacenado como JSON.
    permissions: Mapped[list[str]] = mapped_column(JSON, default=list)
    # Roles del sistema no se pueden renombrar ni eliminar.
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    # Rol asignado por defecto al registro público (exactamente uno).
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    users: Mapped[list["User"]] = relationship(back_populates="role")
