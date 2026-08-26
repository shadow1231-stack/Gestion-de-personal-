import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserEditForm } from '@/features/admin/UserEditForm';
import type { Role, UserRead } from '@/features/auth/types';

const usuarioRole: Role = {
  id: 2,
  name: 'usuario',
  description: '',
  permissions: [],
  is_system: true,
  is_default: true,
};
const adminRole: Role = {
  id: 1,
  name: 'admin',
  description: '',
  permissions: ['users.manage', 'roles.manage'],
  is_system: true,
  is_default: false,
};

const user: UserRead = {
  id: 2,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  role: usuarioRole,
};

describe('UserEditForm', () => {
  it('guarda con el nombre y el rol editados', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <UserEditForm
        user={user}
        roles={[usuarioRole, adminRole]}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana María' } });
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        full_name: 'Ana María',
        email: 'ana@example.com',
        is_active: true,
        role_id: 1,
      }),
    );
  });

  it('cancela sin guardar', () => {
    const onCancel = vi.fn();
    render(<UserEditForm user={user} roles={[usuarioRole]} onSave={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
