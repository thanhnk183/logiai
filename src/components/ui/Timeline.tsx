export type TimelineState = 'done' | 'doing' | 'late' | 'todo' | 'rejected';

export interface TimelineItem {
  label: string;
  meta?: string;
  state: TimelineState;
}

/** Danh sách mốc theo chiều dọc: xong (đậm), đang làm (viền xanh), trễ/từ chối (đỏ), chưa tới (xám). */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="timeline">
      {items.map((it, i) => (
        <li key={i} className={`timeline__item is-${it.state}`}>
          <span className="timeline__dot" />
          <div>
            <div className="timeline__label">{it.label}</div>
            {it.meta && <div className="timeline__meta">{it.meta}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
