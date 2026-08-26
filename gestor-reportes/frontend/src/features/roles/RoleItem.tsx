import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import type { Role } from '@/features/auth/types';
import { RoleForm } from '@/features/roles/RoleForm';
import type { RoleUpdate } from '@/features/roles/types';

interface RoleItemProps {
  role: Role;
  catalog: string[];
  onSave: (id: number, payload: RoleUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

/** Fila de rol con acciones de editar/eliminar (§4). */
export function RoleItem({ role, catalog, onSave, onDelete }: RoleItemProps) {
  const [editing, setEditing] = useState(false);
  const protectedRole = role.is_system || role.is_default;

  if (editing) {
    return (
      <div className="report-item">
        <RoleForm
          catalog={catalog}
          role={role}
          submitLabel="Guardar"
          onCancel={() => setEditing(false)}
          onSubmit={async (payload) => {
            await onSave(role.id, {
              description: payload.description,
              permissions: payload.permissions,
            });
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <article className="report-item user-row">
      <div className="user-meta">
        <h3>
          {role.name}
          {role.is_system && <span className="badge badge-inactive">sistema</span>}
          {role.is_default && <span className="badge badge-self">por defecto</span>}
        </h3>
        <p>{role.description || 'Sin descripción'}</p>
        <div>
          {role.permissions.length === 0 ? (
            <span className="badge badge-inactive">sin permisos</span>
          ) : (
            role.permissions.map((permission) => (
              <span key={permission} className="badge badge-personal">
                {permission}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="row-actions">
        <Button variant="ghost" onClick={() => setEditing(true)}>
          Editar
        </Button>
        <Button variant="ghost" onClick={() => onDelete(role.id)} disabled={protectedRole}>
          Eliminar
        </Button>
      </div>
    </article>
  );
}
