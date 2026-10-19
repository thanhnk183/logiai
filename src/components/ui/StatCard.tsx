import type { StatItem } from '../../types';
import { ModuleTag, toneColor } from './Badge';

export function StatCard({ item }: { item: StatItem }) {
  return (
    <div className="card stat">
      <div className="stat__label">
        <span>{item.label}</span>
        {item.module && <ModuleTag module={item.module} />}
      </div>
      <div className="stat__value" style={item.valueTone && { color: toneColor[item.valueTone] }}>
        {item.value}
      </div>
      <div className="stat__note" style={item.noteTone && { color: toneColor[item.noteTone] }}>
        {item.note}
      </div>
    </div>
  );
}

export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <StatCard key={s.label} item={s} />
      ))}
    </div>
  );
}
