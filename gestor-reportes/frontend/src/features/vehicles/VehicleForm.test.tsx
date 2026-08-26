import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VehicleForm } from '@/features/vehicles/VehicleForm';

describe('VehicleForm', () => {
  it('crea un vehículo con el payload correcto', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<VehicleForm onCreate={onCreate} />);

    fireEvent.change(screen.getByLabelText('Placa'), { target: { value: 'ABC-123' } });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Corolla' } });
    fireEvent.change(screen.getByLabelText('Año'), { target: { value: '2020' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear vehículo' }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        plate: 'ABC-123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
      }),
    );
  });

  it('rechaza un año fuera de rango', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<VehicleForm onCreate={onCreate} />);

    fireEvent.change(screen.getByLabelText('Placa'), { target: { value: 'ABC-123' } });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Corolla' } });
    fireEvent.change(screen.getByLabelText('Año'), { target: { value: '1800' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear vehículo' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('entre 1900 y 2100');
    expect(onCreate).not.toHaveBeenCalled();
  });
});
