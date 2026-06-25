// Movimientos, Presupuesto, Metas, Educación, Perfil + TxModal

// ===== Modal =====
function Modal({ open, onClose, children, width = 480 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(45,42,38,.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, fontFamily: T.font.sans, animation: 'fade .2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.surface, borderRadius: T.r.xl, padding: 28,
        width, maxWidth: '90%', maxHeight: '90vh', overflow: 'auto',
        boxShadow: T.shadow.pop, position: 'relative',
        animation: 'pop .25s ease',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          width: 32, height: 32, borderRadius: '50%', border: 'none',
          background: T.bg, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="close" size={16}/></button>
        {children}
      </div>
    </div>
  );
}

// ===== Movimientos =====
function Movimientos({ go, openTx }) {
  const [filter, setFilter] = React.useState('TODOS');
  const [search, setSearch] = React.useState('');
  const filtered = TRANSACCIONES.filter(t => {
    const c = cat(t.categoria_id);
    if (filter !== 'TODOS' && c.tipo !== filter) return false;
    if (search && !t.descripcion.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <Shell active="movimientos" go={go} title="Movimientos" subtitle={`${TRANSACCIONES.length} transacciones · Abril 2026`}
      action={<Button variant="dark" size="sm" icon={<Icon name="plus" size={16}/>}>Nuevo</Button>}>
      <Card padding={0}>
        {/* Filters */}
        <div style={{ padding: 16, borderBottom: `1px solid ${T.line}`, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            border: `2px solid ${T.line}`, borderRadius: T.r.full, flex: 1, minWidth: 220,
          }}>
            <Icon name="search" size={16} color={T.muted}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar transacción..."
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: T.font.sans, fontSize: 14 }}/>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['TODOS', 'NECESIDAD', 'DESEO', 'AHORRO', 'INGRESO'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 14px', borderRadius: T.r.full,
                border: `2px solid ${filter === f ? T.ink : T.line}`,
                background: filter === f ? T.ink : T.surface,
                color: filter === f ? T.duck : T.ink,
                fontFamily: T.font.sans, fontWeight: 700, fontSize: 12,
                cursor: 'pointer',
              }}>{f === 'TODOS' ? 'Todos' : f.charAt(0) + f.slice(1).toLowerCase()}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 1fr 140px 130px 140px',
          padding: '12px 24px', fontSize: 11, color: T.muted, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', borderBottom: `1px solid ${T.line}`,
        }}>
          <span>Fecha</span><span>Descripción</span><span>Categoría</span><span>Tipo</span><span style={{ textAlign: 'right' }}>Monto</span>
        </div>
        {filtered.map((t, i) => {
          const c = cat(t.categoria_id);
          return (
            <div key={t.id} onClick={() => openTx(t)} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 140px 130px 140px',
              padding: '14px 24px', alignItems: 'center', cursor: 'pointer',
              borderBottom: i < filtered.length - 1 ? `1px solid ${T.line}` : 'none',
              transition: 'background .12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.bg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontSize: 12, color: T.muted, fontFamily: T.font.mono }}>{t.fecha.slice(8)}/04</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: T.r.sm, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{c.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{t.descripcion}</span>
              </div>
              <Pill size="sm" color={c.tipo === 'AHORRO' ? T.duckDark : c.tipo === 'NECESIDAD' ? T.ink : c.tipo === 'INGRESO' ? T.green : T.orange}
                bg={c.tipo === 'AHORRO' ? T.duckSoft : c.tipo === 'NECESIDAD' ? T.line : c.tipo === 'INGRESO' ? T.greenSoft : T.orangeSoft}>
                {c.nombre}
              </Pill>
              <span style={{ fontSize: 12, color: T.muted, fontFamily: T.font.mono }}>{t.tipo_movimiento}</span>
              <div style={{ textAlign: 'right', fontFamily: T.font.mono, fontSize: 14, fontWeight: 700, color: t.monto > 0 ? T.green : T.ink }}>
                {t.monto > 0 ? '+' : '-'}{fmtCLP(Math.abs(t.monto))}
              </div>
            </div>
          );
        })}
      </Card>
    </Shell>
  );
}

