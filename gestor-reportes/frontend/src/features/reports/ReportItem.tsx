import type { Report } from '@/features/reports/types';

interface ReportItemProps {
  report: Report;
}

/** Muestra un único reporte (§4 componente pequeño). */
export function ReportItem({ report }: ReportItemProps) {
  const badgeClass = report.type === 'vehicular' ? 'badge badge-vehicular' : 'badge badge-personal';
  return (
    <article className="report-item">
      <h3>{report.title}</h3>
      <p>{report.description}</p>
      <span className={badgeClass}>{report.type}</span>
      {report.vehicle_id !== null && <span> · vehículo #{report.vehicle_id}</span>}
    </article>
  );
}
