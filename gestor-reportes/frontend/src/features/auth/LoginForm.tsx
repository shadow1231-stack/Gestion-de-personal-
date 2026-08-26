import { useState } from 'react';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { Credentials } from '@/features/auth/types';

interface LoginFormProps {
  onSubmit: (credentials: Credentials) => void;
  loading: boolean;
  error: string | null;
}

/** Formulario de inicio de sesión (§4 componente pequeño, Mobile-First). */
export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
    >
      <h2>Iniciar sesión</h2>
      {error !== null && <Alert message={error} />}
      <TextField
        id="email"
        label="Correo"
        type="email"
        value={email}
        onChange={setEmail}
        required
        placeholder="tu@correo.com"
      />
      <TextField
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        required
        placeholder="••••••••"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