// ===== Tx detail modal =====
function TxModal({ tx, onClose }) {
  if (!tx) return null;
  const c = cat(tx.categoria_id);
  const cuenta = CUENTAS.find(x => x.id === tx.cuenta_id);
  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: T.r.md, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{c.icon}</div>
        <div>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{tx.tipo_movimiento}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginTop: 2 }}>{tx.descripcion}</div>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 44, fontWeight: 800, color: tx.monto > 0 ? T.green : T.ink, fontFamily: T.font.mono, letterSpacing: -1 }}>
        {tx.monto > 0 ? '+' : '-'}{fmtCLP(Math.abs(tx.monto))}
      </div>

      <div style={{ marginTop: 18, borderTop: `1px solid ${T.line}` }}>
        {[
          ['Fecha', tx.fecha],
          ['Cuenta', cuenta?.nombre + ' · ' + cuenta?.banco],
          ['Categoría', c.nombre + ' (' + c.tipo + ')'],
          tx.banco_origen && ['Banco origen', tx.banco_origen],
          tx.nombre_origen && ['Origen', tx.nombre_origen],
          tx.banco_destino && ['Banco destino', tx.banco_destino],
          tx.nombre_destino && ['Destino', tx.nombre_destino],
          tx.cuenta_destino && ['Cuenta destino', tx.cuenta_destino],
          tx.referencia && ['Referencia', tx.referencia],
        ].filter(Boolean).map(([k, v], i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '12px 0',
            borderBottom: `1px solid ${T.line}`, fontSize: 14,
          }}>
            <span style={{ color: T.muted }}>{k}</span>
            <span style={{ color: T.ink, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Button variant="secondary" size="md" full icon={<Icon name="edit" size={16}/>}>Recategorizar</Button>
        <Button variant="primary" size="md" full onClick={onClose}>Listo</Button>
      </div>
    </Modal>
  );
}

// ===== Presupuesto =====
function Presupuesto({ go }) {
  const [pcts, setPcts] = React.useState({ necesidad: 50, deseo: 30, ahorro: 20 });
  const total = pcts.necesidad + pcts.deseo + pcts.ahorro;
  const sueldo = PRESUPUESTO.ingreso_total;
  const adjust = (key, val) => {
    const v = parseInt(val);
    setPcts({ ...pcts, [key]: v });
  };
  return (
    <Shell active="presupuesto" go={go} title="Presupuesto" subtitle="Ajusta tu regla 50/30/20"
      action={<Button variant="primary" size="sm" icon={<Icon name="check" size={16}/>}>Guardar</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <Card padding={26}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Distribución mensual
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.ink, marginTop: 6, fontFamily: T.font.mono, letterSpacing: -1 }}>
            {fmtCLP(sueldo)} <span style={{ fontSize: 14, color: T.muted, fontWeight: 500 }}>de sueldo líquido</span>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
            {[
              { key: 'necesidad', label: 'Necesidades', desc: 'arriendo, comida, servicios, transporte', color: T.ink, bg: T.line },
              { key: 'deseo',     label: 'Deseos',      desc: 'restaurantes, suscripciones, compras', color: T.orange, bg: T.orangeSoft },
              { key: 'ahorro',    label: 'Ahorro 🐣',   desc: 'metas, fondo emergencia, inversión',    color: T.duck, bg: T.duckSoft },
            ].map(r => (
              <div key={r.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: T.muted, marginLeft: 10 }}>{r.desc}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: T.ink, fontFamily: T.font.mono }}>{pcts[r.key]}%</span>
                    <span style={{ fontSize: 14, color: T.muted, fontFamily: T.font.mono }}>· {fmtCLP(sueldo * pcts[r.key] / 100)}</span>
                  </div>
                </div>
                <input type="range" min="0" max="100" value={pcts[r.key]}
                  onChange={e => adjust(r.key, e.target.value)}
                  style={{
                    width: '100%', accentColor: r.color, height: 8,
                  }}/>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 18, padding: '12px 14px',
            background: total === 100 ? T.greenSoft : T.redSoft,
            border: `1.5px solid ${total === 100 ? T.green : T.red}`,
            borderRadius: T.r.md, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name={total === 100 ? 'check' : 'info'} size={18} color={total === 100 ? T.green : T.red}/>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
              {total === 100 ? 'Todo cuadra · 100%' : `Suma ${total}% — debe sumar 100%`}
            </span>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card padding={20}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 14 }}>Vista previa</div>
            <div style={{ display: 'flex', height: 32, borderRadius: T.r.full, overflow: 'hidden', border: `2px solid ${T.ink}` }}>
              <div style={{ width: pcts.necesidad + '%', background: T.ink }}/>
              <div style={{ width: pcts.deseo + '%', background: T.orange, borderLeft: `2px solid ${T.ink}` }}/>
              <div style={{ width: pcts.ahorro + '%', background: T.duck, borderLeft: `2px solid ${T.ink}` }}/>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: T.muted }}>
              Tu plan se aplica automáticamente a partir del próximo sueldo.
            </div>
          </Card>
          <Card padding={20} style={{ background: T.bg, border: `1px dashed ${T.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Patito size={48} stage={3} mood="content"/>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Recomendación</div>
            </div>
            <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.5 }}>
              Si recién partes, prueba con 50/30/20. Cuando agarres el ritmo,
              puedes subir tu ahorro al 25% — yo crezco más rápido 😉
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

// ===== Metas =====
function Metas({ go }) {
  const [showCreate, setShowCreate] = React.useState(false);
  return (
    <Shell active="metas" go={go} title="Metas" subtitle={`${METAS.filter(m=>!m.completada).length} activas · ${METAS.filter(m=>m.completada).length} completadas`}
      action={<Button variant="primary" size="sm" onClick={() => setShowCreate(true)} icon={<Icon name="plus" size={16}/>}>Nueva meta</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {METAS.map(m => {
          const pct = (m.monto_actual / m.monto_objetivo) * 100;
          const restante = m.monto_objetivo - m.monto_actual;
          return (
            <Card key={m.id} padding={22} hover>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: T.r.md, background: m.completada ? T.greenSoft : T.duckSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>{m.nombre}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {m.fecha_limite ? 'Plazo: ' + m.fecha_limite : 'Sin plazo'}
                    </div>
                  </div>
                </div>
                {m.completada && <Pill bg={T.greenSoft} color={T.green} size="sm" icon={<Icon name="check" size={12}/>}>Lista</Pill>}
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: T.ink, fontFamily: T.font.mono, letterSpacing: -0.5 }}>{fmtCLP(m.monto_actual)}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>de {fmtCLP(m.monto_objetivo)}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.completada ? T.green : T.duckDark, fontFamily: T.font.mono }}>{pct.toFixed(0)}%</div>
              </div>

              <div style={{ height: 10, borderRadius: T.r.full, background: T.line, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: m.completada ? T.green : T.duck }}/>
              </div>

              {!m.completada && (
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: T.muted }}>Faltan {fmtCLP(restante)}</span>
                  <Button variant="secondary" size="sm" icon={<Icon name="plus" size={14}/>}>Aportar</Button>
                </div>
              )}
            </Card>
          );
        })}

        {/* Add new card */}
        <Card padding={22} hover onClick={() => setShowCreate(true)}
          style={{ background: T.bg, border: `2px dashed ${T.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, cursor: 'pointer' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.duck, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={26} color={T.ink}/>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginTop: 12 }}>Crear nueva meta</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>el patito te ayuda a llegar</div>
        </Card>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} width={460}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginBottom: 4 }}>Nueva meta 🎯</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>
          Define qué quieres lograr y cuándo. Yo te ayudo a llegar.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre de la meta" placeholder="Ej. Vacaciones al sur" value="" onChange={()=>{}}/>
          <Input label="Monto objetivo" placeholder="800.000" value="" onChange={()=>{}} prefix="$" suffix="CLP"/>
          <Input label="Fecha límite (opcional)" placeholder="dic 2026" value="" onChange={()=>{}}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Ícono</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['🏖️','💻','🛟','📚','🚗','🏠','✈️','💍','🎓','🎁'].map(e => (
                <button key={e} style={{
                  width: 40, height: 40, borderRadius: T.r.md, fontSize: 20,
                  border: `2px solid ${T.line}`, background: T.surface, cursor: 'pointer',
                }}>{e}</button>
              ))}
            </div>
          </div>
          <Button variant="primary" size="md" full onClick={() => setShowCreate(false)}>
            Crear meta
          </Button>
        </div>
      </Modal>
    </Shell>
  );
}

