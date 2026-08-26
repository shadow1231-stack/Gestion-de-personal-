import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from '@/features/auth/RegisterForm';

function fill(email: string, name: string, password: string, confirm: string): void {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
  fireEvent.change(screen.getByLabelText('Repetir contraseña'), { target: { value: confirm } });
}

describe('RegisterForm', () => {
  it('envía los datos cuando son válidos', () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />);

    fill('a@b.com', 'Ana Pérez', 'secret123', 'secret123');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'a@b.com',
      full_name: 'Ana Pérez',
      password: 'secret123',
    });
  });

  it('bloquea si las contraseñas no coinciden', () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />);

    fill('a@b.com', 'Ana', 'secret123', 'otra12345');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByRole('alert')).toHaveTextContent('no coinciden');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('bloquea si la contraseña es muy corta', () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />);

    fill('a@b.com', 'Ana', '123', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByRole('alert')).toHaveTextContent('al menos 8 caracteres');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
