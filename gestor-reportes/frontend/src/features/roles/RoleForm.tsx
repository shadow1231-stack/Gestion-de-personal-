import { useState } from 'react';
import { ApiError } from '@/shared/api/client';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { Role } from '@/features/auth/types';

export interface RolePayload {
  name: string;
  description: string;
  permissions: string[];
}

interface RoleFormProps {
  catalog: string[];
  role?: Role;
  submitLabel: string;
  onSubmit: (payload: RolePayload) => Promise<void>;
  onCancel?: () => void;
}

/** Formulario para crear o editar un rol (§4). */
export function RoleForm({ catalog, role, submitLabel, onSubmit, onCancel }: RoleFormProps) {
  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [permissions, setPermissions] = useState<string[]>(role?.permissions ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = role !== undefined;
  const nameLocked = isEditing; // el nombre no se edita (roles del sistema y consistencia)

  const toggle = (permission: string): void => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    );
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name, description, permissions });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el rol');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="role-form"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {error !== null && <Alert message={error} />}
      {!nameLocked && (
        <TextField id="role-name" label="Nombre del rol" value={name} onChange={setName} required />
      )}
      <TextField
        id={`role-desc-${role?.id ?? 'new'}`}
        label="Descripción"
        value={description}
        onChange={setDescription}
      />
      <div className="field">
        <label>Permisos</label>
        <div className="checks checks-col">
          {catalog.map((permission) => (
            <label key={permission}>
              <input
                type="checkbox"
                checked={permissions.includes(permission)}
                onChange={() => toggle(permission)}
              />
              {permission}
            </label>
          ))}
        </div>
      </div>
      <div className="row-actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
