// Dashboard 50/30/20 — 4 sketchy wireframe variants
// All feature a segmented donut (user's budget_viz choice) + duck personality

// ===== Donut (segmented) — uses real arcs, hand-drawn look =====
function SketchDonut({
  size = 180, thickness = 28,
  segments = [
    { pct: 50, label: 'Necesidades', color: '#1a1a1a' },
    { pct: 30, label: 'Gustos',      color: '#666666' },
    { pct: 20, label: 'Ahorro',      color: '#FFD23F' },
  ],
  centerTop = '', centerBottom = '',
  showLabels = false,
}) {
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let accum = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* paper shadow ring */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="#e8e6dc" strokeWidth={thickness}/>
      {segments.map((s, i) => {
        const len = (s.pct / 100) * circ;
        const gap = circ - len;
        const offset = -accum * circ / 100;
        accum += s.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={thickness}
            strokeDasharray={`${len - 2} ${gap + 2}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"/>
        );
      })}
      {/* outline sketchy */}
      <circle cx={cx} cy={cy} r={r + thickness/2} fill="none"
        stroke="#1a1a1a" strokeWidth="1.2" opacity="0.4"/>
      <circle cx={cx} cy={cy} r={r - thickness/2} fill="none"
        stroke="#1a1a1a" strokeWidth="1.2" opacity="0.4"/>
      {centerTop && (
        <text x={cx} y={cy - 4} textAnchor="middle"
          style={{fontFamily:'Caveat', fontSize: 22, fontWeight: 700, fill: INK}}>
          {centerTop}
        </text>
      )}
      {centerBottom && (
        <text x={cx} y={cy + 16} textAnchor="middle"
          style={{fontFamily:'Kalam', fontSize: 11, fill: '#666'}}>
          {centerBottom}
        </text>
      )}
    </svg>
  );
}

const SideNav = ({ active = 0 }) => {
  const items = ['Inicio', 'Movimientos', 'Presupuesto', 'Metas', 'Educación'];
  return (
    <div style={{
      width: 170, borderRight: `1.5px solid ${INK}`, padding: '20px 14px',
      background: '#fff', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
        <SketchDuck size={26} stage={2}/>
        <Handwritten size={16} bold>mi patito</Handwritten>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '6px 10px',
          background: i === active ? DUCK : 'transparent',
          border: i === active ? `1.5px solid ${INK}` : '1.5px solid transparent',
          borderRadius: 4,
        }}>
          <Body size={13} style={{ fontWeight: i === active ? 700 : 400 }}>{it}</Body>
        </div>
      ))}
      <div style={{ flex: 1 }}/>
      <div style={{ borderTop: `1.5px dashed ${RULE}`, paddingTop: 10, marginTop: 10 }}>
        <Body size={11} style={{ color: '#888' }}>Joaquín F.</Body>
        <Body size={10} style={{ color: '#aaa', display: 'block' }}>ajustes</Body>
      </div>
    </div>
  );
};

const TopBar = ({ title, subtitle }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 24px', borderBottom: `1.5px dashed ${RULE}`,
  }}>
    <div>
      <Handwritten size={22} bold style={{ display: 'block' }}>{title}</Handwritten>
      {subtitle && <Body size={12} style={{ color: '#666' }}>{subtitle}</Body>}
    </div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <Body size={12} style={{ color: '#666' }}>Abril 2026</Body>
      <div style={{ width: 30, height: 30, borderRadius: '50%', border: `1.5px solid ${INK}`,
        display:'flex',alignItems:'center',justifyContent:'center', fontSize:11,
        fontFamily: 'Kalam', fontWeight: 700,
      }}>JF</div>
    </div>
  </div>
);

// ============= V1 — Classic: donut hero + 3 allocation cards + recent txns =============
function DashboardV1() {
  return (
    <div style={{ display: 'flex', ...variantFrame }}>
      <SideNav active={0}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Hola, Joaquín 👋" subtitle="así va tu mes"/>

        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
          {/* left: donut card */}
          <SketchBox style={{ padding: 16, transform: 'rotate(-0.5deg)' }}>
            <Handwritten size={18} bold style={{ display: 'block', marginBottom: 8 }}>
              tu plata este mes
            </Handwritten>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SketchDonut size={180} centerTop="$850.000" centerBottom="sueldo neto"/>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Necesidades 50%', amt: '$425.000', color: INK },
                { label: 'Gustos 30%',      amt: '$255.000', color: '#666' },
                { label: 'Ahorro 20%',      amt: '$170.000', color: DUCK },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: r.color, border: `1px solid ${INK}` }}/>
                  <Body size={12} style={{ flex: 1 }}>{r.label}</Body>
                  <Body size={12}><strong>{r.amt}</strong></Body>
                </div>
              ))}
            </div>
          </SketchBox>

          {/* right: allocation progress + txns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 3 progress bars */}
            {[
              { name: 'Necesidades', used: 380, total: 425, pct: 89 },
              { name: 'Gustos',      used: 180, total: 255, pct: 70 },
              { name: 'Ahorro',      used: 170, total: 170, pct: 100, good: true },
            ].map((b, i) => (
              <SketchBox key={i} style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Handwritten size={16} bold>{b.name}</Handwritten>
                  <Body size={12}>${b.used}k / ${b.total}k</Body>
                </div>
                <div style={{
                  height: 12, border: `1.5px solid ${INK}`, background: '#fff',
                  position: 'relative', borderRadius: 2,
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${Math.min(b.pct, 100)}%`,
                    background: b.good ? DUCK : (b.pct > 95 ? '#e56b5c' : INK),
                  }}/>
                </div>
                {b.pct > 95 && !b.good && (
                  <Annotation style={{ marginTop: 4, color: '#e56b5c' }}>
                    ¡cuidado! ya casi te lo gastas
                  </Annotation>
                )}
              </SketchBox>
            ))}

            <SketchBox style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Handwritten size={16} bold>Últimos movimientos</Handwritten>
                <Body size={11} style={{ color: '#888', textDecoration: 'underline' }}>ver todo →</Body>
              </div>
              {[
                ['15 abr', 'Líder', '-$24.500', 'N'],
                ['14 abr', 'Netflix', '-$8.990', 'G'],
                ['12 abr', 'Transferencia ahorro', '-$170.000', 'A'],
              ].map((t, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '4px 0',
                  borderTop: i ? `1px dashed ${RULE}` : 'none',
                }}>
                  <Body size={12} style={{ width: 50, color: '#888' }}>{t[0]}</Body>
                  <Body size={12} style={{ flex: 1 }}>{t[1]}</Body>
                  <div style={{
                    width: 18, height: 18, border: `1px solid ${INK}`,
                    background: t[3] === 'A' ? DUCK : (t[3] === 'N' ? INK : '#ddd'),
                    color: t[3] === 'N' ? '#fff' : INK,
                    fontSize: 10, textAlign: 'center', lineHeight: '17px',
                    fontFamily: 'Kalam', fontWeight: 700,
                  }}>{t[3]}</div>
                  <Body size={12}><strong>{t[2]}</strong></Body>
                </div>
              ))}
            </SketchBox>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= V2 — Duck-first: patito XL como héroe + bloques alrededor =============
