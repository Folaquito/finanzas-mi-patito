import './App.css';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';
import Dashboard from './features/Dashboard';
import Login from './features/Login';
import Perfil from './features/Perfil';
import Placeholder from './features/Placeholder';
import Presupuesto from './features/Presupuesto';

const PLACEHOLDERS = {
  movimientos: 'Movimientos',
  metas: 'Metas',
  educacion: 'Aprende',
};

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  if (view === 'presupuesto') {
    return <Presupuesto onNavigate={setView} />;
  }
  if (view === 'perfil') {
    return <Perfil onNavigate={setView} />;
  }
  if (PLACEHOLDERS[view]) {
    return <Placeholder active={view} title={PLACEHOLDERS[view]} onNavigate={setView} />;
  }
  return <Dashboard onNavigate={setView} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
