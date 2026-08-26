import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { createReport, listReports } from '@/features/reports/api';
import type { Report, ReportCreate } from '@/features/reports/types';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  add: (payload: ReportCreate) => Promise<void>;
  refresh: () => Promise<void>;
}

function toMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error al comunicarse con el servidor';
}

/** Estado de los reportes: carga inicial y alta (§1 lógica fuera de la vista). */
export function useReports(enabled: boolean): ReportsState {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setReports(await listReports());
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (payload: ReportCreate): Promise<void> => {
    const created = await createReport(payload);
    setReports((prev) => [...prev, created]);
  }, []);

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return { reports, loading, error, add, refresh };
}
