import { useState } from 'react';
import { login as apiLogin, recuperarClave, registrar, resetClave } from '../api/auth';
import Patito from '../components/Patito';
import { Button } from '../components/ui';
import { useAuth } from '../context/auth-context';
import './auth.css';

function Field({ label, type = 'text', value, onChange, autoComplete, placeholder }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="field__input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
      />
    </label>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [modo, setModo] = useState('login'); // login | registro | recuperar
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [reset, setReset] = useState({ token: '', nuevaClave: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);

  const setCampo = (campo) => (valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const limpiarMensajes = () => {
    setError(null);
    setAviso(null);
  };

  const cambiarModo = (nuevoModo) => {
    limpiarMensajes();
    setReset({ token: '', nuevaClave: '' });
    setModo(nuevoModo);
  };

  const manejarError = (err) => setError(err?.message || 'Ocurrió un error. Intenta de nuevo.');

  const enviarLogin = async (event) => {
    event.preventDefault();
    limpiarMensajes();
    setLoading(true);
    try {
      const usuario = await apiLogin(form.email, form.password);
      login(usuario);
    } catch (err) {
      manejarError(err);
    } finally {
      setLoading(false);
    }
  };

  const enviarRegistro = async (event) => {
    event.preventDefault();
    limpiarMensajes();
    setLoading(true);
    try {
      await registrar(form);
      cambiarModo('login');
      setAviso('Cuenta creada. Ahora inicia sesión.');
    } catch (err) {
      manejarError(err);
    } finally {
      setLoading(false);
    }
  };

  const enviarRecuperar = async (event) => {
    event.preventDefault();
    limpiarMensajes();
    setLoading(true);
    try {
      const { token } = await recuperarClave(form.email);
      setReset({ token, nuevaClave: '' });
      setAviso('Generamos un token de recuperación. Úsalo para definir tu nueva contraseña.');
    } catch (err) {
      manejarError(err);
    } finally {
      setLoading(false);
    }
  };

  const enviarReset = async (event) => {
    event.preventDefault();
    limpiarMensajes();
    setLoading(true);
    try {
      await resetClave(reset.token, reset.nuevaClave);
      cambiarModo('login');
      setAviso('Contraseña restablecida. Inicia sesión con tu nueva clave.');
    } catch (err) {
      manejarError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__hero">
        <Patito size={120} stage={3} mood="happy" animate />
        <div className="auth__hero-title">mi patito</div>
        <p className="auth__hero-text">
          Ordena tus finanzas con la regla 50/30/20 y haz crecer a tu patito.
        </p>
      </div>

      <div className="auth__card">
        {modo === 'login' && (
          <form className="auth__form" onSubmit={enviarLogin}>
            <h1 className="auth__title">Inicia sesión</h1>
            <p className="auth__sub">Bienvenido de vuelta 🐤</p>
            <Field
              label="Correo"
              type="email"
              value={form.email}
              onChange={setCampo('email')}
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
            />
            <Field
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={setCampo('password')}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Button variant="duck" full type="submit" {...(loading ? { disabled: true } : {})}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>
            <div className="auth__links">
              <button type="button" className="link" onClick={() => cambiarModo('recuperar')}>
                ¿Olvidaste tu contraseña?
              </button>
              <button type="button" className="link" onClick={() => cambiarModo('registro')}>
                Crear cuenta
              </button>
            </div>
          </form>
        )}

        {modo === 'registro' && (
          <form className="auth__form" onSubmit={enviarRegistro}>
            <h1 className="auth__title">Crear cuenta</h1>
            <p className="auth__sub">Empieza a ordenar tus finanzas hoy.</p>
            <Field label="Nombre" value={form.nombre} onChange={setCampo('nombre')} autoComplete="name" />
            <Field
              label="Correo"
              type="email"
              value={form.email}
              onChange={setCampo('email')}
              autoComplete="email"
            />
            <Field
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={setCampo('password')}
              autoComplete="new-password"
            />
            <Field
              label="Teléfono (opcional)"
              value={form.telefono}
              onChange={setCampo('telefono')}
              autoComplete="tel"
            />
            <Button variant="duck" full type="submit" {...(loading ? { disabled: true } : {})}>
              {loading ? 'Creando…' : 'Crear cuenta'}
            </Button>
            <div className="auth__links">
              <button type="button" className="link" onClick={() => cambiarModo('login')}>
                Ya tengo cuenta
              </button>
            </div>
          </form>
        )}

        {modo === 'recuperar' && !reset.token && (
          <form className="auth__form" onSubmit={enviarRecuperar}>
            <h1 className="auth__title">Recuperar contraseña</h1>
            <p className="auth__sub">Te daremos un token para restablecerla.</p>
            <Field
              label="Correo"
              type="email"
              value={form.email}
              onChange={setCampo('email')}
              autoComplete="email"
            />
            <Button variant="duck" full type="submit" {...(loading ? { disabled: true } : {})}>
              {loading ? 'Generando…' : 'Generar token'}
            </Button>
            <div className="auth__links">
              <button type="button" className="link" onClick={() => cambiarModo('login')}>
                Volver a iniciar sesión
              </button>
            </div>
          </form>
        )}

        {modo === 'recuperar' && reset.token && (
          <form className="auth__form" onSubmit={enviarReset}>
            <h1 className="auth__title">Nueva contraseña</h1>
            <p className="auth__sub">Token generado (en producción llega por correo):</p>
            <code className="auth__token">{reset.token}</code>
            <Field
              label="Nueva contraseña"
              type="password"
              value={reset.nuevaClave}
              onChange={(valor) => setReset((prev) => ({ ...prev, nuevaClave: valor }))}
              autoComplete="new-password"
            />
            <Button variant="duck" full type="submit" {...(loading ? { disabled: true } : {})}>
              {loading ? 'Guardando…' : 'Restablecer contraseña'}
            </Button>
            <div className="auth__links">
              <button type="button" className="link" onClick={() => cambiarModo('login')}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {error && <div className="auth__msg auth__msg--error">{error}</div>}
        {aviso && <div className="auth__msg auth__msg--ok">{aviso}</div>}
      </div>
    </div>
  );
}
