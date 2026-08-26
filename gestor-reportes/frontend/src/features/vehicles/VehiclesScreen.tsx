import { VehicleForm } from '@/features/vehicles/VehicleForm';
import { VehicleList } from '@/features/vehicles/VehicleList';
import { useVehicles } from '@/features/vehicles/useVehicles';

/** Pantalla principal de vehículos: alta + listado (§1 compone la feature). */
export function VehiclesScreen() {
  const { vehicles, loading, error, add } = useVehicles(true);

  return (
    <section>
      <VehicleForm onCreate={add} />
      <div className="card">
        <h2>Mis vehículos</h2>
        <VehicleList vehicles={vehicles} loading={loading} error={error} />
      </div>
    </section>
  );
}
