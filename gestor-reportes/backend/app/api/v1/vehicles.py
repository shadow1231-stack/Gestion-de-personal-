"""Endpoints de vehículos (protegidos por JWT, §5)."""

from fastapi import APIRouter, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.common import ApiResponse
from app.schemas.vehicle import VehicleCreate, VehicleRead
from app.services import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("")
def list_vehicles(user: CurrentUser, db: DbSession) -> ApiResponse[list[VehicleRead]]:
    vehicles = vehicle_service.list_vehicles(db, user.id)
    data = [VehicleRead.model_validate(v) for v in vehicles]
    return ApiResponse(data=data)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreate, user: CurrentUser, db: DbSession
) -> ApiResponse[VehicleRead]:
    vehicle = vehicle_service.create_vehicle(db, user.id, payload)
    return ApiResponse(data=VehicleRead.model_validate(vehicle), message="Vehículo creado")


@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: int, user: CurrentUser, db: DbSession) -> ApiResponse[VehicleRead]:
    vehicle = vehicle_service.get_vehicle(db, vehicle_id, user.id)
    return ApiResponse(data=VehicleRead.model_validate(vehicle))
