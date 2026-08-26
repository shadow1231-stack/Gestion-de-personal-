import { useState } from 'react';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import type { RegisterData } from '@/features/auth/types';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  loading: boolean;
  error: string | null;
}

const MIN_PASSWORD = 8;

/** Formulario de registro con validación local (§4 componente pequeño). */
export function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (): void => {
    if (password.length < MIN_PASSWORD) {
      setLocalError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`);
      return;
    }
    if (password !== confirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    setLocalError(null);
    onSubmit({ email, full_name: fullName, password });
  };

  const message = localError ?? error;

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2>Crear cuenta</h2>
      {message !== null && <Alert message={message} />}
      <TextField
        id="reg-email"
        label="Correo"
        type="email"
        value={email}
        onChange={setEmail}
        required
        placeholder="tu@correo.com"
      />
      <TextField
        id="reg-name"
        label="Nombre completo"
        value={fullName}
        onChange={setFullName}
        required
      />
      <TextField
        id="reg-password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        required
        placeholder="Mínimo 8 caracteres"
      />
      <TextField
        id="reg-confirm"
        label="Repetir contraseña"
        type="password"
        value={confirm}
        onChange={setConfirm}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creando…' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
