/**
 * Cliente HTTP central. Adjunta el JWT de acceso en cada petición (§5)
 * y normaliza la respuesta {success, data, message}. Ningún secreto vive
 * aquí: el token lo aporta el usuario tras iniciar sesión (§4).
 */
import type { ApiResponse } from '@/shared/api/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new ApiError(body.message || 'Error de red', response.status);
  }
  if (body.data === null) {
    throw new ApiError('Respuesta sin datos', response.status);
  }
  return body.data;
}
