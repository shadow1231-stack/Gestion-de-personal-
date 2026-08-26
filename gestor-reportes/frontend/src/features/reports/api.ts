import { apiFetch } from '@/shared/api/client';
import type { Report, ReportCreate } from '@/features/reports/types';

/** Lista los reportes del usuario autenticado (§5, requiere JWT). */
export function listReports(): Promise<Report[]> {
  return apiFetch<Report[]>('/reports');
}

/** Crea un nuevo reporte (§5, requiere JWT). */
export function createReport(payload: ReportCreate): Promise<Report> {
  return apiFetch<Report>('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
