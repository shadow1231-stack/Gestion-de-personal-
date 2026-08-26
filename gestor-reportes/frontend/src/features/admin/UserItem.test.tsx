import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserItem } from '@/features/admin/UserItem';
import type { UserRead } from '@/features/auth/types';

const user: UserRead = {
  id: 2,
  email: 'ana@example.com',
  full_name: 'Ana Pérez',
  is_active: true,
  is_admin: false,
};

describe('UserItem', () => {
  it('muestra los datos y abre el formulario al editar', () => {
    render(<UserItem user={user} currentUserId={1} onSave={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('deshabilita eliminar en la propia cuenta', () => {
    render(<UserItem user={user} currentUserId={2} onSave={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeDisabled();
  });

  it('llama onDelete al eliminar a otro usuario', () => {
    const onDelete = vi.fn();
    render(<UserItem user={user} currentUserId={1} onSave={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalledWith(2);
  });
});
