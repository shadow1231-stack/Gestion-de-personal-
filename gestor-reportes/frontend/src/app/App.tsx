import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { useAuth } from '@/features/auth/useAuth';
import { ReportsScreen } from '@/features/reports/ReportsScreen';
import { VehiclesScreen } from '@/features/vehicles/VehiclesScreen';

type Tab = 'reports' | 'vehicles';

/**
 * Componente raíz. Muestra la pantalla de autenticación o el panel con pestañas.
 * React escapa el texto por defecto: nunca dangerouslySetInnerHTML (§4 XSS).
 */
export function App() {
  const { isAuthenticated, loading, error, signIn, signUp, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('reports');

  if (!isAuthenticated) {
    return <AuthScreen onLogin={signIn} onRegister={signUp} loading={loading} error={error} />;
  }

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
          className={tab === 'reports' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('reports')}
        >
          Reportes
        </button>
        <button
          type="button"
          className={tab === 'vehicles' ? 'tab tab-active' : 'tab'}
          onClick={() => setTab('vehicles')}
        >
          Vehículos
        </button>
      </nav>

      {tab === 'reports' ? <ReportsScreen /> : <VehiclesScreen />}
    </main>
  );
}
