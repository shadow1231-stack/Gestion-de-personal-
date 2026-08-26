import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { Role, UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';

interface UserEditFormProps {
  user: UserRead;
  roles: Role[];
  onSave: (payload: AdminUserUpdate) => Promise<void>;
  onCancel: () => void;
}

/** Formulario de edición de un usuario por un administrador (§4). */
export function UserEditForm({ user, roles, onSave, onCancel }: UserEditFormProps) {
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [isActive, setIsActive] = useState(user.is_active);
  const [roleId, setRoleId] = useState(user.role.id);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setSaving(true);
    try {
      await onSave({ full_name: fullName, email, is_active: isActive, role_id: roleId });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="user-edit"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {error !== null && <Alert message={error} />}
      <TextField
        id={`name-${user.id}`}
        label="Nombre"
        value={fullName}
        onChange={setFullName}
        required
      />
      <TextField
        id={`email-${user.id}`}
        label="Correo"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <div className="field">
        <label htmlFor={`role-${user.id}`}>Rol</label>
        <select
          id={`role-${user.id}`}
          value={roleId}
          onChange={(e) => setRoleId(Number(e.target.value))}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <div className="checks">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Activo
        </label>
      </div>
      <div className="row-actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
