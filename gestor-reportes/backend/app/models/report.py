"""Modelo ORM de reporte, personal o vehicular (§3 FK, índices)."""

from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.vehicle import Vehicle


class ReportType(StrEnum):
    PERSONAL = "personal"
    VEHICULAR = "vehicular"


class Report(Base, TimestampMixin):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    # Nulo cuando el reporte es personal; obligatorio cuando es vehicular.
    vehicle_id: Mapped[int | None] = mapped_column(
        ForeignKey("vehicles.id", ondelete="CASCADE"), index=True, nullable=True
    )
    type: Mapped[ReportType] = mapped_column(Enum(ReportType), index=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(Text)

    author: Mapped["User"] = relationship(back_populates="reports")
    vehicle: Mapped["Vehicle | None"] = relationship(back_populates="reports")
