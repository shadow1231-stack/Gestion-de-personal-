import { apiFetch } from '@/shared/api/client';
import type { Vehicle, VehicleCreate } from '@/features/vehicles/types';

/** Lista los vehículos del usuario autenticado (§5, requiere JWT). */
export function listVehicles(): Promise<Vehicle[]> {
  return apiFetch<Vehicle[]>('/vehicles');
}

/** Crea un nuevo vehículo (§5, requiere JWT). */
export function createVehicle(payload: VehicleCreate): Promise<Vehicle> {
  return apiFetch<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
