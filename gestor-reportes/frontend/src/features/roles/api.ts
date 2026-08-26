import { apiFetch, apiSend } from '@/shared/api/client';
import type { Role } from '@/features/auth/types';
import type { RoleCreate, RoleUpdate } from '@/features/roles/types';

/** Lista los roles (permiso users.manage o roles.manage, §5). */
export function listRoles(): Promise<Role[]> {
  return apiFetch<Role[]>('/admin/roles');
}

/** Catálogo de permisos disponibles (permiso roles.manage). */
export function listPermissions(): Promise<string[]> {
  return apiFetch<string[]>('/admin/permissions');
}

export function createRole(payload: RoleCreate): Promise<Role> {
  return apiFetch<Role>('/admin/roles', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateRole(id: number, payload: RoleUpdate): Promise<Role> {
  return apiFetch<Role>(`/admin/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteRole(id: number): Promise<void> {
  return apiSend(`/admin/roles/${id}`, { method: 'DELETE' });
}
