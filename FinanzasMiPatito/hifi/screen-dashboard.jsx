// Dashboard — Home con holgura
function Dashboard({ go, openTx }) {
  const [showWin, setShowWin] = React.useState(false);
  const p = PRESUPUESTO;
  const totalGastado = p.gastado.necesidad + p.gastado.deseo + p.gastado.ahorro;
  const holgura = p.ingreso_total - totalGastado;
  const recent = TRANSACCIONES.slice().sort((a,b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);

  return (
    <Shell active="dashboard" go={go}
      title="Hola, Joaquín 👋"
      subtitle="Abril 2026 · día 15 de 30"
      action={<Button variant="dark" size="sm" icon={<Icon name="plus" size={16}/>}>Movimiento</Button>}>

      {/* Hero — Flujo del mes */}
      <Card padding={26} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Flujo del mes · Abril 2026
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: T.ink, letterSpacing: -1.5, lineHeight: 1 }}>
                {fmtCLP(holgura)}
              </div>
              <div style={{ fontSize: 16, color: T.muted }}>de holgura este mes</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: .8, textTransform: 'uppercase' }}>Gastado</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontFamily: T.font.mono, marginTop: 2 }}>{fmtCLP(totalGastado)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: .8, textTransform: 'uppercase' }}>Ingreso</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontFamily: T.font.mono, marginTop: 2 }}>{fmtCLP(p.ingreso_total)}</div>
            </div>
          </div>
        </div>

        {/* Stacked bar */}
        <div style={{
          display: 'flex', height: 38,
          borderRadius: T.r.full, overflow: 'hidden',
          border: `2px solid ${T.ink}`,
        }}>
          {[
            { w: (p.gastado.necesidad / p.ingreso_total) * 100, bg: T.ink,    fg: '#fff',  label: fmtK(p.gastado.necesidad) },
            { w: (p.gastado.deseo     / p.ingreso_total) * 100, bg: T.orange, fg: '#fff',  label: fmtK(p.gastado.deseo) },
            { w: (p.gastado.ahorro    / p.ingreso_total) * 100, bg: T.duck,   fg: T.ink,   label: fmtK(p.gastado.ahorro) },
            { w: (holgura             / p.ingreso_total) * 100, bg: T.greenSoft, fg: T.ink, label: fmtK(holgura) + ' libre' },
          ].map((s, i) => (
            <div key={i} style={{
              width: s.w + '%', background: s.bg, color: s.fg,
              display: 'flex', alignItems: 'center', padding: '0 12px',
              fontSize: 13, fontWeight: 700, fontFamily: T.font.sans,
              borderLeft: i ? `2px solid ${T.ink}` : 'none',
            }}>{s.label}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 22, marginTop: 12, fontSize: 13, color: T.inkSoft, flexWrap: 'wrap' }}>
          {[
            { c: T.ink,    n: 'Necesidades', pct: (p.gastado.necesidad/p.ingreso_total*100).toFixed(0) },
            { c: T.orange, n: 'Deseos',      pct: (p.gastado.deseo/p.ingreso_total*100).toFixed(0) },
            { c: T.duck,   n: 'Ahorro 🐣',   pct: (p.gastado.ahorro/p.ingreso_total*100).toFixed(0) },
            { c: T.greenSoft, n: 'Holgura libre', pct: (holgura/p.ingreso_total*100).toFixed(0) },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: l.c, border: `1px solid ${T.ink}`, borderRadius: 2 }}/>
              <span>{l.n} · <b>{l.pct}%</b></span>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
        {[
          { name: 'Necesidades', gastado: p.gastado.necesidad, total: p.presupuestado.necesidad, color: T.ink, bg: T.surface, pct: 50 },
          { name: 'Deseos',      gastado: p.gastado.deseo,     total: p.presupuestado.deseo,     color: T.orange, bg: T.surface, pct: 30 },
          { name: 'Ahorro',      gastado: p.gastado.ahorro,    total: p.presupuestado.ahorro,    color: T.duck, bg: T.duckSoft, pct: 20, good: true },
        ].map((b, i) => {
          const usedPct = (b.gastado / b.total) * 100;
          const restante = b.total - b.gastado;
          return (
            <Card key={i} padding={20} style={{ background: b.bg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{b.name}</div>
                <Pill bg={b.color === T.duck ? T.surface : T.bg} color={b.color} size="sm">meta {b.pct}%</Pill>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.ink, fontFamily: T.font.mono, marginTop: 8, letterSpacing: -0.5 }}>
                {fmtCLP(b.gastado)}
                <span style={{ fontSize: 14, color: T.muted, fontWeight: 500 }}> / {fmtK(b.total)}</span>
              </div>
              <div style={{ height: 8, borderRadius: T.r.full, background: T.line, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: Math.min(usedPct, 100) + '%', height: '100%', background: b.color }}/>
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>
                {b.good ? '🎉 ¡meta cumplida este mes!' : `quedan ${fmtCLP(restante)} para 15 días`}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.3fr', gap: 16 }}>
        {/* Cuentas */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Mis cuentas</div>
            <a onClick={() => go('perfil')} style={{ fontSize: 12, color: T.muted, cursor: 'pointer', textDecoration: 'underline' }}>ver todas</a>
          </div>
          {CUENTAS.map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0',
              borderTop: i ? `1px solid ${T.line}` : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: T.r.sm,
                background: c.tipo === 'AHORRO' ? T.duck : T.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={c.tipo === 'AHORRO' ? 'egg' : 'card'} size={16} color={T.ink}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{c.banco}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: T.font.mono }}>{fmtCLP(c.saldo)}</div>
            </div>
          ))}
          <div style={{ borderTop: `2px solid ${T.ink}`, paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.font.mono }}>{fmtCLP(CUENTAS.reduce((a,c) => a+c.saldo, 0))}</span>
          </div>
        </Card>

        {/* Metas */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Metas activas</div>
            <a onClick={() => go('metas')} style={{ fontSize: 12, color: T.muted, cursor: 'pointer', textDecoration: 'underline' }}>ver todas</a>
          </div>
          {METAS.filter(m => !m.completada).slice(0, 3).map((m, i) => {
            const pct = (m.monto_actual / m.monto_objetivo) * 100;
            return (
              <div key={m.id} style={{
                padding: '10px 0',
                borderTop: i ? `1px solid ${T.line}` : 'none',
                cursor: 'pointer',
              }} onClick={() => go('metas')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{m.nombre}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.muted, fontFamily: T.font.mono }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: T.r.full, background: T.line, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: T.duck }}/>
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                  {fmtCLP(m.monto_actual)} de {fmtCLP(m.monto_objetivo)}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Recent transactions */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Movimientos recientes</div>
            <a onClick={() => go('movimientos')} style={{ fontSize: 12, color: T.muted, cursor: 'pointer', textDecoration: 'underline' }}>ver todos →</a>
          </div>
          {recent.map((t, i) => {
            const c = cat(t.categoria_id);
            return (
              <div key={t.id} onClick={() => openTx(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', cursor: 'pointer',
                  borderTop: i ? `1px solid ${T.line}` : 'none',
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: T.r.sm,
                  background: T.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14,
                }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.descripcion}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{t.fecha.slice(8)} abr · {c.tipo}</div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700, fontFamily: T.font.mono,
                  color: t.monto > 0 ? T.green : T.ink,
                }}>{t.monto > 0 ? '+' : '-'}{fmtCLP(Math.abs(t.monto))}</div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Patito tip */}
      <Card padding={18} style={{ marginTop: 18, background: T.duckSoft, border: `2px solid ${T.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Patito size={70} stage={3} mood="thinking"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.duckDark, fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase' }}>Patito dice</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginTop: 2, lineHeight: 1.4 }}>
              Vas al 89% en Necesidades y quedan 15 días. Si te cuidas en supermercado esta quincena,
              puedes mover $20k extra a tu meta de vacaciones 🏖️
            </div>
          </div>
          <Button variant="dark" size="sm" onClick={() => go('educacion')}>Ver más tips</Button>
        </div>
      </Card>
    </Shell>
  );
}

Object.assign(window, { Dashboard });
