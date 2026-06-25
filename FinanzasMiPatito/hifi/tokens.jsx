// Design tokens + atomic components for HiFi prototype
// Vibe: friendly fintech, Duolingo/Cash App territory
// Palette 2: warm cream + duck yellow + dark + orange accent

const T = {
  // colors
  bg:       '#fdf8e8',  // warm cream background
  surface:  '#ffffff',
  ink:      '#2d2a26',  // dark
  inkSoft:  '#5b554d',
  muted:    '#8a8478',
  line:     '#e8e2cf',
  duck:     '#FFB800',  // primary yellow
  duckSoft: '#FFE89A',
  duckDark: '#E89F00',
  orange:   '#FF8A3D',
  orangeSoft:'#FFD9BC',
  green:    '#2FA86B',
  greenSoft:'#D4F0DF',
  red:      '#E5564B',
  redSoft:  '#FFD8D4',
  blue:     '#3D8BFF',
  blueSoft: '#D6E5FF',

  // shadows + radii
  r: { sm: 8, md: 14, lg: 20, xl: 28, full: 999 },
  shadow: {
    soft: '0 1px 2px rgba(45,42,38,.04), 0 4px 12px rgba(45,42,38,.06)',
    card: '0 2px 4px rgba(45,42,38,.05), 0 8px 24px rgba(45,42,38,.08)',
    pop:  '0 4px 0 rgba(45,42,38,.12), 0 8px 24px rgba(45,42,38,.10)',
    duck: '0 4px 0 rgba(232,159,0,1), 0 10px 28px rgba(255,184,0,.35)',
  },
  font: {
    sans: '"Plus Jakarta Sans", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
};

// ===== Button =====
function Button({ children, variant = 'primary', size = 'md', icon, iconRight,
  onClick, full, style = {}, disabled }) {
  const sizes = {
    sm: { pad: '8px 14px', fs: 13, h: 36, gap: 6 },
    md: { pad: '12px 20px', fs: 15, h: 46, gap: 8 },
    lg: { pad: '14px 26px', fs: 17, h: 56, gap: 10 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: T.duck, color: T.ink,
      boxShadow: T.shadow.duck,
      border: 'none',
    },
    dark: {
      background: T.ink, color: T.duck,
      boxShadow: '0 4px 0 #000, 0 10px 28px rgba(45,42,38,.3)',
      border: 'none',
    },
    secondary: {
      background: T.surface, color: T.ink,
      border: `2px solid ${T.ink}`,
      boxShadow: '0 3px 0 ' + T.ink,
    },
    ghost: {
      background: 'transparent', color: T.ink,
      border: 'none',
    },
    danger: {
      background: T.red, color: '#fff',
      boxShadow: '0 4px 0 rgba(180,55,45,1)',
      border: 'none',
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        height: s.h, padding: s.pad, fontSize: s.fs,
        fontFamily: T.font.sans, fontWeight: 700,
        borderRadius: T.r.full,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        width: full ? '100%' : 'auto',
        transition: 'transform .12s ease, box-shadow .12s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(2px)'; }}}
      onMouseUp={e => { if (!disabled) { e.currentTarget.style.transform = ''; }}}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = ''; }}}
    >
      {icon}{children}{iconRight}
    </button>
  );
}

// ===== Card =====
function Card({ children, style = {}, padding = 20, hover = false, onClick, accent }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        borderRadius: T.r.lg,
        padding,
        boxShadow: T.shadow.card,
        border: accent ? `2px solid ${accent}` : `1px solid ${T.line}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform .15s ease, box-shadow .15s ease',
        ...(hover && {
          ':hover': { transform: 'translateY(-2px)' },
        }),
        ...style,
      }}
      onMouseEnter={hover ? e => e.currentTarget.style.transform = 'translateY(-2px)' : undefined}
      onMouseLeave={hover ? e => e.currentTarget.style.transform = '' : undefined}
    >{children}</div>
  );
}

// ===== Input =====
function Input({ label, value, onChange, placeholder, type = 'text', hint, error,
  prefix, suffix, style = {}, autoFocus }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label style={{ display: 'block', ...style }}>
      {label && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 6,
          fontFamily: T.font.sans,
        }}>{label}</div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 48, borderRadius: T.r.md,
        padding: '0 14px',
        background: T.surface,
        border: `2px solid ${error ? T.red : (focused ? T.ink : T.line)}`,
        transition: 'border-color .15s',
      }}>
        {prefix && <span style={{ color: T.muted, fontFamily: T.font.sans, fontSize: 15 }}>{prefix}</span>}
        <input
          autoFocus={autoFocus}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font.sans, fontSize: 15, color: T.ink,
            height: '100%',
          }}
        />
        {suffix && <span style={{ color: T.muted, fontFamily: T.font.mono, fontSize: 13 }}>{suffix}</span>}
      </div>
      {hint && !error && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: T.red, marginTop: 4, fontWeight: 600 }}>{error}</div>}
    </label>
  );
}

// ===== Pill / Badge =====
function Pill({ children, color = T.ink, bg, size = 'md', icon, style = {} }) {
  const sizes = {
    sm: { fs: 11, pad: '2px 8px', h: 22 },
    md: { fs: 12, pad: '4px 10px', h: 26 },
    lg: { fs: 13, pad: '6px 14px', h: 32 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: s.pad, height: s.h,
      borderRadius: T.r.full,
      background: bg || (color === T.ink ? T.line : color + '22'),
      color, fontFamily: T.font.sans, fontWeight: 600, fontSize: s.fs,
      lineHeight: 1, whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon}{children}
    </span>
  );
}

// ===== Money formatter =====
const fmtCLP = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('es-CL');
const fmtCLPSigned = (n) => (n < 0 ? '-' : '+') + fmtCLP(n);
const fmtK = (n) => '$' + (Math.round(n/1000)).toLocaleString('es-CL') + 'k';

// ===== Icon (inline SVG, stroke=currentColor) =====
function Icon({ name, size = 20, style = {}, color = 'currentColor' }) {
  const paths = {
    home: <><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>,
    pie:  <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow_right: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrow_left:  <><path d="M19 12H5M11 19l-7-7 7-7"/></>,
    chevron_right:<><path d="M9 6l6 6-6 6"/></>,
    chevron_down:<><path d="M6 9l6 6 6-6"/></>,
    chevron_up:<><path d="M18 15l-6-6-6 6"/></>,
    close: <><path d="M18 6L6 18M6 6l12 12"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/></>,
    bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    sparkle: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    check: <><path d="M20 6L9 17l-5-5"/></>,
    bank: <><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-7M15 21v-7"/></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>,
    arrow_up: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrow_down: <><path d="M12 5v14M19 12l-7 7-7-7"/></>,
    trending: <><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    egg: <><path d="M12 2C8 2 5 8 5 14a7 7 0 0 0 14 0c0-6-3-12-7-12z"/></>,
    gift: <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      {paths[name] || null}
    </svg>
  );
}

Object.assign(window, { T, Button, Card, Input, Pill, Icon, fmtCLP, fmtCLPSigned, fmtK });
