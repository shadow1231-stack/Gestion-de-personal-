import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { createVehicle, listVehicles } from '@/features/vehicles/api';
import type { Vehicle, VehicleCreate } from '@/features/vehicles/types';

interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  add: (payload: VehicleCreate) => Promise<void>;
  refresh: () => Promise<void>;
}

function toMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error al comunicarse con el servidor';
}

/** Estado de los vehículos: carga inicial y alta (§1 lógica fuera de la vista). */
export function useVehicles(enabled: boolean): VehiclesState {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setVehicles(await listVehicles());
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (payload: VehicleCreate): Promise<void> => {
    const created = await createVehicle(payload);
    setVehicles((prev) => [...prev, created]);
  }, []);

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return { vehicles, loading, error, add, refresh };
}
