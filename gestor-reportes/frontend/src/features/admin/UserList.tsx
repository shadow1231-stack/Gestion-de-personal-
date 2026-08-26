import { Alert } from '@/shared/ui/Alert';
import type { Role, UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';
import { UserItem } from '@/features/admin/UserItem';

interface UserListProps {
  users: UserRead[];
  roles: Role[];
  currentUserId: number | null;
  loading: boolean;
  error: string | null;
  onSave: (id: number, payload: AdminUserUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

/** Listado de usuarios del panel de admin (§4). */
export function UserList({
  users,
  roles,
  currentUserId,
  loading,
  error,
  onSave,
  onDelete,
}: UserListProps) {
  if (loading) {
    return <p className="empty">Cargando usuarios…</p>;
  }
  if (error !== null) {
    return <Alert message={error} />;
  }
  if (users.length === 0) {
    return <p className="empty">No hay usuarios registrados.</p>;
  }
  return (
    <div>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          roles={roles}
          currentUserId={currentUserId}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
