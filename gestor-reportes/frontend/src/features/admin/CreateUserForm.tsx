import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { Role } from '@/features/auth/types';
import type { AdminUserCreate } from '@/features/admin/types';

interface CreateUserFormProps {
  roles: Role[];
  onCreate: (payload: AdminUserCreate) => Promise<void>;
}

const MIN_PASSWORD = 8;

/** Alta de usuario con rol asignado por un administrador (§4, §5). */
export function CreateUserForm({ roles, onCreate }: CreateUserFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = (): void => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRoleId('');
  };

  const handleSubmit = async (): Promise<void> => {
    if (password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`);
      return;
    }
    if (roleId === '') {
      setError('Selecciona un rol');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onCreate({ email, full_name: fullName, password, role_id: roleId });
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el usuario');
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
        id="new-name"
        label="Nombre completo"
        value={fullName}
        onChange={setFullName}
        required
      />
      <TextField
        id="new-email"
        label="Correo"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <TextField
        id="new-password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        required
        placeholder="Mínimo 8 caracteres"
      />
      <div className="field">
        <label htmlFor="new-role">Rol</label>
        <select
          id="new-role"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">Selecciona un rol…</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear usuario'}
      </Button>
    </form>
  );
}
