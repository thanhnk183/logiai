export type TipState = { x: number; y: number; title: string; lines: string[] } | null;

/** Tooltip của biểu đồ, đặt trong `.chart-wrap` (position: relative) */
export function ChartTooltip({ tip }: { tip: TipState }) {
  if (!tip) return null;
  return (
    <div className="chart-tip" style={{ left: tip.x, top: tip.y }}>
      <b>{tip.title}</b>
      {tip.lines.map((l) => <div key={l}>{l}</div>)}
    </div>
  );
}

/** Màu 2 chuỗi dùng chung cho mọi biểu đồ: xanh thương hiệu + cam (đã chạy kiểm tra phân biệt màu, CVD ΔE 26.9) */
export const SERIES_COLORS = ['#0B5CAB', '#E8711F'] as const;
