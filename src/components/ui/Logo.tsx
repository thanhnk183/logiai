interface LogoMarkProps {
  size?: number;
  inverted?: boolean;
}

export function LogoMark({ size = 32, inverted = false }: LogoMarkProps) {
  const bg = inverted ? '#ffffff' : '#0B5CAB';
  const fg = inverted ? '#0B5CAB' : '#ffffff';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={bg} />
      <path d="M18 14h9v27h19v9H18z" fill={fg} />
      <circle cx="44" cy="22" r="7" fill="#FF7A2F" />
    </svg>
  );
}

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <LogoMark size={30} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>
          Logi<span style={{ color: 'var(--brand)' }}>AI</span>
        </div>
        <div className="mono" style={{ fontSize: 8, letterSpacing: '0.18em', color: 'var(--text-3)', marginTop: 3 }}>
          WORKSPACE
        </div>
      </div>
    </div>
  );
}
