import { apiFetch, apiSend } from '@/shared/api/client';
import type { UserRead } from '@/features/auth/types';
import type { AdminUserCreate, AdminUserUpdate } from '@/features/admin/types';

/** Lista todos los usuarios (permiso users.manage, §5). */
export function listUsers(): Promise<UserRead[]> {
  return apiFetch<UserRead[]>('/admin/users');
}

/** Crea un usuario con rol asignado (permiso users.manage). */
export function createUser(payload: AdminUserCreate): Promise<UserRead> {
  return apiFetch<UserRead>('/admin/users', { method: 'POST', body: JSON.stringify(payload) });
}

/** Actualiza un usuario (permiso users.manage). */
export function updateUser(id: number, payload: AdminUserUpdate): Promise<UserRead> {
  return apiFetch<UserRead>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** Elimina un usuario (permiso users.manage). */
export function deleteUser(id: number): Promise<void> {
  return apiSend(`/admin/users/${id}`, { method: 'DELETE' });
}
