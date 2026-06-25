// Onboarding flow — connect first account + set income
// Steps: 1) hello 2) connect bank 3) confirm income 4) ready

function Onboarding({ go }) {
  const [step, setStep] = React.useState(1);
  const next = () => step < 4 ? setStep(step + 1) : go('dashboard');
  const back = () => step > 1 ? setStep(step - 1) : go('landing');

  return (
    <div style={{
      minHeight: '100%', background: T.bg, fontFamily: T.font.sans,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar w/ progress */}
      <div style={{ padding: '24px 48px', borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Patito size={28} stage={1}/>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>mi patito</span>
          </div>
          <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>Paso {step} de 4</span>
        </div>
        <div style={{
          maxWidth: 760, margin: '14px auto 0',
          height: 8, borderRadius: T.r.full, background: T.line, overflow: 'hidden',
        }}>
          <div style={{
            width: `${(step / 4) * 100}%`, height: '100%',
            background: T.duck, transition: 'width .35s ease',
          }}/>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px',
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          {step === 1 && <StepHello next={next}/>}
          {step === 2 && <StepBank next={next}/>}
          {step === 3 && <StepIncome next={next}/>}
          {step === 4 && <StepReady next={next}/>}
        </div>
      </div>

      {step > 1 && step < 4 && (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Button variant="ghost" size="sm" onClick={back}
            icon={<Icon name="arrow_left" size={16}/>}>Atrás</Button>
        </div>
      )}
    </div>
  );
}

function StepHello({ next }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <Patito size={130} stage={1} mood="happy" animate/>
      </div>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -1 }}>
        ¡Hola! Soy tu patito 🐣
      </h1>
      <p style={{ fontSize: 17, color: T.inkSoft, marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
        Antes de empezar, necesito saber cuánto ganas y dónde vive tu plata.
        Son 3 pasos rápidos. Después te dejo en paz, prometido.
      </p>
      <div style={{ marginTop: 30, display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Button variant="primary" size="lg" onClick={next}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          Empecemos
        </Button>
      </div>
    </div>
  );
}

function StepBank({ next }) {
  const [selected, setSelected] = React.useState(null);
  const banks = [
    { name: 'Banco Estado',    color: '#005DAA', logo: 'BE' },
    { name: 'Banco de Chile',  color: '#0033A0', logo: 'BC' },
    { name: 'Santander',       color: '#EC0000', logo: 'S' },
    { name: 'BCI',             color: '#1F3864', logo: 'BCI' },
    { name: 'Itaú',            color: '#FF6900', logo: 'I' },
    { name: 'Falabella',       color: '#A6CE39', logo: 'F' },
    { name: 'Scotiabank',      color: '#EC111A', logo: 'SC' },
    { name: 'Subir CSV',       color: T.ink,    logo: '+', csv: true },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -0.5, textAlign: 'center' }}>
        ¿Dónde vive tu plata?
      </h1>
      <p style={{ fontSize: 15, color: T.inkSoft, textAlign: 'center', margin: '8px auto 24px', maxWidth: 480 }}>
        Conecta tu cuenta principal o sube un CSV con tus movimientos. Solo lectura — nunca movemos plata sin tu permiso.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {banks.map((b, i) => (
          <Card key={i} padding={16} onClick={() => setSelected(b.name)}
            accent={selected === b.name ? T.duck : null}
            style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{
              width: 48, height: 48, borderRadius: T.r.md,
              background: b.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16, margin: '0 auto 8px',
            }}>{b.logo}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{b.name}</div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button variant="primary" size="lg" onClick={next}
          disabled={!selected}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          {selected ? `Conectar ${selected}` : 'Selecciona un banco'}
        </Button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <a onClick={next} style={{ fontSize: 13, color: T.muted, cursor: 'pointer', textDecoration: 'underline' }}>
          Saltar y configurar después
        </a>
      </div>
    </div>
  );
}

function StepIncome({ next }) {
  const [income, setIncome] = React.useState('850000');
  const num = parseInt(income.replace(/\D/g, '')) || 0;
  const need = Math.round(num * 0.5);
  const want = Math.round(num * 0.3);
  const save = Math.round(num * 0.2);
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -0.5, textAlign: 'center' }}>
        ¿Cuánto ganas al mes?
      </h1>
      <p style={{ fontSize: 15, color: T.inkSoft, textAlign: 'center', margin: '8px auto 24px', maxWidth: 480 }}>
        Tu sueldo líquido (lo que llega al banco). Lo usamos solo para calcular tu 50/30/20.
      </p>
      <div style={{ maxWidth: 360, margin: '0 auto 28px' }}>
        <Input
          label="Sueldo líquido mensual"
          value={income}
          onChange={e => setIncome(e.target.value)}
          prefix="$"
          suffix="CLP"
        />
      </div>

      <Card padding={20} style={{ background: T.surface }}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          Tu plan 50/30/20
        </div>
        {[
          { label: 'Necesidades', pct: 50, amt: need, color: T.ink, desc: 'arriendo, comida, servicios' },
          { label: 'Deseos',      pct: 30, amt: want, color: T.orange, desc: 'salir, suscripciones, antojos' },
          { label: 'Tu patito',   pct: 20, amt: save, color: T.duck, desc: 'ahorro, metas, fondo emergencia' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '10px 0',
            borderBottom: i < 2 ? `1px solid ${T.line}` : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: T.r.md,
              background: r.color, color: r.color === T.duck ? T.ink : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13, fontFamily: T.font.mono,
            }}>{r.pct}%</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{r.label}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{r.desc}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, fontFamily: T.font.mono }}>
              {fmtCLP(r.amt)}
            </div>
          </div>
        ))}
      </Card>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button variant="primary" size="lg" onClick={next}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          Confirmar plan
        </Button>
      </div>
    </div>
  );
}

function StepReady({ next }) {
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <ConfettiBurst active/>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <Patito size={140} stage={2} mood="celebrate" animate/>
      </div>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: -1 }}>
        ¡Tu patito ya está vivo! 🎉
      </h1>
      <p style={{ fontSize: 16, color: T.inkSoft, marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
        Conectamos tu cuenta y armamos tu plan. Ahora vamos a tu panel para ver
        cómo va el mes.
      </p>
      <div style={{ marginTop: 28 }}>
        <Button variant="primary" size="lg" onClick={next}
          iconRight={<Icon name="arrow_right" size={18}/>}>
          Ir a mi panel
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });
