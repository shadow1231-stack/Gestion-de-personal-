import { useCallback, useState } from 'react';
import { ApiError, setAccessToken } from '@/shared/api/client';
import { getCurrentUser, login, register } from '@/features/auth/api';
import type { Credentials, RegisterData, UserRead } from '@/features/auth/types';

interface AuthState {
  isAuthenticated: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  currentUserId: number | null;
  userName: string | null;
  roleName: string | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => void;
}

/**
 * Gestiona la sesión en memoria (§4: el JWT no se persiste en localStorage
 * para reducir la superficie de XSS; se pierde al recargar, por diseño).
 */
export function useAuth(): AuthState {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback((): void => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const establishSession = useCallback(async (accessToken: string): Promise<void> => {
    setAccessToken(accessToken);
    setToken(accessToken);
    setUser(await getCurrentUser());
  }, []);

  const signIn = useCallback(
    async (credentials: Credentials): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const data = await login(credentials);
        await establishSession(data.access_token);
      } catch (err) {
        reset();
        setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
      } finally {
        setLoading(false);
      }
    },
    [establishSession, reset],
  );

  const signUp = useCallback(
    async (data: RegisterData): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await register(data);
        const tokenData = await login({ email: data.email, password: data.password });
        await establishSession(tokenData.access_token);
      } catch (err) {
        reset();
        setError(err instanceof ApiError ? err.message : 'No se pudo crear la cuenta');
      } finally {
        setLoading(false);
      }
    },
    [establishSession, reset],
  );

  const signOut = useCallback((): void => {
    reset();
  }, [reset]);

  const permissions = user?.role.permissions ?? [];

  return {
    isAuthenticated: token !== null,
    permissions,
    hasPermission: (permission: string) => permissions.includes(permission),
    currentUserId: user?.id ?? null,
    userName: user?.full_name ?? null,
    roleName: user?.role.name ?? null,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}
