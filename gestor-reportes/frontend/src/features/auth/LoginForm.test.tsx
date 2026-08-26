import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/features/auth/LoginForm';

describe('LoginForm', () => {
  it('envía las credenciales ingresadas', () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} loading={false} error={null} />);

    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret123' });
  });

  it('muestra el mensaje de error', () => {
    render(<LoginForm onSubmit={vi.fn()} loading={false} error="Credenciales inválidas" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });
});
