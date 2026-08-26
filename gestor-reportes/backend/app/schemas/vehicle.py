"""Esquemas Pydantic para vehículos (§2 tipado, §4 validación)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VehicleCreate(BaseModel):
    plate: str = Field(min_length=1, max_length=15)
    brand: str = Field(min_length=1, max_length=60)
    model: str = Field(min_length=1, max_length=60)
    year: int = Field(ge=1900, le=2100)


class VehicleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    plate: str
    brand: str
    model: str
    year: int
    created_at: datetime
