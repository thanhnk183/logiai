import type { ReactNode } from 'react';
import type { Module, Tone } from '../../types';

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function OutlineBadge({ children }: { children: ReactNode }) {
  return <span className="badge badge--outline">{children}</span>;
}

const moduleColor: Record<Module, string> = {
  FMS: 'var(--mod-fms)',
  DMS: 'var(--mod-dms)',
  CUS: 'var(--mod-cus)',
  TMS: 'var(--mod-tms)',
  WMS: 'var(--mod-wms)',
  FIN: 'var(--mod-fin)',
};

/** Nhãn phân hệ (FMS, DMS...). `plain` = chữ màu không nền. */
export function ModuleTag({ module, plain = false }: { module: Module; plain?: boolean }) {
  if (plain) {
    return (
      <span className="mod mod--text" style={{ color: moduleColor[module] }}>
        {module}
      </span>
    );
  }
  return (
    <span className="mod" style={{ background: moduleColor[module] }}>
      {module}
    </span>
  );
}

export const toneColor: Record<Tone, string> = {
  green: 'var(--green)',
  red: 'var(--red)',
  amber: 'var(--amber)',
  blue: 'var(--brand)',
  gray: 'var(--text-2)',
};
