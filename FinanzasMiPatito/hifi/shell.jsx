// App shell: sidebar + topbar
const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Inicio',       icon: 'home' },
  { id: 'movimientos', label: 'Movimientos',  icon: 'list' },
  { id: 'presupuesto', label: 'Presupuesto',  icon: 'pie' },
  { id: 'metas',       label: 'Metas',        icon: 'target' },
  { id: 'educacion',   label: 'Aprende',      icon: 'book' },
  { id: 'perfil',      label: 'Perfil',       icon: 'user' },
];

function Sidebar({ active, go }) {
  return (
    <aside style={{
      width: 230, padding: '22px 14px', background: T.surface,
      borderRight: `1px solid ${T.line}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: T.font.sans,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 16px' }}>
        <Patito size={36} stage={USUARIO.duck_stage} mood="happy"/>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, letterSpacing: -0.2 }}>mi patito</div>
          <div style={{ fontSize: 11, color: T.muted }}>v1.0</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => go(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', border: 'none', textAlign: 'left',
              background: active === item.id ? T.duck : 'transparent',
              color: T.ink, borderRadius: T.r.md,
              fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'background .12s',
            }}
            onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = T.bg; }}
            onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name={item.icon} size={18}/>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }}/>

      {/* Mini patito card */}
      <Card padding={14} style={{ background: T.bg, border: `1px dashed ${T.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Patito size={44} stage={USUARIO.duck_stage} mood="content"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Tu patito</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>Pato adulto</div>
          </div>
        </div>
        <div style={{
          height: 6, borderRadius: T.r.full, background: T.line, marginTop: 10, overflow: 'hidden',
        }}>
          <div style={{ width: USUARIO.duck_progress + '%', height: '100%', background: T.duck }}/>
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
          {USUARIO.duck_progress}% al Rey Pato 👑
        </div>
      </Card>
    </aside>
  );
}

function TopBar({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 32px', borderBottom: `1px solid ${T.line}`,
      background: T.surface,
    }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {action}
        <button style={{
          width: 38, height: 38, borderRadius: '50%',
          background: T.bg, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <Icon name="bell" size={18} color={T.ink}/>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%', background: T.red,
          }}/>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: T.duck, color: T.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, fontFamily: T.font.sans,
            border: `2px solid ${T.ink}`,
          }}>{USUARIO.initials}</div>
        </div>
      </div>
    </div>
  );
}

function Shell({ active, go, title, subtitle, action, children }) {
  return (
    <div style={{
      display: 'flex', height: '100%', minHeight: '100%',
      background: T.bg, fontFamily: T.font.sans,
    }}>
      <Sidebar active={active} go={go}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <TopBar title={title} subtitle={subtitle} action={action}/>
        <div style={{ padding: 32, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, Shell, NAV_ITEMS });
