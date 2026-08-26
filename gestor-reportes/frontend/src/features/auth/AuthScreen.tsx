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

/** Alterna entre inicio de sesión y registro (§1 compone la feature auth). */
export function AuthScreen({ onLogin, onRegister, loading, error }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <section>
      {mode === 'login' ? (
        <LoginForm onSubmit={onLogin} loading={loading} error={error} />
      ) : (
        <RegisterForm onSubmit={onRegister} loading={loading} error={error} />
      )}
      <p className="switch">
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          type="button"
          className="link"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Crear una' : 'Iniciar sesión'}
        </button>
      </p>
    </section>
  );
}
