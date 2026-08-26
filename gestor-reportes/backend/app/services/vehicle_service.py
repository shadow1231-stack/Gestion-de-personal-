"""Lógica de negocio de vehículos (§1 capa de negocio)."""

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.vehicle import Vehicle
from app.repositories import vehicle_repo
from app.schemas.vehicle import VehicleCreate


def list_vehicles(db: Session, owner_id: int) -> list[Vehicle]:
    return vehicle_repo.list_by_owner(db, owner_id)


def create_vehicle(db: Session, owner_id: int, payload: VehicleCreate) -> Vehicle:
    return vehicle_repo.create(
        db,
        owner_id=owner_id,
        plate=payload.plate,
        brand=payload.brand,
        model=payload.model,
        year=payload.year,
    )


def get_vehicle(db: Session, vehicle_id: int, owner_id: int) -> Vehicle:
    vehicle = vehicle_repo.get_owned(db, vehicle_id, owner_id)
    if vehicle is None:
        raise NotFoundError("Vehículo no encontrado")
    return vehicle
