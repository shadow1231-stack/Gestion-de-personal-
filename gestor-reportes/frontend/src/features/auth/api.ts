import { apiFetch } from '@/shared/api/client';
import type { Credentials, RegisterData, TokenData, UserRead } from '@/features/auth/types';

/** Devuelve el usuario autenticado actual (§5). */
export function getCurrentUser(): Promise<UserRead> {
  return apiFetch<UserRead>('/auth/me');
}

/** Autentica al usuario y devuelve el token JWT (§5). */
export function login(credentials: Credentials): Promise<TokenData> {
  return apiFetch<TokenData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/** Registra un nuevo usuario (§5, ruta pública). */
export function register(data: RegisterData): Promise<UserRead> {
  return apiFetch<UserRead>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
