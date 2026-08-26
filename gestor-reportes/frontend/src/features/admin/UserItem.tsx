import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import type { Role, UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';
import { UserEditForm } from '@/features/admin/UserEditForm';

interface UserItemProps {
  user: UserRead;
  roles: Role[];
  currentUserId: number | null;
  onSave: (id: number, payload: AdminUserUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

/** Fila de usuario con acciones de editar/eliminar (§4). */
export function UserItem({ user, roles, currentUserId, onSave, onDelete }: UserItemProps) {
  const [editing, setEditing] = useState(false);
  const isSelf = user.id === currentUserId;

  if (editing) {
    return (
      <div className="report-item">
        <UserEditForm
          user={user}
          roles={roles}
          onCancel={() => setEditing(false)}
          onSave={async (payload) => {
            await onSave(user.id, payload);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <article className="report-item user-row">
      <div className="user-meta">
        <h3>{user.full_name}</h3>
        <p>{user.email}</p>
        <div>
          <span className="badge badge-personal">{user.role.name}</span>
          {!user.is_active && <span className="badge badge-inactive">inactivo</span>}
          {isSelf && <span className="badge badge-self">tú</span>}
        </div>
      </div>
      <div className="row-actions">
        <Button variant="ghost" onClick={() => setEditing(true)}>
          Editar
        </Button>
        <Button variant="ghost" onClick={() => onDelete(user.id)} disabled={isSelf}>
          Eliminar
        </Button>
      </div>
    </article>
  );
}
