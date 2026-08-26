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

const FEATURES = [
  'Reportes personales y vehiculares en un solo lugar',
  'Acceso seguro con JWT y contraseñas cifradas',
  'Rápido, responsive y disponible siempre',
];

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

/** Pantalla de autenticación estilo SaaS: panel de marca + formulario (§4). */
export function AuthScreen({ onLogin, onRegister, loading, error }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <div className="auth-shell">
      <aside className="auth-hero">
        <div className="hero-top">
          <span className="hero-logo" aria-hidden="true">
            <svg
              width="22"
              height="22"
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
          </span>
          <span className="hero-brand">Gestor de Reportes</span>
        </div>

        <div>
          <h1 className="hero-title">Tus reportes, organizados y siempre a mano.</h1>
          <p className="hero-sub">
            Gestiona reportes personales y vehiculares con seguridad de nivel profesional.
          </p>
          <ul className="hero-features">
            {FEATURES.map((feature) => (
              <li key={feature}>
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="hero-foot">
          Construido con las directrices de calidad y seguridad de AGENTS.md.
        </p>
      </aside>

      <section className="auth-panel">
        <div className="auth-box">
          <div className="auth-panel-head">
            <h2>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
            <p>
              {mode === 'login' ? 'Inicia sesión para continuar' : 'Empieza en menos de un minuto'}
            </p>
          </div>

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
      </section>
    </div>
  );
}
