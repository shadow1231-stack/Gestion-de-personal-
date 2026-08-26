import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/client';
import type { UserRead } from '@/features/auth/types';
import { createUser, deleteUser, listUsers, updateUser } from '@/features/admin/api';
import type { AdminUserCreate, AdminUserUpdate } from '@/features/admin/types';

interface UsersState {
  users: UserRead[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (payload: AdminUserCreate) => Promise<void>;
  save: (id: number, payload: AdminUserUpdate) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

function toMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error al comunicarse con el servidor';
}

/** Estado de la lista de usuarios para el panel de admin (§1). */
export function useUsers(enabled: boolean): UsersState {
  const [users, setUsers] = useState<UserRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: AdminUserCreate): Promise<void> => {
    const created = await createUser(payload);
    setUsers((prev) => [...prev, created]);
  }, []);

  const save = useCallback(async (id: number, payload: AdminUserUpdate): Promise<void> => {
    const updated = await updateUser(id, payload);
    setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
  }, []);

  const remove = useCallback(async (id: number): Promise<void> => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return { users, loading, error, refresh, create, save, remove };
}
