import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/client';
import type { Role } from '@/features/auth/types';
import {
  createRole,
  deleteRole,
  listPermissions,
  listRoles,
  updateRole,
} from '@/features/roles/api';
import type { RoleCreate, RoleUpdate } from '@/features/roles/types';

interface RolesState {
  roles: Role[];
  catalog: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (payload: RoleCreate) => Promise<void>;
  update: (id: number, payload: RoleUpdate) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

function toMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error al comunicarse con el servidor';
}

/** Estado de roles + catálogo de permisos para el panel de roles (§1). */
export function useRoles(enabled: boolean): RolesState {
  const [roles, setRoles] = useState<Role[]>([]);
  const [catalog, setCatalog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, catalogData] = await Promise.all([listRoles(), listPermissions()]);
      setRoles(rolesData);
      setCatalog(catalogData);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: RoleCreate): Promise<void> => {
    const created = await createRole(payload);
    setRoles((prev) => [...prev, created]);
  }, []);

  const update = useCallback(async (id: number, payload: RoleUpdate): Promise<void> => {
    const updated = await updateRole(id, payload);
    setRoles((prev) => prev.map((role) => (role.id === id ? updated : role)));
  }, []);

  const remove = useCallback(async (id: number): Promise<void> => {
    await deleteRole(id);
    setRoles((prev) => prev.filter((role) => role.id !== id));
  }, []);

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return { roles, catalog, loading, error, refresh, create, update, remove };
}
