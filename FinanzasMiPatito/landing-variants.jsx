// Landing / Login — 4 sketchy wireframe variants
// Style: hand-drawn feel, Caveat for headlines, Kalam for body,
// b&w + 1 duck-yellow accent. Each variant uses a different layout tactic.

const DUCK = '#FFD23F';
const INK  = '#1a1a1a';
const PAPER = '#FAFAF7';
const RULE = '#c9c9c4';

// ============= Shared sketchy atoms =============

const SketchBox = ({ children, style = {}, dashed = false, tilt = 0, thick = 2 }) => (
  <div style={{
    border: `${thick}px ${dashed ? 'dashed' : 'solid'} ${INK}`,
    borderRadius: 6,
    padding: 10,
    background: '#fff',
    transform: tilt ? `rotate(${tilt}deg)` : 'none',
    boxShadow: '2px 2px 0 ' + INK,
    ...style,
  }}>{children}</div>
);

const WigglyLine = ({ width = 120, color = INK, strokeWidth = 2 }) => (
  <svg width={width} height="8" viewBox={`0 0 ${width} 8`} style={{ display: 'block' }}>
    <path d={`M0 4 Q ${width*0.12} 0 ${width*0.25} 4 T ${width*0.5} 4 T ${width*0.75} 4 T ${width} 4`}
      fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

const ScribbleFill = ({ w = 100, h = 20, color = INK }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
    {Array.from({ length: Math.floor(h/3) }).map((_, i) => (
      <path key={i}
        d={`M2 ${i*3+2} Q ${w/2} ${i*3+1} ${w-2} ${i*3+2}`}
        stroke={color} strokeWidth="1" fill="none" opacity="0.85" />
    ))}
  </svg>
);

const PlaceholderText = ({ lines = 3, width = '100%', gap = 8 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {Array.from({ length: lines }).map((_, i) => (
      <WigglyLine key={i}
        width={typeof width === 'number' ? width : 200}
        strokeWidth={1.5} />
    ))}
  </div>
);

// Cute sketchy duck — evolves by `stage` (1=egg, 2=chick, 3=duck, 4=gold duck)
const SketchDuck = ({ size = 90, stage = 2, gold = false }) => {
  const body = gold ? DUCK : '#fff';
  if (stage === 1) {
    // egg
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <ellipse cx="50" cy="55" rx="28" ry="36" fill="#fff" stroke={INK} strokeWidth="2.5"/>
        <path d="M30 45 Q 35 42 40 46" stroke={INK} strokeWidth="1.5" fill="none"/>
        <path d="M55 50 Q 62 47 68 52" stroke={INK} strokeWidth="1.5" fill="none"/>
        <path d="M35 70 Q 45 68 55 72" stroke={INK} strokeWidth="1.5" fill="none"/>
      </svg>
    );
  }
  // chick / duck / gold duck share silhouette, scale varies
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* body */}
      <ellipse cx="52" cy="65" rx="30" ry="22" fill={body} stroke={INK} strokeWidth="2.5"/>
      {/* head */}
      <circle cx="35" cy="40" r="18" fill={body} stroke={INK} strokeWidth="2.5"/>
      {/* eye */}
      <circle cx="32" cy="37" r="2.5" fill={INK}/>
      <circle cx="31.5" cy="36.2" r="0.7" fill="#fff"/>
      {/* beak */}
      <path d="M19 40 L 10 42 L 19 45 Z" fill={DUCK} stroke={INK} strokeWidth="2"/>
      {/* wing */}
      <path d="M48 60 Q 60 55 68 68 Q 58 72 48 68 Z" fill="none" stroke={INK} strokeWidth="2"/>
      {/* feet */}
      <path d="M42 85 L 40 92 M46 85 L 48 92" stroke={DUCK} strokeWidth="3" strokeLinecap="round"/>
      <path d="M62 85 L 60 92 M66 85 L 68 92" stroke={DUCK} strokeWidth="3" strokeLinecap="round"/>
      {stage >= 3 && (
        // little hair tuft for "grown"
        <path d="M32 22 Q 34 16 37 22" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
      {stage === 4 && (
        // crown
        <path d="M24 22 L 28 14 L 32 20 L 36 12 L 40 20 L 44 14 L 46 22 Z"
          fill={DUCK} stroke={INK} strokeWidth="1.5"/>
      )}
    </svg>
  );
};

const Handwritten = ({ children, size = 22, bold = false, style = {} }) => (
  <span style={{
    fontFamily: 'Caveat, cursive',
    fontSize: size,
    fontWeight: bold ? 700 : 400,
    color: INK,
    lineHeight: 1.1,
    ...style,
  }}>{children}</span>
);

const Body = ({ children, size = 14, style = {} }) => (
  <span style={{
    fontFamily: 'Kalam, cursive',
    fontSize: size,
    color: INK,
    lineHeight: 1.35,
    ...style,
  }}>{children}</span>
);

const StickyNote = ({ children, color = DUCK, tilt = -2, style = {} }) => (
  <div style={{
    background: color,
    border: `2px solid ${INK}`,
    padding: '10px 14px',
    transform: `rotate(${tilt}deg)`,
    boxShadow: '3px 3px 0 ' + INK,
    fontFamily: 'Kalam, cursive',
    fontSize: 13,
    ...style,
  }}>{children}</div>
);

const Arrow = ({ dir = 'right', length = 40, style = {} }) => {
  // simple hand-drawn arrow
  const angle = { right: 0, down: 90, left: 180, up: 270 }[dir] || 0;
  return (
    <svg width={length+10} height="18" viewBox={`0 0 ${length+10} 18`}
      style={{ transform: `rotate(${angle}deg)`, ...style }}>
      <path d={`M2 9 Q ${length*0.3} 4 ${length*0.7} 10 T ${length} 9`}
        stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d={`M${length-6} 4 L ${length} 9 L ${length-6} 14`}
        stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const Annotation = ({ children, style = {} }) => (
  <div style={{
    fontFamily: 'Caveat, cursive', fontSize: 16, color: '#888',
    fontStyle: 'italic',
    ...style,
  }}>{children}</div>
);

const variantFrame = {
  width: '100%', height: '100%', background: PAPER,
  position: 'relative', overflow: 'hidden',
  fontFamily: 'Kalam, cursive', color: INK,
};

// ============= V1 — Split Hero : duck left, form right =============
function LandingV1() {
  return (
    <div style={variantFrame}>
      {/* top nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 28px', borderBottom: `1.5px dashed ${RULE}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SketchDuck size={34} stage={2}/>
          <Handwritten size={22} bold>Finanzas Mi Patito</Handwritten>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Body>Producto</Body><Body>Cómo funciona</Body><Body>Precios</Body>
          <SketchBox style={{ padding: '4px 14px', boxShadow: '2px 2px 0 ' + INK }}>
            <Body size={13}>Entrar</Body>
          </SketchBox>
        </div>
      </div>

      {/* hero split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, padding: '40px 48px' }}>
        {/* left: message + duck */}
        <div>
          <Handwritten size={44} bold style={{ display: 'block', lineHeight: 1.05 }}>
            Ordena tu plata.
          </Handwritten>
          <Handwritten size={44} style={{ display: 'block', lineHeight: 1.05, color: '#555' }}>
            Cría a tu patito.
          </Handwritten>
          <div style={{ height: 8 }}/>
          <Body size={15} style={{ display: 'block', maxWidth: 380, color: '#444' }}>
            Presupuestamos tu sueldo con la regla 50/30/20. Tú ahorras, tu patito crece.
          </Body>

          <div style={{ marginTop: 26, position: 'relative', display: 'inline-block' }}>
            <SketchBox style={{
              background: DUCK, padding: '10px 22px',
              boxShadow: '3px 3px 0 ' + INK,
            }}>
              <Handwritten size={22} bold>Empezar gratis →</Handwritten>
            </SketchBox>
            <Annotation style={{
              position: 'absolute', top: -26, right: -120, width: 110,
            }}>
              ← no te pedimos tarjeta
            </Annotation>
            <svg width="30" height="30" viewBox="0 0 30 30" style={{
              position: 'absolute', top: -6, right: -90,
            }}>
              <path d="M4 20 Q 10 4 24 10" stroke="#888" strokeWidth="1.5" fill="none"/>
              <path d="M22 6 L 24 10 L 20 12" stroke="#888" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: `2px solid ${INK}`, background: '#fff',
                  marginLeft: i === 1 ? 0 : -8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontFamily: 'Kalam', fontWeight: 700,
                }}>{['A','J','M'][i-1]}</div>
              ))}
            </div>
            <Body size={13} style={{ color: '#666' }}>+1.200 personas ya criando patito</Body>
          </div>
        </div>

        {/* right: auth card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <SketchBox style={{
            width: 320, padding: 22, transform: 'rotate(1.5deg)',
          }}>
            <Handwritten size={24} bold style={{ display: 'block', marginBottom: 14 }}>
              Entrar / Crear cuenta
            </Handwritten>
            <Body size={12} style={{ color: '#666', display: 'block', marginBottom: 14 }}>
              Email
            </Body>
            <div style={{
              border: `1.5px solid ${INK}`, height: 34, borderRadius: 4,
              marginBottom: 14, padding: '6px 10px', background: '#fff',
            }}>
              <WigglyLine width={240} color="#aaa"/>
            </div>
            <Body size={12} style={{ color: '#666', display: 'block', marginBottom: 14 }}>
              Contraseña
            </Body>
            <div style={{
              border: `1.5px solid ${INK}`, height: 34, borderRadius: 4,
              marginBottom: 20, padding: '6px 10px', background: '#fff',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: INK }}/>
              ))}
            </div>
            <SketchBox style={{
              background: INK, padding: '8px 0', textAlign: 'center',
              boxShadow: '2px 2px 0 ' + DUCK,
            }}>
              <Handwritten size={20} bold style={{ color: DUCK }}>Entrar</Handwritten>
            </SketchBox>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Body size={12} style={{ color: '#888' }}>— o —</Body>
            </div>
            <div style={{
              border: `1.5px solid ${INK}`, padding: '6px 0', textAlign: 'center',
              marginTop: 10, borderRadius: 4,
            }}>
              <Body size={13}>Continuar con Google</Body>
            </div>
          </SketchBox>

          <div style={{ position: 'absolute', bottom: -10, left: 0 }}>
            <SketchDuck size={80} stage={3}/>
          </div>
          <Annotation style={{ position: 'absolute', bottom: 8, left: 86, width: 120 }}>
            te espera aquí dentro
          </Annotation>
        </div>
      </div>
    </div>
  );
}

// ============= V2 — Centered manifesto + bottom auth strip =============
function LandingV2() {
  return (
    <div style={variantFrame}>
      {/* corner logo */}
      <div style={{ position: 'absolute', top: 20, left: 28, display: 'flex', gap: 8, alignItems: 'center' }}>
        <SketchDuck size={28} stage={2}/>
        <Handwritten size={18} bold>mi patito</Handwritten>
      </div>
      <div style={{ position: 'absolute', top: 24, right: 28 }}>
        <Body size={13} style={{ color: '#666' }}>¿Ya tienes cuenta? </Body>
        <Body size={13} style={{ textDecoration: 'underline', color: INK }}>Entrar</Body>
      </div>

      {/* center manifesto */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '60px 40px',
      }}>
        <div style={{ marginBottom: 20 }}>
          <SketchDuck size={120} stage={3}/>
        </div>

        <Handwritten size={56} bold style={{ display: 'block', textAlign: 'center', lineHeight: 1.0 }}>
          50% lo necesario.
        </Handwritten>
        <Handwritten size={56} bold style={{ display: 'block', textAlign: 'center', lineHeight: 1.0 }}>
          30% lo que quieres.
        </Handwritten>
        <Handwritten size={56} bold style={{
          display: 'block', textAlign: 'center', lineHeight: 1.0,
          background: DUCK, padding: '0 16px', border: `2px solid ${INK}`,
          transform: 'rotate(-1deg)', marginTop: 4,
        }}>
          20% para tu patito.
        </Handwritten>

        <Body size={15} style={{
          display: 'block', textAlign: 'center', color: '#555',
          marginTop: 28, maxWidth: 420,
        }}>
          Una regla. Sin planillas. El patito come lo que ahorras y crece contigo.
        </Body>

        {/* inline auth strip */}
        <div style={{
          marginTop: 36, display: 'flex', alignItems: 'center', gap: 0,
          border: `2px solid ${INK}`, borderRadius: 6, padding: 4, background: '#fff',
          boxShadow: '3px 3px 0 ' + INK,
        }}>
          <div style={{ padding: '10px 16px', borderRight: `1.5px dashed ${RULE}` }}>
            <Body size={13} style={{ color: '#888' }}>tu@email.com</Body>
          </div>
          <div style={{
            background: DUCK, padding: '10px 22px', borderRadius: 4,
          }}>
            <Handwritten size={20} bold>Empezar →</Handwritten>
          </div>
        </div>
        <Body size={12} style={{ color: '#888', marginTop: 10 }}>
          gratis • sin tarjeta • 30 segundos
        </Body>
      </div>

      {/* corner decorations */}
      <Annotation style={{ position: 'absolute', bottom: 20, left: 28 }}>
        🥚 → 🐣 → 🦆 → 👑
      </Annotation>
      <Annotation style={{ position: 'absolute', bottom: 20, right: 28 }}>
        v1.0 • hecho en Chile
      </Annotation>
    </div>
  );
}

