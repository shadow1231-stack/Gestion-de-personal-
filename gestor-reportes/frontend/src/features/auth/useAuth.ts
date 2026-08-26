import { useCallback, useState } from 'react';
import { ApiError, setAccessToken } from '@/shared/api/client';
import { login, register } from '@/features/auth/api';
import type { Credentials, RegisterData } from '@/features/auth/types';

interface AuthState {
  isAuthenticated: boolean;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyToken = useCallback((value: string | null): void => {
    setAccessToken(value);
    setToken(value);
  }, []);

  const signIn = useCallback(
    async (credentials: Credentials): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const data = await login(credentials);
        applyToken(data.access_token);
      } catch (err) {
        applyToken(null);
        setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
      } finally {
        setLoading(false);
      }
    },
    [applyToken],
  );

  const signUp = useCallback(
    async (data: RegisterData): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await register(data);
        const tokenData = await login({ email: data.email, password: data.password });
        applyToken(tokenData.access_token);
      } catch (err) {
        applyToken(null);
        setError(err instanceof ApiError ? err.message : 'No se pudo crear la cuenta');
      } finally {
        setLoading(false);
      }
    },
    [applyToken],
  );

  const signOut = useCallback((): void => {
    applyToken(null);
  }, [applyToken]);

  return { isAuthenticated: token !== null, loading, error, signIn, signUp, signOut };
}