// ===== Educación =====
function Educacion({ go }) {
  return (
    <Shell active="educacion" go={go} title="Aprende con tu patito" subtitle="Lecciones rápidas para domar tu plata">
      <Card padding={26} style={{ background: T.duckSoft, border: `2px solid ${T.ink}`, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Patito size={100} stage={4} mood="celebrate" animate/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.duckDark, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Ruta de aprendizaje</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.ink, marginTop: 4, letterSpacing: -0.5 }}>
              Domando mi plata · 1 de 5
            </div>
            <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
              5 lecciones cortas. Una por semana. Termina y desbloqueas el modo Rey Pato 👑
            </div>
            <div style={{ height: 8, borderRadius: T.r.full, background: T.surface, marginTop: 12, overflow: 'hidden', border: `1.5px solid ${T.ink}` }}>
              <div style={{ width: '20%', height: '100%', background: T.ink }}/>
            </div>
          </div>
          <Button variant="dark" size="md">Continuar</Button>
        </div>
      </Card>

      <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Tips del patito</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {TIPS.map((t, i) => (
          <Card key={t.id} padding={20} hover>
            <div style={{ width: 50, height: 50, borderRadius: T.r.md, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{t.icon}</div>
            <Pill bg={T.bg} color={T.muted} size="sm" style={{ marginTop: 12 }}>{t.tag} · {t.mins} min</Pill>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, marginTop: 8, letterSpacing: -0.2, lineHeight: 1.2 }}>{t.titulo}</div>
            <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 6, lineHeight: 1.4 }}>{t.resumen}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, color: T.ink, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Leer <Icon name="arrow_right" size={14}/>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

// ===== Perfil =====
function Perfil({ go }) {
  return (
    <Shell active="perfil" go={go} title="Perfil y cuentas" subtitle="Tu información, cuentas conectadas y ajustes">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 }}>
        <Card padding={26}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: T.duck, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, border: `3px solid ${T.ink}` }}>
              {USUARIO.initials}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginTop: 14 }}>{USUARIO.nombre}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{USUARIO.email}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{USUARIO.telefono}</div>
            <Button variant="secondary" size="sm" style={{ marginTop: 14 }} icon={<Icon name="edit" size={14}/>}>Editar perfil</Button>
            <div style={{ marginTop: 22, padding: 16, background: T.bg, borderRadius: T.r.md, width: '100%' }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Tu patito</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <Patito size={50} stage={USUARIO.duck_stage}/>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Pato adulto</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Racha: {USUARIO.racha_meses} meses 🔥</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card padding={22}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Cuentas conectadas</div>
              <Button variant="ghost" size="sm" icon={<Icon name="plus" size={14}/>}>Agregar</Button>
            </div>
            {CUENTAS.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderTop: i ? `1px solid ${T.line}` : 'none',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: c.tipo === 'AHORRO' ? T.duck : T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={c.tipo === 'AHORRO' ? 'egg' : 'bank'} size={18} color={T.ink}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{c.nombre}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{c.banco} · {c.tipo}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: T.font.mono }}>{fmtCLP(c.saldo)}</div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Icon name="chevron_right" size={18} color={T.muted}/>
                </button>
              </div>
            ))}
          </Card>

          <Card padding={22}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Ajustes</div>
            {[
              { name: 'Notificaciones',   desc: 'Alertas de presupuesto, metas y patito', icon: 'bell' },
              { name: 'Privacidad',       desc: 'Quién ve tus datos',                     icon: 'settings' },
              { name: 'Exportar datos',   desc: 'Descarga CSV de tus movimientos',        icon: 'card' },
              { name: 'Cerrar sesión',    desc: 'Volveremos a verte pronto',              icon: 'logout', danger: true },
            ].map((s, i) => (
              <div key={i} onClick={() => s.danger && go('landing')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderTop: i ? `1px solid ${T.line}` : 'none', cursor: 'pointer',
                }}>
                <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: s.danger ? T.redSoft : T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={16} color={s.danger ? T.red : T.ink}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.danger ? T.red : T.ink }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{s.desc}</div>
                </div>
                <Icon name="chevron_right" size={18} color={T.muted}/>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { Movimientos, TxModal, Modal, Presupuesto, Metas, Educacion, Perfil });