// ============= V3 — Feature grid (3 columns), duck-first =============
function LandingV3() {
  return (
    <div style={variantFrame}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SketchDuck size={32} stage={3}/>
          <Handwritten size={20} bold>Finanzas Mi Patito</Handwritten>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <Body size={13}>Entrar</Body>
          <SketchBox style={{ padding: '3px 12px', background: DUCK }}>
            <Body size={13}><strong>Crear cuenta</strong></Body>
          </SketchBox>
        </div>
      </div>

      {/* banner strip */}
      <div style={{
        background: DUCK, borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}`,
        padding: '26px 28px', display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <SketchDuck size={90} stage={3}/>
        <div style={{ flex: 1 }}>
          <Handwritten size={34} bold>Tu plata tiene 3 trabajos.</Handwritten>
          <Body size={14} style={{ display: 'block', marginTop: 4 }}>
            Sobrevivir, disfrutar, crecer. Te los organizamos automáticamente.
          </Body>
        </div>
        <SketchBox style={{
          padding: '10px 18px', background: INK, boxShadow: '3px 3px 0 #fff',
        }}>
          <Handwritten size={20} bold style={{ color: DUCK }}>Probar gratis</Handwritten>
        </SketchBox>
      </div>

      {/* 3-column features */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24,
        padding: '36px 28px',
      }}>
        {[
          { num: '50%', title: 'Necesidades', body: 'Arriendo, luz, comida. Lo vital, siempre cubierto.', tilt: -1 },
          { num: '30%', title: 'Estilo de vida', body: 'Salir, Netflix, antojos. Gasta sin culpa.', tilt: 1 },
          { num: '20%', title: 'Tu patito 🐣', body: 'Ahorro y metas. Lo que te hace crecer.', tilt: -0.5 },
        ].map((c, i) => (
          <SketchBox key={i} tilt={c.tilt} style={{ padding: 18 }}>
            <Handwritten size={44} bold style={{
              display: 'block',
              color: i === 2 ? INK : '#666',
              background: i === 2 ? DUCK : 'transparent',
              padding: i === 2 ? '0 8px' : 0,
              border: i === 2 ? `2px solid ${INK}` : 'none',
              display: 'inline-block',
              marginBottom: 8,
            }}>{c.num}</Handwritten>
            <Handwritten size={22} bold style={{ display: 'block', marginTop: 6 }}>{c.title}</Handwritten>
            <WigglyLine width={100}/>
            <Body size={13} style={{ display: 'block', marginTop: 8, color: '#555' }}>{c.body}</Body>
          </SketchBox>
        ))}
      </div>

      {/* bottom CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '12px 28px 28px',
      }}>
        <Body size={14} style={{ color: '#666' }}>Listo para empezar?</Body>
        <Arrow length={36}/>
        <SketchBox style={{ padding: '6px 16px', background: '#fff' }}>
          <Body size={14}><strong>Crear mi cuenta</strong></Body>
        </SketchBox>
      </div>
    </div>
  );
}

// ============= V4 — "Elige tu patito" gamified onboarding landing =============
function LandingV4() {
  return (
    <div style={variantFrame}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 28px', borderBottom: `1.5px solid ${INK}`,
      }}>
        <Handwritten size={20} bold>🐣 mi patito</Handwritten>
        <Body size={13} style={{ textDecoration: 'underline' }}>saltarse intro →</Body>
      </div>

      <div style={{ padding: '28px 40px' }}>
        <Handwritten size={36} bold style={{ display: 'block', textAlign: 'center', lineHeight: 1.1 }}>
          Así evoluciona tu patito
        </Handwritten>
        <Body size={14} style={{ display: 'block', textAlign: 'center', color: '#666', marginTop: 4 }}>
          cada $ que ahorras, tu patito crece un poquito
        </Body>

        {/* evolution strip */}
        <div style={{
          display: 'flex', alignItems: 'end', justifyContent: 'space-between',
          marginTop: 30, padding: '20px 10px',
          borderTop: `1.5px dashed ${RULE}`, borderBottom: `1.5px dashed ${RULE}`,
        }}>
          {[
            { stage: 1, label: 'Huevito', sub: '$0 ahorrado' },
            { stage: 2, label: 'Patito', sub: '$50k' },
            { stage: 3, label: 'Pato', sub: '$500k' },
            { stage: 4, label: 'Rey Pato', sub: '$2M+' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
              <SketchDuck size={70 + i*8} stage={s.stage} gold={s.stage === 4}/>
              <Handwritten size={18} bold style={{ display: 'block', marginTop: 6 }}>{s.label}</Handwritten>
              <Body size={12} style={{ display: 'block', color: '#888' }}>{s.sub}</Body>
              {i < 3 && (
                <svg width="26" height="12" viewBox="0 0 26 12" style={{
                  position: 'absolute', right: -13, top: 40,
                }}>
                  <path d="M2 6 L 20 6" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3"/>
                  <path d="M18 2 L 22 6 L 18 10" stroke={INK} strokeWidth="1.5" fill="none"/>
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 30, gap: 18,
        }}>
          <div style={{ flex: 1 }}>
            <Handwritten size={28} bold style={{ display: 'block' }}>
              ¿Desde dónde partes?
            </Handwritten>
            <Body size={13} style={{ color: '#666' }}>
              Te asignamos tu huevito. Conecta tu sueldo y empieza a alimentarlo.
            </Body>
          </div>
          <SketchBox style={{
            padding: '12px 24px', background: DUCK,
            boxShadow: '3px 3px 0 ' + INK,
          }}>
            <Handwritten size={22} bold>Adoptar huevito →</Handwritten>
          </SketchBox>
        </div>

        {/* mini auth row */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 10, alignItems: 'center',
          padding: '10px 14px', background: '#fff', border: `1.5px dashed ${RULE}`, borderRadius: 4,
        }}>
          <Body size={12} style={{ color: '#888' }}>o inicia con:</Body>
          <div style={{ border: `1.5px solid ${INK}`, padding: '4px 12px', borderRadius: 3 }}>
            <Body size={12}>Google</Body>
          </div>
          <div style={{ border: `1.5px solid ${INK}`, padding: '4px 12px', borderRadius: 3 }}>
            <Body size={12}>Email</Body>
          </div>
          <div style={{ flex: 1 }}/>
          <Body size={12} style={{ color: '#888' }}>¿ya adoptaste? <span style={{textDecoration:'underline', color:INK}}>entrar</span></Body>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LandingV1, LandingV2, LandingV3, LandingV4,
  SketchBox, WigglyLine, ScribbleFill, PlaceholderText, SketchDuck,
  Handwritten, Body, StickyNote, Arrow, Annotation,
  DUCK, INK, PAPER, RULE,
});
