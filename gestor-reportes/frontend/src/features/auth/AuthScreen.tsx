import { useState } from 'react';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import type { Credentials, RegisterData } from '@/features/auth/types';

interface AuthScreenProps {
  onLogin: (credentials: Credentials) => void;
  onRegister: (data: RegisterData) => void;
  loading: boolean;
  error: string | null;
}

type Mode = 'login' | 'register';

/** Pantalla de autenticación con marca y control segmentado (§4 Mobile-First). */
export function AuthScreen({ onLogin, onRegister, loading, error }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <main className="auth">
      <div className="auth-brand">
        <div className="auth-logo" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1>Gestor de Reportes</h1>
        <p>Personal y vehicular</p>
      </div>

      <div className="auth-card">
        <div className="segmented" role="tablist" aria-label="Autenticación">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Crear cuenta
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm onSubmit={onLogin} loading={loading} error={error} />
        ) : (
          <RegisterForm onSubmit={onRegister} loading={loading} error={error} />
        )}
      </div>

      <p className="auth-hint">
        {mode === 'login'
          ? 'Ingresa con tu cuenta para gestionar tus reportes.'
          : 'Crea una cuenta nueva; entrarás automáticamente al registrarte.'}
      </p>
    </main>
  );
}
