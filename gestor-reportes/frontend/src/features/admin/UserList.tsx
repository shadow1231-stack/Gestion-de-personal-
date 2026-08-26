import { Alert } from '@/shared/ui/Alert';
import type { UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';
import { UserItem } from '@/features/admin/UserItem';

interface UserListProps {
  users: UserRead[];
  currentUserId: number | null;
  loading: boolean;
  error: string | null;
  onSave: (id: number, payload: AdminUserUpdate) => Promise<void>;
  onDelete: (id: number) => void;
}

/** Listado de usuarios del panel de admin (§4). */
export function UserList({
  users,
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
          currentUserId={currentUserId}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