function DashboardV2() {
  return (
    <div style={{ display: 'flex', ...variantFrame }}>
      <SideNav active={0}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Tu patito hoy" subtitle="está feliz 🐣"/>

        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* duck hero */}
          <SketchBox style={{
            padding: 18, background: DUCK, gridColumn: '1 / 3',
            display: 'flex', gap: 20, alignItems: 'center',
            transform: 'rotate(-0.3deg)',
          }}>
            <div style={{ position: 'relative' }}>
              <SketchDuck size={140} stage={3}/>
              {/* floating coins */}
              <div style={{ position: 'absolute', top: -8, right: -12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${INK}`, background: '#fff',
                  fontFamily: 'Kalam', fontSize: 12, fontWeight: 700,
                  textAlign: 'center', lineHeight: '18px',
                }}>$</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Handwritten size={30} bold style={{ display: 'block' }}>
                ¡Patito va bien!
              </Handwritten>
              <Body size={14} style={{ display: 'block', marginTop: 4 }}>
                Ahorraste <strong>$170.000</strong> este mes — vas en racha de 3 meses 🔥
              </Body>
              {/* evolution bar */}
              <div style={{ marginTop: 14 }}>
                <Body size={11} style={{ color: '#555' }}>
                  Pato → Rey Pato: 34%
                </Body>
                <div style={{
                  height: 10, border: `1.5px solid ${INK}`, background: '#fff',
                  marginTop: 4, position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '34%',
                    background: INK,
                  }}/>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Handwritten size={44} bold>$170k</Handwritten>
              <Body size={12} style={{ color: '#333' }}>ahorrado / $500k meta</Body>
            </div>
          </SketchBox>

          {/* donut */}
          <SketchBox style={{ padding: 14 }}>
            <Handwritten size={16} bold>Tu mes en 50/30/20</Handwritten>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <SketchDonut size={160} thickness={24} centerTop="abril" centerBottom=""/>
            </div>
          </SketchBox>

          {/* stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SketchBox style={{ padding: 12 }}>
              <Body size={11} style={{ color: '#888' }}>Saldo en cuentas</Body>
              <Handwritten size={28} bold>$1.245.230</Handwritten>
              <Body size={11} style={{ color: '#3a8a3a' }}>↑ $45k vs. mes pasado</Body>
            </SketchBox>
            <SketchBox style={{ padding: 12 }}>
              <Body size={11} style={{ color: '#888' }}>Días del mes</Body>
              <Handwritten size={28} bold>15 / 30</Handwritten>
              <div style={{
                height: 6, background: '#eee', marginTop: 4,
                border: `1px solid ${INK}`, position: 'relative',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', background: INK }}/>
              </div>
            </SketchBox>
            <SketchBox style={{ padding: 12, background: '#fff4cc' }}>
              <Body size={11} style={{ color: '#885' }}>⚠ Alerta</Body>
              <Body size={13} style={{ display: 'block' }}>
                Gustos va al 70% y queda mitad del mes
              </Body>
            </SketchBox>
          </div>

          {/* tip card */}
          <SketchBox style={{ padding: 12, gridColumn: '1 / 3', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 28 }}>💡</div>
            <Body size={13} style={{ flex: 1 }}>
              <strong>Tip del patito:</strong> si mueves $30.000 más a ahorro esta semana,
              llegas a la meta del mes 8 días antes.
            </Body>
            <SketchBox style={{ padding: '4px 12px', background: DUCK, boxShadow: 'none' }}>
              <Body size={12}><strong>Transferir</strong></Body>
            </SketchBox>
          </SketchBox>
        </div>
      </div>
    </div>
  );
}

// ============= V3 — Data-dense: 4 columns, minimal mascot =============
function DashboardV3() {
  return (
    <div style={{ display: 'flex', ...variantFrame }}>
      <SideNav active={0}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Panel — abril 2026" subtitle="todo tu mes de un vistazo"/>

        {/* KPI row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10, padding: '14px 20px 8px',
        }}>
          {[
            { label: 'Ingresos', amt: '$850.000', delta: '+0%' },
            { label: 'Gastos', amt: '$560.000', delta: '-4%' },
            { label: 'Ahorro', amt: '$170.000', delta: '+20%' },
            { label: 'Patrimonio', amt: '$1.24M', delta: '+$45k' },
          ].map((k, i) => (
            <SketchBox key={i} style={{ padding: 10, boxShadow: '2px 2px 0 ' + INK }}>
              <Body size={10} style={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</Body>
              <Handwritten size={22} bold style={{ display: 'block' }}>{k.amt}</Handwritten>
              <Body size={10} style={{ color: k.delta.startsWith('-') ? '#3a8a3a' : '#555' }}>{k.delta}</Body>
            </SketchBox>
          ))}
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10, padding: '4px 20px',
        }}>
          <SketchBox style={{ padding: 10 }}>
            <Body size={11} style={{ color: '#888' }}>Distribución 50/30/20</Body>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <SketchDonut size={130} thickness={22}/>
            </div>
            <div style={{ display: 'flex', gap: 4, fontSize: 10, fontFamily: 'Kalam' }}>
              <span>■ N 50%</span><span style={{color:'#666'}}>■ G 30%</span><span style={{color:'#b89500'}}>■ A 20%</span>
            </div>
          </SketchBox>

          <SketchBox style={{ padding: 10 }}>
            <Body size={11} style={{ color: '#888' }}>Gasto por día (30d)</Body>
            <svg viewBox="0 0 200 90" style={{ width: '100%', marginTop: 6 }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const h = 20 + Math.sin(i * 0.7) * 15 + Math.random() * 20;
                return <rect key={i} x={i * 6.5 + 2} y={85 - h} width="5" height={h}
                  fill={i === 28 ? DUCK : INK}/>;
              })}
              <line x1="0" y1="85" x2="200" y2="85" stroke={INK} strokeWidth="1"/>
            </svg>
          </SketchBox>

          <SketchBox style={{ padding: 10 }}>
            <Body size={11} style={{ color: '#888' }}>Proyección 12m</Body>
            <svg viewBox="0 0 200 90" style={{ width: '100%', marginTop: 6 }}>
              <path d="M5 75 Q 40 65 80 55 T 140 35 T 195 15" stroke={INK} strokeWidth="2" fill="none"/>
              <path d="M5 75 Q 40 65 80 55 T 140 35 T 195 15 L 195 85 L 5 85 Z"
                fill={DUCK} opacity="0.3"/>
              {[5, 80, 195].map((x, i) => (
                <circle key={i} cx={x} cy={[75, 55, 15][i]} r="3" fill={INK}/>
              ))}
              <text x="195" y="10" textAnchor="end"
                style={{fontFamily:'Caveat', fontSize:12, fontWeight:700}}>$3.2M</text>
            </svg>
          </SketchBox>
        </div>

        {/* bottom: transactions table + category split */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr',
          gap: 10, padding: '8px 20px 20px', flex: 1,
        }}>
          <SketchBox style={{ padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Handwritten size={14} bold>Movimientos recientes</Handwritten>
              <Body size={10} style={{ color: '#888' }}>últimos 7 días</Body>
            </div>
            {[
              ['15 abr','Líder','Necesidades','-$24.500'],
              ['14 abr','Netflix','Gustos','-$8.990'],
              ['13 abr','Sueldo Abril','Ingreso','+$850.000'],
              ['12 abr','Transf. Ahorro','Ahorro','-$170.000'],
              ['11 abr','Uber','Gustos','-$4.200'],
            ].map((t, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 90px 80px',
                gap: 6, padding: '4px 0', fontSize: 11, fontFamily: 'Kalam',
                borderTop: i ? `1px dashed ${RULE}` : 'none',
              }}>
                <span style={{ color: '#888' }}>{t[0]}</span>
                <span>{t[1]}</span>
                <span style={{ color: '#666' }}>{t[2]}</span>
                <span style={{ textAlign: 'right', fontWeight: 700,
                  color: t[3].startsWith('+') ? '#3a8a3a' : INK }}>{t[3]}</span>
              </div>
            ))}
          </SketchBox>

          <SketchBox style={{ padding: 10 }}>
            <Handwritten size={14} bold style={{ display: 'block', marginBottom: 6 }}>Por categoría</Handwritten>
            {[
              ['Comida', 145, 200],
              ['Arriendo', 220, 220],
              ['Transporte', 42, 60],
              ['Entretención', 68, 90],
              ['Otros', 85, 100],
            ].map(([name, used, total], i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'Kalam' }}>
                  <span>{name}</span>
                  <span style={{ color: '#666' }}>${used}k/${total}k</span>
                </div>
                <div style={{ height: 5, background: '#eee', border: `1px solid ${INK}`, marginTop: 2, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(used/total)*100}%`, background: used === total ? DUCK : INK }}/>
                </div>
              </div>
            ))}
          </SketchBox>
        </div>
      </div>
    </div>
  );
}

