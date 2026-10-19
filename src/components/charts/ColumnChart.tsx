import { useState, type MouseEvent } from 'react';
import { ChartTooltip, SERIES_COLORS, type TipState } from './ChartTooltip';
import { niceScale, pointerIn } from './scale';

export interface ColumnSeries {
  name: string;
  values: number[];
}

interface ColumnChartProps {
  labels: string[];
  /** Tối đa 2 chuỗi (bảng màu 2 chuỗi đã kiểm tra) */
  series: ColumnSeries[];
  stacked?: boolean;
  /** Định dạng giá trị trong tooltip */
  format: (v: number) => string;
  /** Định dạng nhãn trục Y, mặc định giống `format` */
  axisFormat?: (v: number) => string;
  /** Tiêu đề tooltip theo cột, mặc định là nhãn cột */
  tipTitle?: (i: number) => string;
  /** Đường mục tiêu / công suất nằm ngang */
  target?: { value: number; label: string };
  /** Cột được nhấn mạnh (vd. tuần hiện tại); các cột khác nhạt hơn khi có chuỗi đơn */
  highlight?: number;
  /** Chỉ hiện nhãn trục X mỗi n cột */
  labelEvery?: number;
  height?: number;
  ariaLabel: string;
}

const GAP = 2;

/** Biểu đồ cột 1–2 chuỗi (cạnh nhau hoặc chồng), có tooltip theo cột */
export function ColumnChart({ labels, series, stacked = false, format, axisFormat = format, tipTitle, target, highlight, labelEvery = 1, height = 210, ariaLabel }: ColumnChartProps) {
  const [hover, setHover] = useState<number>();
  const [tip, setTip] = useState<TipState>(null);
  const W = 520, H = height, L = 44, R = 10, T = 12, B = 26;
  const iw = W - L - R, ih = H - T - B;
  const n = labels.length;
  const peak = Math.max(
    ...labels.map((_, i) => (stacked ? series.reduce((s, x) => s + x.values[i], 0) : Math.max(...series.map((x) => x.values[i])))),
    target?.value ?? 0,
  );
  const { max, ticks } = niceScale(0, peak);
  const h = (v: number) => (v / max) * ih;
  const slot = iw / n;
  const groupW = slot * (n > 10 ? 0.66 : 0.6);
  const barW = stacked ? groupW : (groupW - GAP * (series.length - 1)) / series.length;
  const color = (k: number) => SERIES_COLORS[k];

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const p = pointerIn(e, W);
    const i = Math.max(0, Math.min(n - 1, Math.floor((p.xView - L) / slot)));
    setHover(i);
    const lines = series.map((s) => `${s.name}: ${format(s.values[i])}`);
    if (stacked && series.length > 1) lines.push(`Tổng: ${format(series.reduce((s, x) => s + x.values[i], 0))}`);
    setTip({ x: p.x, y: p.y, title: tipTitle ? tipTitle(i) : labels[i], lines });
  };

  return (
    <>
      {(series.length > 1 || target) && (
        <div className="rc-legend">
          {series.map((s, k) => <span key={s.name}><i style={{ background: color(k) }} /> {s.name}</span>)}
          {/* nhãn đường mục tiêu đặt ở chú giải để không bị cột che */}
          {target && <span><i className="rc-legend__dash" /> {target.label}</span>}
        </div>
      )}
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="rc-svg" role="img" aria-label={ariaLabel} onMouseMove={onMove} onMouseLeave={() => { setHover(undefined); setTip(null); }}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={T + ih - h(v)} y2={T + ih - h(v)} className="rc-grid" />
              <text x={L - 6} y={T + ih - h(v) + 3} className="rc-axis" textAnchor="end">{axisFormat(v)}</text>
            </g>
          ))}
          {labels.map((lab, i) => {
            const gx = L + slot * i + (slot - groupW) / 2;
            const dim = hover !== undefined ? hover !== i : highlight !== undefined && series.length === 1 && highlight !== i;
            let base = T + ih;
            return (
              <g key={lab} opacity={dim ? 0.5 : 1}>
                {series.map((s, k) => {
                  const bh = h(s.values[i]);
                  if (stacked) {
                    const y = base - bh - (k ? GAP : 0);
                    base = y;
                    return bh > 0 ? <rect key={s.name} x={gx} y={y} width={barW} height={bh} rx={2} fill={color(k)} /> : null;
                  }
                  return bh > 0 ? <rect key={s.name} x={gx + k * (barW + GAP)} y={T + ih - bh} width={barW} height={bh} rx={2} fill={color(k)} /> : null;
                })}
                {i % labelEvery === (n - 1) % labelEvery && (
                  <text x={gx + groupW / 2} y={H - 8} className="rc-axis" textAnchor="middle">{lab}</text>
                )}
              </g>
            );
          })}
          {target && <line x1={L} x2={W - R} y1={T + ih - h(target.value)} y2={T + ih - h(target.value)} className="rc-target" />}
        </svg>
        <ChartTooltip tip={tip} />
      </div>
    </>
  );
}
