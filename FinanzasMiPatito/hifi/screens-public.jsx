// Public screens: Landing, Login, Register

function Landing({ go }) {
  return (
    <div style={{ minHeight: '100%', background: T.bg, fontFamily: T.font.sans }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px', maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Patito size={42} stage={2} mood="happy"/>
          <span style={{ fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>
            mi patito
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={() => go('login')}>Entrar</Button>
          <Button variant="dark" size="sm" onClick={() => go('register')}>Crear cuenta</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '20px 48px 40px',
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'center',
      }}>
        <div>
          <Pill bg={T.duckSoft} color={T.duckDark} size="md" style={{ marginBottom: 18 }}>
            🇨🇱 Hecho en Chile · gratis para siempre
          </Pill>
          <h1 style={{
            fontSize: 64, lineHeight: 1.02, fontWeight: 800,
            color: T.ink, margin: 0, letterSpacing: -1.5,
          }}>
            Ordena tu plata.<br/>
            <span style={{
              background: T.duck, padding: '0 12px',
              borderRadius: T.r.md, display: 'inline-block', transform: 'rotate(-1deg)',
            }}>Cría a tu patito.</span>
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.5, color: T.inkSoft, marginTop: 22, maxWidth: 460,
          }}>
            La regla 50/30/20 aplicada sola. Conectas tu sueldo, nosotros lo dividimos
            entre <b>necesidades</b>, <b>deseos</b> y <b>ahorro</b>. Tu patito crece con cada peso.
          </p>
          <div style={{ marginTop: 30, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => go('register')}
              iconRight={<Icon name="arrow_right" size={20}/>}>
              Adoptar mi patito
            </Button>
            <Button variant="ghost" size="lg" onClick={() => go('login')}>
              Ya tengo cuenta
            </Button>
          </div>
          <div style={{
            marginTop: 26, display: 'flex', alignItems: 'center', gap: 14,
            fontSize: 13, color: T.muted,
          }}>
            <div style={{ display: 'flex' }}>
              {['#FFB800', '#FF8A3D', '#3D8BFF', '#2FA86B'].map((bg, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: bg, border: '2px solid ' + T.surface,
                  marginLeft: i ? -8 : 0,
                }}/>
              ))}
            </div>
            <span><b style={{ color: T.ink }}>+1.200 personas</b> ya están criando patito</span>
          </div>
        </div>

        {/* Right: phone-like preview card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: T.surface, borderRadius: 28, padding: 22,
            boxShadow: T.shadow.pop, border: `2px solid ${T.ink}`,
            transform: 'rotate(2deg)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 16,
              fontSize: 12, color: T.muted, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase',
            }}>
              <span>Flujo del mes</span>
              <span>Abril 2026</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: T.ink, lineHeight: 1 }}>
              $290.000
            </div>
            <div style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>
              de holgura este mes 🐣
            </div>
            {/* fake bar */}
            <div style={{
              display: 'flex', height: 32, marginTop: 18,
              borderRadius: T.r.full, overflow: 'hidden',
              border: `2px solid ${T.ink}`,
            }}>
              <div style={{ width: '45%', background: T.ink, display: 'flex', alignItems: 'center', padding: '0 10px', color: '#fff', fontSize: 12, fontWeight: 700 }}>$380k</div>
              <div style={{ width: '20%', background: T.orange, display: 'flex', alignItems: 'center', padding: '0 10px', color: '#fff', fontSize: 12, fontWeight: 700 }}>$78k</div>
              <div style={{ width: '35%', background: T.duck, display: 'flex', alignItems: 'center', padding: '0 10px', color: T.ink, fontSize: 12, fontWeight: 700 }}>holgura</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 12 }}>
              <span style={{ color: T.muted }}>● Necesidades 45%</span>
              <span style={{ color: T.muted }}>● Deseos 9%</span>
            </div>
          </div>
          {/* Floating duck */}
          <div style={{
            position: 'absolute', bottom: -30, left: -30,
            background: T.duck, borderRadius: '50%', padding: 14,
            border: `3px solid ${T.ink}`, boxShadow: T.shadow.pop,
          }}>
            <Patito size={90} stage={3} mood="celebrate" animate/>
          </div>
        </div>
      </section>

      {/* Three roles */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '40px 48px 60px',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: T.ink, margin: '0 0 8px', letterSpacing: -0.5 }}>
          Tu plata tiene 3 trabajos.
        </h2>
        <p style={{ color: T.inkSoft, fontSize: 17, margin: '0 0 28px', maxWidth: 560 }}>
          Te los organizamos automáticamente. Tú decides cuándo abrir el chanchito.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { pct: '50%', title: 'Necesidades', body: 'Arriendo, luz, supermercado. Lo que mantiene la casa funcionando.', bg: T.surface, icon: '🏠' },
            { pct: '30%', title: 'Deseos',      body: 'Salir, antojos, suscripciones. Disfruta sin culpa, dentro del cupo.', bg: T.surface, icon: '🎉' },
            { pct: '20%', title: 'Tu patito',   body: 'Ahorro y metas. Lo que construye tu yo del próximo año.', bg: T.duck, icon: '🐣' },
          ].map((c, i) => (
            <Card key={i} padding={26} style={{ background: c.bg }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
              <div style={{
                fontSize: 48, fontWeight: 800, color: T.ink, lineHeight: 1,
                fontFamily: T.font.mono, letterSpacing: -2,
              }}>{c.pct}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, marginTop: 6 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
                {c.body}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.line}`, padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between',
        color: T.muted, fontSize: 13,
      }}>
        <span>© 2026 Finanzas Mi Patito · Duoc UC</span>
        <span>Privacidad · Términos · Contacto</span>
      </footer>
    </div>
  );
}

function AuthCard({ title, children, footer, side }) {
  return (
    <div style={{
      minHeight: '100%', background: T.bg, fontFamily: T.font.sans,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left: form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '40px 60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <Patito size={32} stage={2}/>
          <span style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>mi patito</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -0.8 }}>
          {title}
        </h1>
        <div style={{ marginTop: 24 }}>{children}</div>
        <div style={{ marginTop: 24, color: T.muted, fontSize: 14 }}>{footer}</div>
      </div>
      {/* Right: art */}
      <div style={{
        background: T.duck, padding: '40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 380 }}>
          <Patito size={200} stage={3} mood="happy" animate/>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, marginTop: 14, lineHeight: 1.1 }}>
            {side?.title || 'Tu patito te espera 👋'}
          </div>
          <div style={{ fontSize: 15, color: T.ink, marginTop: 8, opacity: 0.8 }}>
            {side?.body || 'Crea tu cuenta y aprende a domar tu sueldo en 3 minutos.'}
          </div>
        </div>
        {/* Decorative dots */}
        <svg style={{ position: 'absolute', inset: 0, opacity: .25 }} width="100%" height="100%">
          <pattern id="dotz" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill={T.ink}/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotz)"/>
        </svg>
      </div>
    </div>
  );
}

function Login({ go }) {
  const [email, setEmail] = React.useState('jfernandez@duocuc.cl');
  const [pwd, setPwd]     = React.useState('••••••••');
  return (
    <AuthCard
      title="Bienvenido de vuelta 🐣"
      side={{ title: 'Te extrañó este mes', body: 'Has ahorrado $170k de tu meta. Vamos por más.' }}
      footer={<>¿No tienes cuenta? <a onClick={() => go('register')} style={{ color: T.ink, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Crear una</a></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.cl"/>
        <Input label="Contraseña" type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          hint="Mínimo 8 caracteres"/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.inkSoft }}>
            <input type="checkbox" defaultChecked/> Recordarme
          </label>
          <a style={{ fontSize: 13, color: T.ink, fontWeight: 600, cursor: 'pointer' }}>¿Olvidaste tu clave?</a>
        </div>
        <Button variant="primary" size="lg" full onClick={() => go('dashboard')}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          Entrar
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: T.muted, fontSize: 12, margin: '6px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.line }}/>
          o continúa con
          <div style={{ flex: 1, height: 1, background: T.line }}/>
        </div>
        <Button variant="secondary" full size="md" onClick={() => go('dashboard')}>
          <span style={{ fontSize: 16, marginRight: 4 }}>G</span> Google
        </Button>
      </div>
    </AuthCard>
  );
}

function Register({ go }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const valid = name.length > 1 && email.includes('@') && pwd.length >= 8;
  return (
    <AuthCard
      title="Adopta tu huevito 🥚"
      side={{ title: 'En 30 segundos', body: 'Te asignamos tu huevito. Lo alimentas con cada ahorro y lo ves crecer.' }}
      footer={<>¿Ya tienes cuenta? <a onClick={() => go('login')} style={{ color: T.ink, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Entrar</a></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
        <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"/>
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.cl"/>
        <Input label="Contraseña" type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          hint={pwd.length === 0 ? 'Mínimo 8 caracteres' : pwd.length < 8 ? 'Faltan ' + (8 - pwd.length) + ' caracteres' : 'Buena contraseña 🔐'}/>
        <label style={{ fontSize: 12, color: T.inkSoft, display: 'flex', gap: 8, marginTop: 4 }}>
          <input type="checkbox" defaultChecked/>
          Acepto los términos y la política de privacidad.
        </label>
        <Button variant="primary" size="lg" full onClick={() => go('onboarding')}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          Crear cuenta y adoptar
        </Button>
      </div>
    </AuthCard>
  );
}

Object.assign(window, { Landing, Login, Register, AuthCard });
