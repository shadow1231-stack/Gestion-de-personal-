import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { VehicleCreate } from '@/features/vehicles/types';

interface VehicleFormProps {
  onCreate: (payload: VehicleCreate) => Promise<void>;
}

/** Formulario de alta de vehículo (§4 componente pequeño, Mobile-First). */
export function VehicleForm({ onCreate }: VehicleFormProps) {
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = (): void => {
    setPlate('');
    setBrand('');
    setModel('');
    setYear('');
  };

  const handleSubmit = async (): Promise<void> => {
    const parsedYear = Number(year);
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      setError('El año debe ser un número entre 1900 y 2100');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onCreate({ plate, brand, model, year: parsedYear });
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el vehículo');
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
      <h2>Nuevo vehículo</h2>
      {error !== null && <Alert message={error} />}
      <TextField id="plate" label="Placa" value={plate} onChange={setPlate} required />
      <TextField id="brand" label="Marca" value={brand} onChange={setBrand} required />
      <TextField id="model" label="Modelo" value={model} onChange={setModel} required />
      <TextField id="year" label="Año" type="number" value={year} onChange={setYear} required />
      <Button type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Crear vehículo'}
      </Button>
    </form>
  );
}
