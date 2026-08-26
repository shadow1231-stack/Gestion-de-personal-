"""Modelos ORM. Se importan aquí para que Alembic los descubra."""

from app.models.report import Report, ReportType
from app.models.role import Role
from app.models.user import User
from app.models.vehicle import Vehicle

__all__ = ["Report", "ReportType", "Role", "User", "Vehicle"]
