"""Acceso a datos de reportes vía ORM (§3 cero SQL manual)."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import Report, ReportType


def list_by_author(db: Session, author_id: int) -> list[Report]:
    return list(db.scalars(select(Report).where(Report.author_id == author_id)))


def get_owned(db: Session, report_id: int, author_id: int) -> Report | None:
    return db.scalar(select(Report).where(Report.id == report_id, Report.author_id == author_id))


def create(
    db: Session,
    *,
    author_id: int,
    type: ReportType,
    title: str,
    description: str,
    vehicle_id: int | None,
) -> Report:
    report = Report(
        author_id=author_id,
        type=type,
        title=title,
        description=description,
        vehicle_id=vehicle_id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
