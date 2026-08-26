import { Alert } from '@/shared/ui/Alert';
import { VehicleItem } from '@/features/vehicles/VehicleItem';
import type { Vehicle } from '@/features/vehicles/types';

interface VehicleListProps {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

/** Listado de vehículos con estados de carga, error y vacío (§4). */
export function VehicleList({ vehicles, loading, error }: VehicleListProps) {
  if (loading) {
    return <p className="empty">Cargando vehículos…</p>;
  }
  if (error !== null) {
    return <Alert message={error} />;
  }
  if (vehicles.length === 0) {
    return <p className="empty">Aún no hay vehículos. Registra el primero arriba.</p>;
  }
  return (
    <div>
      {vehicles.map((vehicle) => (
        <VehicleItem key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
