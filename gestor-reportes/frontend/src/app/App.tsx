import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { AdminArea } from '@/features/admin/AdminArea';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { useAuth } from '@/features/auth/useAuth';
import { ReportsScreen } from '@/features/reports/ReportsScreen';
import { VehiclesScreen } from '@/features/vehicles/VehiclesScreen';

type Tab = 'reports' | 'vehicles' | 'admin';

interface NavItem {
  key: Tab;
  label: string;
}

/**
 * Componente raíz. Autenticación a pantalla completa o panel SaaS con sidebar.
 * React escapa el texto por defecto: nunca dangerouslySetInnerHTML (§4 XSS).
 */
export function App() {
  const auth = useAuth();
  const [tab, setTab] = useState<Tab>('reports');

  if (!auth.isAuthenticated) {
    return (
      <AuthScreen
        onLogin={auth.signIn}
        onRegister={auth.signUp}
        loading={auth.loading}
        error={auth.error}
      />
    );
  }

  const canManageUsers = auth.hasPermission('users.manage');
  const canManageRoles = auth.hasPermission('roles.manage');
  const canAdminister = canManageUsers || canManageRoles;

  const nav: NavItem[] = [
    { key: 'reports', label: 'Reportes' },
    { key: 'vehicles', label: 'Vehículos' },
    ...(canAdminister ? [{ key: 'admin' as const, label: 'Administración' }] : []),
  ];

  const activeTab: Tab = nav.some((item) => item.key === tab) ? tab : 'reports';
  const activeLabel = nav.find((item) => item.key === activeTab)?.label ?? '';

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo" aria-hidden="true">
            GR
          </span>
          <span>Gestor de Reportes</span>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {nav.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeTab === item.key ? 'nav-link nav-link-active' : 'nav-link'}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="who">
            <strong>{auth.userName}</strong>
            <span>{auth.roleName}</span>
          </div>
          <Button variant="ghost" onClick={auth.signOut}>
            Salir
          </Button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <h1>{activeLabel}</h1>
        </header>
        <div className="content-body">
          {activeTab === 'reports' && <ReportsScreen />}
          {activeTab === 'vehicles' && <VehiclesScreen />}
          {activeTab === 'admin' && (
            <AdminArea
              currentUserId={auth.currentUserId}
              canManageUsers={canManageUsers}
              canManageRoles={canManageRoles}
            />
          )}
        </div>
      </div>
    </div>
  );
}
