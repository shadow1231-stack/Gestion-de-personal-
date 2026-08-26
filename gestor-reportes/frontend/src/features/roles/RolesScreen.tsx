import { RoleForm } from '@/features/roles/RoleForm';
import { RoleList } from '@/features/roles/RoleList';
import { useRoles } from '@/features/roles/useRoles';

/** Panel de gestión de roles (§1 compone la feature). */
export function RolesScreen() {
  const { roles, catalog, loading, error, create, update, remove } = useRoles(true);

  const handleDelete = (id: number): void => {
    if (window.confirm('¿Eliminar este rol? Esta acción no se puede deshacer.')) {
      void remove(id);
    }
  };

  return (
    <section>
      <div className="card">
        <h2>Nuevo rol</h2>
        <RoleForm
          catalog={catalog}
          submitLabel="Crear rol"
          onSubmit={(payload) => create(payload)}
        />
      </div>
      <div className="card">
        <h2>Roles</h2>
        <RoleList
          roles={roles}
          catalog={catalog}
          loading={loading}
          error={error}
          onSave={update}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
