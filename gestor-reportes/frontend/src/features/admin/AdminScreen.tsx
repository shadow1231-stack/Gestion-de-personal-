import { useEffect, useState } from 'react';
import type { Role } from '@/features/auth/types';
import { listRoles } from '@/features/roles/api';
import { CreateUserForm } from '@/features/admin/CreateUserForm';
import { UserList } from '@/features/admin/UserList';
import { useUsers } from '@/features/admin/useUsers';

interface AdminScreenProps {
  currentUserId: number | null;
}

/** Panel de administración de usuarios (§1 compone la feature). */
export function AdminScreen({ currentUserId }: AdminScreenProps) {
  const { users, loading, error, create, save, remove } = useUsers(true);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    void listRoles()
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  const handleDelete = (id: number): void => {
    if (window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
      void remove(id);
    }
  };

  return (
    <section>
      <div className="card">
        <h2>Nuevo usuario</h2>
        <CreateUserForm roles={roles} onCreate={create} />
      </div>
      <div className="card">
        <h2>Usuarios registrados</h2>
        <UserList
          users={users}
          roles={roles}
          currentUserId={currentUserId}
          loading={loading}
          error={error}
          onSave={save}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
