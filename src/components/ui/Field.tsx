import type { ReactNode } from 'react';

/** Cặp nhãn – giá trị trong panel chi tiết. Dùng bên trong `.kv-grid`. */
export function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div style={full ? { gridColumn: '1 / -1' } : undefined}>
      <div className="kv__k">{label}</div>
      <div className="kv__v">{children}</div>
    </div>
  );
}
