import { useState } from 'react';
import { cambiarPassword } from '../api/auth';
import Shell from '../components/Shell';
import { Button, Card } from '../components/ui';
import { useAuth } from '../context/auth-context';
import { toShellUser } from '../utils/user';
import './auth.css';
import './perfil.css';

export default function Perfil({ onNavigate }) {
  const { user, logout } = useAuth();
  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);

  const enviar = async (event) => {
    event.preventDefault();
    setError(null);
    setAviso(null);
    setLoading(true);
    try {
      await cambiarPassword(user.email, claveActual, nuevaClave);
      setClaveActual('');
      setNuevaClave('');
      setAviso('Contraseña actualizada correctamente.');
    } catch (err) {
      setError(err?.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      active="perfil"
      user={toShellUser(user)}
      title="Mi perfil"
      subtitle="Datos de tu cuenta y seguridad"
      onNavigate={onNavigate}
    >
      <div className="perfil">
        <Card className="perfil__info">
          <div className="perfil__row">
            <span className="perfil__label">Nombre</span>
            <span className="perfil__value">{user.nombre}</span>
          </div>
          <div className="perfil__row">
            <span className="perfil__label">Correo</span>
            <span className="perfil__value">{user.email}</span>
          </div>
          {user.telefono && (
            <div className="perfil__row">
              <span className="perfil__label">Teléfono</span>
              <span className="perfil__value">{user.telefono}</span>
            </div>
          )}
          <Button variant="ghost" className="perfil__logout" onClick={logout}>
            Cerrar sesión
          </Button>
        </Card>

        <Card className="perfil__form-card">
          <h2 className="perfil__form-title">Cambiar contraseña</h2>
          <form className="auth__form perfil__form" onSubmit={enviar}>
            <label className="field">
              <span className="field__label">Contraseña actual</span>
              <input
                className="field__input"
                type="password"
                value={claveActual}
                onChange={(e) => setClaveActual(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Nueva contraseña</span>
              <input
                className="field__input"
                type="password"
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
            <Button variant="duck" full type="submit" {...(loading ? { disabled: true } : {})}>
              {loading ? 'Guardando…' : 'Actualizar contraseña'}
            </Button>
            {error && <div className="auth__msg auth__msg--error">{error}</div>}
            {aviso && <div className="auth__msg auth__msg--ok">{aviso}</div>}
          </form>
        </Card>
      </div>
    </Shell>
  );
}
