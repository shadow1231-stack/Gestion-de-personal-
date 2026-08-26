"""Acceso a datos de vehículos vía ORM (§3 cero SQL manual)."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


def list_by_owner(db: Session, owner_id: int) -> list[Vehicle]:
    return list(db.scalars(select(Vehicle).where(Vehicle.owner_id == owner_id)))


def get_owned(db: Session, vehicle_id: int, owner_id: int) -> Vehicle | None:
    return db.scalar(select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.owner_id == owner_id))


def create(db: Session, *, owner_id: int, plate: str, brand: str, model: str, year: int) -> Vehicle:
    vehicle = Vehicle(owner_id=owner_id, plate=plate, brand=brand, model=model, year=year)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle
