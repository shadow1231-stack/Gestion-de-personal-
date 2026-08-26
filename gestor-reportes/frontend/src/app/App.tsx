import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { AdminScreen } from '@/features/admin/AdminScreen';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { useAuth } from '@/features/auth/useAuth';
import { ReportsScreen } from '@/features/reports/ReportsScreen';
import { VehiclesScreen } from '@/features/vehicles/VehiclesScreen';

type Tab = 'reports' | 'vehicles' | 'users';

/**
 * Componente raíz. Muestra la pantalla de autenticación o el panel con pestañas.
 * React escapa el texto por defecto: nunca dangerouslySetInnerHTML (§4 XSS).
 */
export function App() {
  const { isAuthenticated, isAdmin, currentUserId, loading, error, signIn, signUp, signOut } =
    useAuth();
  const [tab, setTab] = useState<Tab>('reports');

  if (!isAuthenticated) {
    return <AuthScreen onLogin={signIn} onRegister={signUp} loading={loading} error={error} />;
  }

  const activeTab: Tab = tab === 'users' && !isAdmin ? 'reports' : tab;

  return (
    <main className="container">
      <header className="app-header">
        <div>
          <h1>Gestor de Reportes</h1>
          <span className="subtitle">Personal y vehicular</span>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Salir
        </Button>
      </header>

      <nav className="tabs" aria-label="Secciones">
        <button
          type="button"
          className={activeTab === 'reports' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('reports')}
        >
          Reportes
        </button>
        <button
          type="button"
          className={activeTab === 'vehicles' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('vehicles')}
        >
          Vehículos
        </button>
        {isAdmin && (
          <button
            type="button"
            className={activeTab === 'users' ? 'tab tab-active' : 'tab'}
            onClick={() => setTab('users')}
          >
            Usuarios
          </button>
        )}
      </nav>

      {activeTab === 'reports' && <ReportsScreen />}
      {activeTab === 'vehicles' && <VehiclesScreen />}
      {activeTab === 'users' && <AdminScreen currentUserId={currentUserId} />}
    </main>
  );
}
