import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';

interface UserEditFormProps {
  user: UserRead;
  onSave: (payload: AdminUserUpdate) => Promise<void>;
  onCancel: () => void;
}

/** Formulario de edición de un usuario por un administrador (§4). */
export function UserEditForm({ user, onSave, onCancel }: UserEditFormProps) {
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [isActive, setIsActive] = useState(user.is_active);
  const [isAdmin, setIsAdmin] = useState(user.is_admin);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setSaving(true);
    try {
      await onSave({
        full_name: fullName,
        email,
        is_active: isActive,
        is_admin: isAdmin,
      });
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
      <div className="checks">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Activo
        </label>
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          Administrador
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