// ============= V4 — "Dashboard-diario": una tarea, una pregunta =============
// Conversational, minimal — el patito te propone la acción del día.
function DashboardV4() {
  return (
    <div style={{ display: 'flex', ...variantFrame }}>
      <SideNav active={0}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Miércoles 15 de abril" subtitle="día 15 de 30"/>

        <div style={{
          padding: '30px 40px', display: 'flex', flexDirection: 'column',
          gap: 22, alignItems: 'center',
        }}>
          {/* greeting + duck */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SketchDuck size={80} stage={3}/>
            <div>
              <Handwritten size={26} bold style={{ display: 'block' }}>
                Hola Joaquín, tengo una pregunta.
              </Handwritten>
              <Body size={13} style={{ color: '#666' }}>
                1 minuto y seguimos bien el mes
              </Body>
            </div>
          </div>

          {/* the question card */}
          <SketchBox style={{
            padding: 22, width: '85%', background: '#fff',
            transform: 'rotate(-0.5deg)',
          }}>
            <Handwritten size={28} bold style={{ display: 'block', lineHeight: 1.15 }}>
              Pagaste $24.500 en Líder hoy.
            </Handwritten>
            <Handwritten size={28} style={{ display: 'block', color: '#666' }}>
              ¿fue una <em>necesidad</em> o un <em>gusto</em>?
            </Handwritten>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {[
                { label: '50% Necesidad', bg: '#fff' },
                { label: '30% Gusto', bg: '#fff' },
                { label: '20% Ahorro', bg: DUCK },
              ].map((o, i) => (
                <SketchBox key={i} style={{
                  flex: 1, padding: '10px 0', textAlign: 'center',
                  background: o.bg,
                  boxShadow: i === 0 ? '3px 3px 0 ' + INK : '2px 2px 0 ' + INK,
                }}>
                  <Handwritten size={17} bold>{o.label}</Handwritten>
                </SketchBox>
              ))}
            </div>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Body size={11} style={{ color: '#888' }}>
                sé por el lugar que probablemente fue necesidad
              </Body>
              <Body size={11} style={{ color: '#888', textDecoration: 'underline' }}>saltar →</Body>
            </div>
          </SketchBox>

          {/* mini summary strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10, width: '85%',
          }}>
            {[
              { label: 'Necesidades', pct: 89, amt: '$380k / 425k', warn: true },
              { label: 'Gustos', pct: 70, amt: '$180k / 255k' },
              { label: 'Ahorro 🐣', pct: 100, amt: '$170k / 170k', good: true },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 10, border: `1.5px dashed ${RULE}`, borderRadius: 4,
              }}>
                <Body size={11} style={{ color: '#888' }}>{s.label}</Body>
                <Handwritten size={18} bold style={{ display: 'block' }}>{s.pct}%</Handwritten>
                <div style={{ height: 4, background: '#eee', marginTop: 2, border: `1px solid ${INK}`, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${s.pct}%`,
                    background: s.good ? DUCK : (s.warn ? '#e56b5c' : INK),
                  }}/>
                </div>
                <Body size={10} style={{ color: '#888', marginTop: 2 }}>{s.amt}</Body>
              </div>
            ))}
          </div>

          <Annotation style={{ marginTop: 4 }}>
            te avisamos mañana con la próxima pregunta →
          </Annotation>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DashboardV1, DashboardV2, DashboardV3, DashboardV4,
  SketchDonut, SideNav, TopBar,
});
