import Icon from './Icon';
import Patito from './Patito';
import { Card } from './ui';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: 'home' },
  { id: 'movimientos', label: 'Movimientos', icon: 'list' },
  { id: 'presupuesto', label: 'Presupuesto', icon: 'pie' },
  { id: 'metas', label: 'Metas', icon: 'target' },
  { id: 'educacion', label: 'Aprende', icon: 'book' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
];

function Sidebar({ active, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Patito size={36} stage={user.duckStage} mood="happy" />
        <div>
          <div className="sidebar__title">mi patito</div>
          <div className="sidebar__subtitle">v1.0</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__link ${active === item.id ? 'is-active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__spacer" />

      <Card className="sidebar__card">
        <div className="sidebar__card-row">
          <Patito size={44} stage={user.duckStage} mood="content" />
          <div>
            <div className="sidebar__card-title">Tu patito</div>
            <div className="sidebar__card-subtitle">Pato adulto</div>
          </div>
        </div>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${user.duckProgress}%` }} />
        </div>
        <div className="sidebar__card-foot">{user.duckProgress}% al Rey Pato 👑</div>
      </Card>
    </aside>
  );
}

function TopBar({ title, subtitle, action, user }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="topbar__subtitle">{subtitle}</div>}
      </div>
      <div className="topbar__actions">
        {action}
        <button type="button" className="topbar__bell" aria-label="Notificaciones">
          <Icon name="bell" size={18} />
          <span className="topbar__dot" />
        </button>
        <div className="topbar__avatar">{user.initials}</div>
      </div>
    </div>
  );
}

export default function Shell({ active = 'dashboard', user, title, subtitle, action, children }) {
  return (
    <div className="shell">
      <Sidebar active={active} user={user} />
      <div className="shell__main">
        <TopBar title={title} subtitle={subtitle} action={action} user={user} />
        <div className="shell__content">
          <div className="mobile-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav__item ${active === item.id ? 'is-active' : ''}`}
                aria-current={active === item.id ? 'page' : undefined}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
