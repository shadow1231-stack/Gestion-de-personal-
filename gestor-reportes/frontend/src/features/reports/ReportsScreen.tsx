import { ReportForm } from '@/features/reports/ReportForm';
import { ReportList } from '@/features/reports/ReportList';
import { useReports } from '@/features/reports/useReports';
import { useVehicles } from '@/features/vehicles/useVehicles';

/** Pantalla principal de reportes: alta + listado (§1 compone la feature). */
export function ReportsScreen() {
  const { reports, loading, error, add } = useReports(true);
  const { vehicles } = useVehicles(true);

  return (
    <section>
      <ReportForm onCreate={add} vehicles={vehicles} />
      <div className="card">
        <h2>Mis reportes</h2>
        <ReportList reports={reports} loading={loading} error={error} />
      </div>
    </section>
  );
}
