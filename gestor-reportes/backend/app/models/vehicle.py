"""Modelo ORM de vehículo (§3 FK, unicidad, índices)."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.report import Report
    from app.models.user import User


class Vehicle(Base, TimestampMixin):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    plate: Mapped[str] = mapped_column(String(15), unique=True, index=True)
    brand: Mapped[str] = mapped_column(String(60))
    model: Mapped[str] = mapped_column(String(60))
    year: Mapped[int] = mapped_column()

    owner: Mapped["User"] = relationship(back_populates="vehicles")
    reports: Mapped[list["Report"]] = relationship(
        back_populates="vehicle", cascade="all, delete-orphan"
    )
