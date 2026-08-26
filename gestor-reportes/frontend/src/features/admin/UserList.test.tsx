import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserList } from '@/features/admin/UserList';
import type { Role, UserRead } from '@/features/auth/types';

const role: Role = {
  id: 1,
  name: 'admin',
  description: '',
  permissions: ['users.manage'],
  is_system: true,
  is_default: false,
};

const user: UserRead = {
  id: 1,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  role,
};

const handlers = { onSave: vi.fn(), onDelete: vi.fn() };

describe('UserList', () => {
  it('muestra el estado vacío', () => {
    render(
      <UserList
        users={[]}
        roles={[role]}
        currentUserId={1}
        loading={false}
        error={null}
        {...handlers}
      />,
    );
    expect(screen.getByText(/No hay usuarios/)).toBeInTheDocument();
  });

  it('renderiza los usuarios recibidos', () => {
    render(
      <UserList
        users={[user]}
        roles={[role]}
        currentUserId={1}
        loading={false}
        error={null}
        {...handlers}
      />,
    );
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  it('muestra el error cuando falla la carga', () => {
    render(
      <UserList
        users={[]}
        roles={[role]}
        currentUserId={1}
        loading={false}
        error="Fallo"
        {...handlers}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo');
  });
});
