export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  full = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Pill({ children, variant = 'neutral', size = 'md', className = '' }) {
  return <span className={`pill pill--${variant} pill--${size} ${className}`}>{children}</span>;
}
