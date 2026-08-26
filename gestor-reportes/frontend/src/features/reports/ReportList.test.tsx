import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReportList } from '@/features/reports/ReportList';
import type { Report } from '@/features/reports/types';

const sample: Report = {
  id: 1,
  author_id: 1,
  vehicle_id: null,
  type: 'personal',
  title: 'Chequeo médico',
  description: 'Todo en orden',
  created_at: '2026-08-26T00:00:00',
};

describe('ReportList', () => {
  it('muestra el estado vacío', () => {
    render(<ReportList reports={[]} loading={false} error={null} />);
    expect(screen.getByText(/Aún no hay reportes/)).toBeInTheDocument();
  });

  it('renderiza los reportes recibidos', () => {
    render(<ReportList reports={[sample]} loading={false} error={null} />);
    expect(screen.getByText('Chequeo médico')).toBeInTheDocument();
  });

  it('muestra el error cuando falla la carga', () => {
    render(<ReportList reports={[]} loading={false} error="Fallo de red" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo de red');
  });
});
