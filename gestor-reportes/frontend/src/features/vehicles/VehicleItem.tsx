import type { Vehicle } from '@/features/vehicles/types';

interface VehicleItemProps {
  vehicle: Vehicle;
}

/** Muestra un único vehículo (§4 componente pequeño). */
export function VehicleItem({ vehicle }: VehicleItemProps) {
  return (
    <article className="report-item">
      <h3>{vehicle.plate}</h3>
      <p>
        {vehicle.brand} {vehicle.model} · {vehicle.year}
      </p>
      <span className="badge badge-vehicular">#{vehicle.id}</span>
    </article>
  );
}
