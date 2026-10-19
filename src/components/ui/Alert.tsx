import type { ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { Tone } from '../../types';

export function Alert({ tone = 'blue', children }: { tone?: Tone; children: ReactNode }) {
  const Icon = tone === 'red' || tone === 'amber' ? AlertTriangle : Info;
  return (
    <div className={`alert alert--${tone}`} role={tone === 'red' ? 'alert' : undefined}>
      <Icon size={15} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>{children}</div>
    </div>
  );
}
