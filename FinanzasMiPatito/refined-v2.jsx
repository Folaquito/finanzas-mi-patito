// Round 2 — refined directions based on feedback
// Landing: combines V1 (hero dividido) + V4 (huevito evolution)
// Dashboard: inspired by reference image (flow of the month w/ holgura bar)
// All using real DB entities: cuentas, categorias, transacciones, metas

// ============= REFINED LANDING — Hero + Evolution =============
function LandingRefined() {
  return (
    <div style={variantFrame}>
      {/* nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 28px', borderBottom: `1.5px dashed ${RULE}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SketchDuck size={32} stage={2}/>
          <Handwritten size={20} bold>Finanzas Mi Patito</Handwritten>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Body size={13}>Cómo funciona</Body>
          <Body size={13}>Precios</Body>
          <Body size={13} style={{ textDecoration: 'underline' }}>Entrar</Body>
        </div>
      </div>

      {/* hero split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 32, padding: '32px 36px 18px' }}>
        <div>
          <Handwritten size={42} bold style={{ display: 'block', lineHeight: 1.05 }}>
            Ordena tu plata.
          </Handwritten>
          <Handwritten size={42} style={{ display: 'block', lineHeight: 1.05, color: '#555' }}>
            Cría a tu patito.
          </Handwritten>
          <Body size={14} style={{ display: 'block', maxWidth: 360, color: '#444', marginTop: 10 }}>
            La regla 50/30/20 aplicada sola. Ahorras de a poco, tu patito crece de huevito a rey.
          </Body>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            <SketchBox style={{
              background: DUCK, padding: '8px 18px', boxShadow: '3px 3px 0 ' + INK,
            }}>
              <Handwritten size={20} bold>Adoptar mi patito →</Handwritten>
            </SketchBox>
            <Body size={12} style={{ color: '#888' }}>
              gratis · sin tarjeta
            </Body>
          </div>

          {/* mini evolution strip */}
          <div style={{
            marginTop: 24, padding: '10px 0',
            borderTop: `1.5px dashed ${RULE}`, borderBottom: `1.5px dashed ${RULE}`,
          }}>
            <Body size={11} style={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Así evoluciona
            </Body>
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 4 }}>
              {[
                { stage: 1, label: 'Huevo',  sub: '$0' },
                { stage: 2, label: 'Patito', sub: '$50k' },
                { stage: 3, label: 'Pato',   sub: '$500k' },
                { stage: 4, label: 'Rey',    sub: '$2M+' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', position: 'relative', flex: 1 }}>
                  <SketchDuck size={42 + i*4} stage={s.stage} gold={s.stage === 4}/>
                  <Body size={11} style={{ display: 'block', fontWeight: 700 }}>{s.label}</Body>
                  <Body size={10} style={{ display: 'block', color: '#888' }}>{s.sub}</Body>
                  {i < 3 && (
                    <svg width="14" height="8" viewBox="0 0 14 8" style={{ position: 'absolute', right: -8, top: 22 }}>
                      <path d="M1 4 L 11 4" stroke={INK} strokeWidth="1.2" strokeDasharray="2 2"/>
                      <path d="M9 1 L 12 4 L 9 7" stroke={INK} strokeWidth="1.2" fill="none"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: auth card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <SketchBox style={{ width: 300, padding: 20, transform: 'rotate(1.5deg)' }}>
            <Handwritten size={22} bold style={{ display: 'block', marginBottom: 12 }}>
              Adoptar huevito
            </Handwritten>
            <Body size={11} style={{ color: '#666', display: 'block', marginBottom: 4 }}>Email</Body>
            <div style={{
              border: `1.5px solid ${INK}`, height: 30, borderRadius: 4,
              marginBottom: 10, padding: '4px 8px', background: '#fff',
            }}>
              <WigglyLine width={220} color="#aaa"/>
            </div>
            <Body size={11} style={{ color: '#666', display: 'block', marginBottom: 4 }}>Contraseña</Body>
            <div style={{
              border: `1.5px solid ${INK}`, height: 30, borderRadius: 4,
              marginBottom: 16, padding: '6px 8px', background: '#fff',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: INK }}/>
              ))}
            </div>
            <SketchBox style={{
              background: INK, padding: '6px 0', textAlign: 'center',
              boxShadow: '2px 2px 0 ' + DUCK, marginBottom: 10,
            }}>
              <Handwritten size={18} bold style={{ color: DUCK }}>Empezar</Handwritten>
            </SketchBox>
            <div style={{ textAlign: 'center', margin: '6px 0' }}>
              <Body size={11} style={{ color: '#888' }}>— o —</Body>
            </div>
            <div style={{
              border: `1.5px solid ${INK}`, padding: '5px 0', textAlign: 'center',
              borderRadius: 4,
            }}>
              <Body size={12}>Continuar con Google</Body>
            </div>
            <Body size={11} style={{ color: '#888', display: 'block', textAlign: 'center', marginTop: 10 }}>
              ¿ya tienes cuenta? <span style={{ textDecoration: 'underline', color: INK }}>entrar</span>
            </Body>
          </SketchBox>

          <div style={{ position: 'absolute', bottom: -18, left: 8 }}>
            <SketchDuck size={70} stage={2}/>
          </div>
        </div>
      </div>

      {/* bottom strip — social proof */}
      <div style={{
        padding: '10px 36px', borderTop: `1.5px solid ${INK}`, background: DUCK,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Body size={12}><strong>+1.200 personas</strong> ya están criando patito</Body>
        <span style={{ color: '#555' }}>·</span>
        <Body size={12}>★★★★★ 4.8 · 240 reviews</Body>
        <span style={{ color: '#555' }}>·</span>
        <Body size={12}>hecho en Chile 🇨🇱</Body>
      </div>
    </div>
  );
}

// ============= REFINED DASHBOARD — Holgura del mes =============
// Inspired by reference: big "holgura" number + horizontal stacked flow bar
// Adapted to 50/30/20 with sketchy patito style

function HolguraBar({ necesidades, deseos, ahorro, total, height = 26 }) {
  const pN = (necesidades / total) * 100;
  const pD = (deseos / total) * 100;
  const pA = (ahorro / total) * 100;
  return (
    <div style={{ display: 'flex', height, border: `2px solid ${INK}`, boxShadow: '3px 3px 0 ' + INK, background: '#fff' }}>
      <div style={{
        width: `${pN}%`, background: INK, color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontFamily: 'Kalam', fontSize: 11, fontWeight: 700,
      }}>${(necesidades/1000).toFixed(0)}k</div>
      <div style={{
        width: `${pD}%`, background: '#888', color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontFamily: 'Kalam', fontSize: 11, fontWeight: 700,
        borderLeft: `1.5px solid ${INK}`,
      }}>${(deseos/1000).toFixed(0)}k</div>
      <div style={{
        width: `${pA}%`, background: DUCK, color: INK,
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontFamily: 'Kalam', fontSize: 11, fontWeight: 700,
        borderLeft: `1.5px solid ${INK}`,
      }}>${(ahorro/1000).toFixed(0)}k</div>
    </div>
  );
}

function DashboardHolgura() {
  // Real DB-shape data
  const sueldo = 850000;
  const necesidades_gastado = 380000;
  const necesidades_total   = 425000;
  const deseos_gastado      = 180000;
  const deseos_total        = 255000;
  const ahorro_gastado      = 170000;
  const ahorro_total        = 170000;
  const total_gastado = necesidades_gastado + deseos_gastado + ahorro_gastado;
  const holgura = sueldo - total_gastado;

  return (
    <div style={{ display: 'flex', ...variantFrame }}>
      <SideNav active={0}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <TopBar title="Hola, Joaquín 👋" subtitle="abril 2026 · día 15 de 30"/>

        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* HERO: Flujo del mes — adapted from reference */}
          <SketchBox style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <Body size={11} style={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Flujo del mes · abril 2026
              </Body>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <Body size={11} style={{ color: '#888' }}>${(necesidades_gastado/1000).toFixed(0)}k necesidades</Body>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Body size={11} style={{ color: '#888' }}>${(deseos_gastado/1000).toFixed(0)}k deseos</Body>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
              <Handwritten size={56} bold style={{ lineHeight: 0.95 }}>
                ${holgura.toLocaleString('es-CL')}
              </Handwritten>
              <Body size={14} style={{ color: '#666', marginBottom: 8 }}>
                de holgura este mes
              </Body>
              <div style={{ flex: 1 }}/>
              <SketchDuck size={70} stage={3}/>
            </div>

            <HolguraBar
              necesidades={necesidades_gastado}
              deseos={deseos_gastado}
              ahorro={ahorro_gastado}
              total={sueldo}
            />

            <div style={{ display: 'flex', gap: 18, marginTop: 10, fontFamily: 'Kalam', fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: INK, border: `1px solid ${INK}` }}/>
                Necesidades · <strong>{((necesidades_gastado/sueldo)*100).toFixed(0)}%</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#888', border: `1px solid ${INK}` }}/>
                Deseos · <strong>{((deseos_gastado/sueldo)*100).toFixed(0)}%</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: DUCK, border: `1px solid ${INK}` }}/>
                Ahorro 🐣 · <strong>{((ahorro_gastado/sueldo)*100).toFixed(0)}%</strong>
              </span>
              <span style={{ flex: 1 }}/>
              <Annotation>regla 50 / 30 / 20</Annotation>
            </div>
          </SketchBox>

          {/* SECOND ROW: 3 progress cards (presupuesto vs gastado) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { name: 'Necesidades', meta: '50%', used: necesidades_gastado, total: necesidades_total, color: INK },
              { name: 'Deseos',      meta: '30%', used: deseos_gastado,      total: deseos_total,      color: '#888' },
              { name: 'Ahorro',      meta: '20%', used: ahorro_gastado,      total: ahorro_total,      color: DUCK, good: true },
            ].map((b, i) => {
              const pct = (b.used / b.total) * 100;
              const restante = b.total - b.used;
              return (
                <SketchBox key={i} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Handwritten size={18} bold>{b.name}</Handwritten>
                    <Body size={11} style={{ color: '#888' }}>meta {b.meta}</Body>
                  </div>
                  <Handwritten size={26} bold style={{ display: 'block', marginTop: 4 }}>
                    ${(b.used/1000).toFixed(0)}k <span style={{ color: '#aaa', fontSize: 16 }}>/ ${(b.total/1000).toFixed(0)}k</span>
                  </Handwritten>
                  <div style={{
                    height: 10, border: `1.5px solid ${INK}`, background: '#fff',
                    marginTop: 6, position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${Math.min(pct, 100)}%`,
                      background: b.color,
                    }}/>
                  </div>
                  <Body size={11} style={{ color: '#666', display: 'block', marginTop: 6 }}>
                    {b.good ? '¡meta cumplida! 🎉' : `quedan $${(restante/1000).toFixed(0)}k para 15 días`}
                  </Body>
                </SketchBox>
              );
            })}
          </div>

          {/* THIRD ROW: cuentas + metas + transacciones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 14 }}>
            {/* Cuentas (DB: cuentas table) */}
            <SketchBox style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Handwritten size={16} bold>Mis cuentas</Handwritten>
                <Body size={10} style={{ color: '#888', textDecoration: 'underline' }}>+ agregar</Body>
              </div>
              {[
                { nombre: 'Cuenta corriente', tipo: 'CORRIENTE', saldo: 845230 },
                { nombre: 'Cuenta vista',     tipo: 'VISTA',     saldo: 230000 },
                { nombre: 'Patito ahorro',    tipo: 'AHORRO',    saldo: 170000, duck: true },
              ].map((c, i) => (
                <div key={i} style={{
                  padding: '6px 0', borderTop: i ? `1px dashed ${RULE}` : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <Body size={12} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {c.duck && '🐣 '}{c.nombre}
                    </Body>
                    <Body size={10} style={{ color: '#888' }}>{c.tipo}</Body>
                  </div>
                  <Body size={12}><strong>${c.saldo.toLocaleString('es-CL')}</strong></Body>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1.5px solid ${INK}`, display: 'flex', justifyContent: 'space-between' }}>
                <Body size={12}><strong>Total</strong></Body>
                <Body size={12}><strong>$1.245.230</strong></Body>
              </div>
            </SketchBox>

            {/* Metas (DB: metas table) */}
            <SketchBox style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Handwritten size={16} bold>Metas activas</Handwritten>
                <Body size={10} style={{ color: '#888', textDecoration: 'underline' }}>ver todas</Body>
              </div>
              {[
                { nombre: 'Vacaciones Sur', objetivo: 800000, actual: 320000, plazo: 'dic 2026' },
                { nombre: 'Notebook nuevo', objetivo: 600000, actual: 180000, plazo: 'ago 2026' },
                { nombre: 'Fondo emergencia', objetivo: 2000000, actual: 450000, plazo: '—' },
              ].map((m, i) => {
                const pct = (m.actual / m.objetivo) * 100;
                return (
                  <div key={i} style={{ padding: '6px 0', borderTop: i ? `1px dashed ${RULE}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Body size={12}>{m.nombre}</Body>
                      <Body size={11} style={{ color: '#888' }}>{m.plazo}</Body>
                    </div>
                    <div style={{
                      height: 6, border: `1px solid ${INK}`, background: '#fff',
                      marginTop: 3, position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${pct}%`, background: DUCK,
                      }}/>
                    </div>
                    <Body size={10} style={{ color: '#666', marginTop: 2 }}>
                      ${(m.actual/1000).toFixed(0)}k de ${(m.objetivo/1000).toFixed(0)}k · {pct.toFixed(0)}%
                    </Body>
                  </div>
                );
              })}
            </SketchBox>

            {/* Transacciones (DB: transacciones table) */}
            <SketchBox style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Handwritten size={16} bold>Movimientos recientes</Handwritten>
                <Body size={10} style={{ color: '#888', textDecoration: 'underline' }}>ver todo →</Body>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '52px 1fr 70px 80px',
                gap: 6, fontSize: 10, fontFamily: 'Kalam', color: '#888',
                paddingBottom: 4, borderBottom: `1px solid ${INK}`,
              }}>
                <span>FECHA</span><span>DESCRIPCIÓN</span><span>CATEGORÍA</span><span style={{textAlign:'right'}}>MONTO</span>
              </div>
              {[
                { fecha: '15/04', desc: 'Líder · compra',         cat: 'NECESIDAD', monto: -24500, tipo: 'GASTO' },
                { fecha: '14/04', desc: 'Netflix',                cat: 'DESEO',     monto: -8990,  tipo: 'GASTO' },
                { fecha: '13/04', desc: 'Sueldo abril',           cat: '—',         monto: 850000, tipo: 'INGRESO' },
                { fecha: '12/04', desc: 'Transf. Patito ahorro',  cat: 'AHORRO',    monto: -170000,tipo: 'TRANSFER' },
                { fecha: '11/04', desc: 'Uber',                   cat: 'DESEO',     monto: -4200,  tipo: 'GASTO' },
                { fecha: '10/04', desc: 'Farmacia Cruz Verde',    cat: 'NECESIDAD', monto: -12300, tipo: 'GASTO' },
              ].map((t, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '52px 1fr 70px 80px',
                  gap: 6, fontSize: 11, fontFamily: 'Kalam', padding: '4px 0',
                  borderTop: i ? `1px dashed ${RULE}` : 'none',
                }}>
                  <span style={{ color: '#888' }}>{t.fecha}</span>
                  <span>{t.desc}</span>
                  <span>
                    <span style={{
                      fontSize: 9, padding: '1px 5px',
                      border: `1px solid ${INK}`, borderRadius: 2,
                      background: t.cat === 'AHORRO' ? DUCK : (t.cat === 'NECESIDAD' ? '#eee' : '#f5f5f5'),
                    }}>{t.cat}</span>
                  </span>
                  <span style={{
                    textAlign: 'right', fontWeight: 700,
                    color: t.monto > 0 ? '#3a8a3a' : INK,
                  }}>
                    {t.monto > 0 ? '+' : ''}${Math.abs(t.monto).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </SketchBox>
          </div>

          {/* TIP DEL PATITO */}
          <SketchBox style={{
            padding: 14, background: DUCK,
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <SketchDuck size={50} stage={3}/>
            <Body size={13} style={{ flex: 1 }}>
              <strong>Patito dice:</strong> vas al 89% en Necesidades y quedan 15 días.
              Si recortas $30k de Deseos, llegas tranquilo a fin de mes.
            </Body>
            <SketchBox style={{
              padding: '6px 14px', background: INK, boxShadow: 'none',
            }}>
              <Body size={12} style={{ color: DUCK }}><strong>Ver plan</strong></Body>
            </SketchBox>
          </SketchBox>

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingRefined, DashboardHolgura, HolguraBar });
