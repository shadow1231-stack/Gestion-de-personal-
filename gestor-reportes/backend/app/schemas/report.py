"""Esquemas Pydantic para reportes (§2 tipado, §4 validación)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.report import ReportType


class ReportCreate(BaseModel):
    type: ReportType
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    vehicle_id: int | None = None

    @model_validator(mode="after")
    def _check_vehicle_consistency(self) -> "ReportCreate":
        """Un reporte vehicular exige vehicle_id; uno personal no lo admite."""
        if self.type is ReportType.VEHICULAR and self.vehicle_id is None:
            raise ValueError("Un reporte vehicular requiere vehicle_id")
        if self.type is ReportType.PERSONAL and self.vehicle_id is not None:
            raise ValueError("Un reporte personal no admite vehicle_id")
        return self


class ReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_id: int
    vehicle_id: int | None
    type: ReportType
    title: str
    description: str
    created_at: datetime
