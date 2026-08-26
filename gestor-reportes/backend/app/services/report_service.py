"""Lógica de negocio de reportes (§1 capa de negocio)."""

from sqlalchemy.orm import Session

from app.core.exceptions import DomainError, NotFoundError
from app.models.report import Report, ReportType
from app.repositories import report_repo, vehicle_repo
from app.schemas.report import ReportCreate


def list_reports(db: Session, author_id: int) -> list[Report]:
    return report_repo.list_by_author(db, author_id)


def create_report(db: Session, author_id: int, payload: ReportCreate) -> Report:
    """Crea un reporte; valida propiedad del vehículo si es vehicular."""
    if payload.type is ReportType.VEHICULAR and payload.vehicle_id is not None:
        if vehicle_repo.get_owned(db, payload.vehicle_id, author_id) is None:
            raise DomainError("El vehículo no existe o no pertenece al usuario")
    return report_repo.create(
        db,
        author_id=author_id,
        type=payload.type,
        title=payload.title,
        description=payload.description,
        vehicle_id=payload.vehicle_id,
    )


def get_report(db: Session, report_id: int, author_id: int) -> Report:
    report = report_repo.get_owned(db, report_id, author_id)
    if report is None:
        raise NotFoundError("Reporte no encontrado")
    return report
