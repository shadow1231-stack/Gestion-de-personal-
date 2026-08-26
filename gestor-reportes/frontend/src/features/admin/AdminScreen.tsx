import { UserList } from '@/features/admin/UserList';
import { useUsers } from '@/features/admin/useUsers';

interface AdminScreenProps {
  currentUserId: number | null;
}

/** Panel de administración de usuarios (§1 compone la feature). */
export function AdminScreen({ currentUserId }: AdminScreenProps) {
  const { users, loading, error, save, remove } = useUsers(true);

  const handleDelete = (id: number): void => {
    if (window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
      void remove(id);
    }
  };

  return (
    <section>
      <div className="card">
        <h2>Usuarios registrados</h2>
        <UserList
          users={users}
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
