"""Endpoints de reportes (protegidos por JWT, §5)."""

from fastapi import APIRouter, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.common import ApiResponse
from app.schemas.report import ReportCreate, ReportRead
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("")
def list_reports(user: CurrentUser, db: DbSession) -> ApiResponse[list[ReportRead]]:
    reports = report_service.list_reports(db, user.id)
    data = [ReportRead.model_validate(r) for r in reports]
    return ApiResponse(data=data)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate, user: CurrentUser, db: DbSession
) -> ApiResponse[ReportRead]:
    report = report_service.create_report(db, user.id, payload)
    return ApiResponse(data=ReportRead.model_validate(report), message="Reporte creado")


@router.get("/{report_id}")
def get_report(report_id: int, user: CurrentUser, db: DbSession) -> ApiResponse[ReportRead]:
    report = report_service.get_report(db, report_id, user.id)
    return ApiResponse(data=ReportRead.model_validate(report))
