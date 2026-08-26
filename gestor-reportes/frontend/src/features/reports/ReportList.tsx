import { Alert } from '@/shared/ui/Alert';
import { ReportItem } from '@/features/reports/ReportItem';
import type { Report } from '@/features/reports/types';

interface ReportListProps {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

/** Listado de reportes con estados de carga, error y vacío (§4). */
export function ReportList({ reports, loading, error }: ReportListProps) {
  if (loading) {
    return <p className="empty">Cargando reportes…</p>;
  }
  if (error !== null) {
    return <Alert message={error} />;
  }
  if (reports.length === 0) {
    return <p className="empty">Aún no hay reportes. Crea el primero arriba.</p>;
  }
  return (
    <div>
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
    </div>
  );
}
