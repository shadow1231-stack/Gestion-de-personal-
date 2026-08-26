import { Alert } from '@/shared/ui/Alert';
import type { Role } from '@/features/auth/types';
import { RoleItem } from '@/features/roles/RoleItem';
import type { RoleUpdate } from '@/features/roles/types';

interface RoleListProps {
  roles: Role[];
  catalog: string[];
  loading: boolean;
  error: string | null;
  onSave: (id: number, payload: RoleUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

/** Listado de roles (§4). */
export function RoleList({ roles, catalog, loading, error, onSave, onDelete }: RoleListProps) {
  if (loading) {
    return <p className="empty">Cargando roles…</p>;
  }
  if (error !== null) {
    return <Alert message={error} />;
  }
  if (roles.length === 0) {
    return <p className="empty">No hay roles.</p>;
  }
  return (
    <div>
      {roles.map((role) => (
        <RoleItem key={role.id} role={role} catalog={catalog} onSave={onSave} onDelete={onDelete} />
      ))}
    </div>
  );
}
