import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserEditForm } from '@/features/admin/UserEditForm';
import type { UserRead } from '@/features/auth/types';

const user: UserRead = {
  id: 2,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  is_admin: false,
};

describe('UserEditForm', () => {
  it('guarda con los valores editados', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<UserEditForm user={user} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana María' } });
    fireEvent.click(screen.getByLabelText('Administrador'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        full_name: 'Ana María',
        email: 'ana@example.com',
        is_active: true,
        is_admin: true,
      }),
    );
  });

  it('cancela sin guardar', () => {
    const onCancel = vi.fn();
    render(<UserEditForm user={user} onSave={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
