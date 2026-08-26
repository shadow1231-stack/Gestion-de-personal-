import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthScreen } from '@/features/auth/AuthScreen';

const baseProps = {
  onLogin: vi.fn(),
  onRegister: vi.fn(),
  loading: false,
  error: null,
};

describe('AuthScreen', () => {
  it('muestra el formulario de login por defecto', () => {
    render(<AuthScreen {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('cambia a registro con el control segmentado', () => {
    render(<AuthScreen {...baseProps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Crear cuenta' }));
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
  });

  it('permite mostrar y ocultar la contraseña', () => {
    render(<AuthScreen {...baseProps} />);
    const password = screen.getByLabelText('Contraseña') as HTMLInputElement;
    expect(password.type).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(password.type).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(password.type).toBe('password');
  });
});
