import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { ReportCreate, ReportType } from '@/features/reports/types';
import type { Vehicle } from '@/features/vehicles/types';

interface ReportFormProps {
  onCreate: (payload: ReportCreate) => Promise<void>;
  vehicles: Vehicle[];
}

/** Formulario de alta de reporte. Refleja la validación del backend (§4, §5). */
export function ReportForm({ onCreate, vehicles }: ReportFormProps) {
  const [type, setType] = useState<ReportType>('personal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = (): void => {
    setTitle('');
    setDescription('');
    setVehicleId('');
  };

  const handleSubmit = async (): Promise<void> => {
    if (type === 'vehicular' && vehicleId === '') {
      setError('Un reporte vehicular requiere seleccionar un vehículo');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onCreate({
        type,
        title,
        description,
        vehicle_id: type === 'vehicular' ? Number(vehicleId) : null,
      });
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el reporte');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <h2>Nuevo reporte</h2>
      {error !== null && <Alert message={error} />}

      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as ReportType)}>
          <option value="personal">Personal</option>
          <option value="vehicular">Vehicular</option>
        </select>
      </div>

      <TextField id="title" label="Título" value={title} onChange={setTitle} required />
      <TextField
        id="description"
        label="Descripción"
        value={description}
        onChange={setDescription}
        required
        multiline
      />

      {type === 'vehicular' && (
        <div className="field">
          <label htmlFor="vehicle">Vehículo</label>
          {vehicles.length === 0 ? (
            <p className="empty">No tienes vehículos. Regístralo en la pestaña «Vehículos».</p>
          ) : (
            <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="">Selecciona un vehículo…</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={String(vehicle.id)}>
                  {vehicle.plate} — {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Crear reporte'}
      </Button>
    </form>
  );
}
