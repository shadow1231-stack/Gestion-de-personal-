import { useState } from 'react';
import { AdminScreen } from '@/features/admin/AdminScreen';
import { RolesScreen } from '@/features/roles/RolesScreen';

interface AdminAreaProps {
  currentUserId: number | null;
  canManageUsers: boolean;
  canManageRoles: boolean;
}

type Section = 'users' | 'roles';

/** Área de administración unificada con sub-pestañas Usuarios / Roles (§1, §4). */
export function AdminArea({ currentUserId, canManageUsers, canManageRoles }: AdminAreaProps) {
  const sections: { key: Section; label: string }[] = [];
  if (canManageUsers) {
    sections.push({ key: 'users', label: 'Usuarios' });
  }
  if (canManageRoles) {
    sections.push({ key: 'roles', label: 'Roles' });
  }

  const [section, setSection] = useState<Section>(sections[0]?.key ?? 'users');
  const active = sections.some((s) => s.key === section) ? section : sections[0]?.key;

  return (
    <section>
      {sections.length > 1 && (
        <div className="segmented" role="tablist" aria-label="Administración">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={active === s.key}
              className={active === s.key ? 'active' : ''}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {active === 'users' && <AdminScreen currentUserId={currentUserId} />}
      {active === 'roles' && <RolesScreen />}
    </section>
  );
}
