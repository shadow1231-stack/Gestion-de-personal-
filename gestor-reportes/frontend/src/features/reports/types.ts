export type ReportType = 'personal' | 'vehicular';

export interface Report {
  id: number;
  author_id: number;
  vehicle_id: number | null;
  type: ReportType;
  title: string;
  description: string;
  created_at: string;
}

export interface ReportCreate {
  type: ReportType;
  title: string;
  description: string;
  vehicle_id: number | null;
}
