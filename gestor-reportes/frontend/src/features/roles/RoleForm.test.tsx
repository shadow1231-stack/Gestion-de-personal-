import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoleForm } from '@/features/roles/RoleForm';

const catalog = ['users.manage', 'roles.manage'];

describe('RoleForm', () => {
  it('crea un rol con nombre y permisos seleccionados', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RoleForm catalog={catalog} submitLabel="Crear rol" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Nombre del rol'), { target: { value: 'auditor' } });
    fireEvent.click(screen.getByLabelText('users.manage'));
    fireEvent.click(screen.getByRole('button', { name: 'Crear rol' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'auditor',
        description: '',
        permissions: ['users.manage'],
      }),
    );
  });
});
