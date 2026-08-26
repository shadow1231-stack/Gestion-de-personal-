import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VehicleList } from '@/features/vehicles/VehicleList';
import type { Vehicle } from '@/features/vehicles/types';

const sample: Vehicle = {
  id: 1,
  owner_id: 1,
  plate: 'ABC-123',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  created_at: '2026-08-26T00:00:00',
};

describe('VehicleList', () => {
  it('muestra el estado vacío', () => {
    render(<VehicleList vehicles={[]} loading={false} error={null} />);
    expect(screen.getByText(/Aún no hay vehículos/)).toBeInTheDocument();
  });

  it('renderiza los vehículos recibidos', () => {
    render(<VehicleList vehicles={[sample]} loading={false} error={null} />);
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
  });

  it('muestra el error cuando falla la carga', () => {
    render(<VehicleList vehicles={[]} loading={false} error="Fallo de red" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo de red');
  });
});
