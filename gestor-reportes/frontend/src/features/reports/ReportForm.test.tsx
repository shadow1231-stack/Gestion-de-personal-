import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReportForm } from '@/features/reports/ReportForm';
import type { Vehicle } from '@/features/vehicles/types';

const vehicle: Vehicle = {
  id: 7,
  owner_id: 1,
  plate: 'ABC-123',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  created_at: '2026-08-26T00:00:00',
};

describe('ReportForm', () => {
  it('crea un reporte personal con el payload correcto', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<ReportForm onCreate={onCreate} vehicles={[]} />);

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Chequeo' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Todo bien' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear reporte' }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        type: 'personal',
        title: 'Chequeo',
        description: 'Todo bien',
        vehicle_id: null,
      }),
    );
  });

  it('crea un reporte vehicular con el vehículo seleccionado', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<ReportForm onCreate={onCreate} vehicles={[vehicle]} />);

    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'vehicular' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Aceite' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: '10000 km' } });
    fireEvent.change(screen.getByLabelText('Vehículo'), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear reporte' }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        type: 'vehicular',
        title: 'Aceite',
        description: '10000 km',
        vehicle_id: 7,
      }),
    );
  });

  it('bloquea un reporte vehicular sin vehículo seleccionado', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<ReportForm onCreate={onCreate} vehicles={[vehicle]} />);

    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'vehicular' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Aceite' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: '10000 km' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear reporte' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('requiere seleccionar un vehículo');
    expect(onCreate).not.toHaveBeenCalled();
  });
});
