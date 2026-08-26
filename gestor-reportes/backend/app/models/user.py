"""Modelo ORM de usuario (§3 normalización, unicidad, índices)."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.report import Report
    from app.models.role import Role
    from app.models.vehicle import Vehicle


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), index=True)

    # lazy="joined": el rol se carga junto al usuario (se usa en cada request).
    role: Mapped["Role"] = relationship(back_populates="users", lazy="joined")

    vehicles: Mapped[list["Vehicle"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )
    reports: Mapped[list["Report"]] = relationship(
        back_populates="author", cascade="all, delete-orphan"
    )

    def has_permission(self, permission: str) -> bool:
        return permission in self.role.permissions
