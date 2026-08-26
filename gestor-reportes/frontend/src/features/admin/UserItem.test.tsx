import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserItem } from '@/features/admin/UserItem';
import type { Role, UserRead } from '@/features/auth/types';

const role: Role = {
  id: 2,
  name: 'usuario',
  description: 'Básico',
  permissions: [],
  is_system: true,
  is_default: true,
};

const user: UserRead = {
  id: 2,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  role,
};

describe('UserItem', () => {
  it('muestra los datos y abre el formulario al editar', () => {
    render(
      <UserItem user={user} roles={[role]} currentUserId={1} onSave={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('deshabilita eliminar en la propia cuenta', () => {
    render(
      <UserItem user={user} roles={[role]} currentUserId={2} onSave={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeDisabled();
  });

  it('llama onDelete al eliminar a otro usuario', () => {
    const onDelete = vi.fn();
    render(
      <UserItem
        user={user}
        roles={[role]}
        currentUserId={1}
        onSave={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalledWith(2);
  });
});
