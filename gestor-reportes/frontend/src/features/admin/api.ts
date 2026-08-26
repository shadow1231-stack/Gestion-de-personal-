import { apiFetch, apiSend } from '@/shared/api/client';
import type { UserRead } from '@/features/auth/types';
import type { AdminUserUpdate } from '@/features/admin/types';

/** Lista todos los usuarios (solo admin, §5). */
export function listUsers(): Promise<UserRead[]> {
  return apiFetch<UserRead[]>('/admin/users');
}

/** Actualiza un usuario (solo admin). */
export function updateUser(id: number, payload: AdminUserUpdate): Promise<UserRead> {
  return apiFetch<UserRead>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** Elimina un usuario (solo admin). */
export function deleteUser(id: number): Promise<void> {
  return apiSend(`/admin/users/${id}`, { method: 'DELETE' });
}
