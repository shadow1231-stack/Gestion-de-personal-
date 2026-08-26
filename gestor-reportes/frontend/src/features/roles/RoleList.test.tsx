import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoleList } from '@/features/roles/RoleList';
import type { Role } from '@/features/auth/types';

const role: Role = {
  id: 1,
  name: 'admin',
  description: 'Acceso total',
  permissions: ['users.manage', 'roles.manage'],
  is_system: true,
  is_default: false,
};

const handlers = { onSave: vi.fn(), onDelete: vi.fn() };

describe('RoleList', () => {
  it('muestra el estado vacío', () => {
    render(<RoleList roles={[]} catalog={[]} loading={false} error={null} {...handlers} />);
    expect(screen.getByText('No hay roles.')).toBeInTheDocument();
  });

  it('renderiza los roles y sus permisos', () => {
    render(<RoleList roles={[role]} catalog={[]} loading={false} error={null} {...handlers} />);
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('roles.manage')).toBeInTheDocument();
  });
});
