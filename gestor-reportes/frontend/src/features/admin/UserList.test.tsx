import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserList } from '@/features/admin/UserList';
import type { UserRead } from '@/features/auth/types';

const user: UserRead = {
  id: 1,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  is_admin: true,
};

const handlers = { onSave: vi.fn(), onDelete: vi.fn() };

describe('UserList', () => {
  it('muestra el estado vacío', () => {
    render(<UserList users={[]} currentUserId={1} loading={false} error={null} {...handlers} />);
    expect(screen.getByText(/No hay usuarios/)).toBeInTheDocument();
  });

  it('renderiza los usuarios recibidos', () => {
    render(
      <UserList users={[user]} currentUserId={1} loading={false} error={null} {...handlers} />,
    );
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  it('muestra el error cuando falla la carga', () => {
    render(<UserList users={[]} currentUserId={1} loading={false} error="Fallo" {...handlers} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo');
  });
});
