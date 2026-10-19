import { useState, type MouseEvent } from 'react';
import { ChartTooltip, SERIES_COLORS, type TipState } from './ChartTooltip';
import { niceScale, pointerIn } from './scale';

export interface LineSeries {
  name: string;
  /** null = không có số liệu tại điểm đó */
  values: (number | null)[];
}

interface LineChartProps {
  labels: string[];
  /** Tối đa 2 chuỗi */
  series: LineSeries[];
  format: (v: number) => string;
  axisFormat?: (v: number) => string;
  tipTitle?: (i: number) => string;
  /** Khoảng trục Y, mặc định tự tính từ dữ liệu */
  domain?: [number, number];
  target?: { value: number; label: string };
  /** Từ chỉ số này trở đi là số dự báo: nét đứt, điểm rỗng, nền vùng dự báo */
  forecastFrom?: number;
  /** Khoảng tin cậy cho chuỗi đầu tiên */
  band?: { lo: (number | null)[]; hi: (number | null)[] };
  labelEvery?: number;
  height?: number;
  ariaLabel: string;
}

/** Biểu đồ đường 1–2 chuỗi, có crosshair + tooltip, hỗ trợ đoạn dự báo và khoảng tin cậy */
export function LineChart({ labels, series, format, axisFormat = format, tipTitle, domain, target, forecastFrom, band, labelEvery = 1, height = 210, ariaLabel }: LineChartProps) {
  const [hover, setHover] = useState<number>();
  const [tip, setTip] = useState<TipState>(null);
  const W = 520, H = height, L = 44, R = 14, T = 14, B = 26;
  const iw = W - L - R, ih = H - T - B;
  const n = labels.length;

  const all = [...series.flatMap((s) => s.values), ...(band ? [...band.lo, ...band.hi] : []), target?.value ?? null].filter((v): v is number => v !== null);
  const { min, max, ticks } = domain ? { min: domain[0], max: domain[1], ticks: niceScale(domain[0], domain[1]).ticks.filter((t) => t >= domain[0] && t <= domain[1]) } : niceScale(Math.min(0, ...all), Math.max(...all));
  const x = (i: number) => L + (n > 1 ? (iw / (n - 1)) * i : iw / 2);
  const y = (v: number) => T + ih - ((v - min) / (max - min)) * ih;
  const color = (k: number) => SERIES_COLORS[k];
  const isForecast = (i: number) => forecastFrom !== undefined && i >= forecastFrom;

  /** Nối các điểm liên tiếp có số liệu trong khoảng [from, to] */
  const path = (vals: (number | null)[], from: number, to: number) => {
    let d = '';
    let pen = false;
    for (let i = from; i <= to; i++) {
      const v = vals[i];
      if (v === null || v === undefined) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${x(i)},${y(v)} `;
      pen = true;
    }
    return d;
  };

  const bandPath = band
    ? (() => {
        const idx = labels.map((_, i) => i).filter((i) => band.lo[i] !== null && band.hi[i] !== null);
        if (!idx.length) return '';
        const top = idx.map((i, k) => `${k ? 'L' : 'M'}${x(i)},${y(band.hi[i]!)}`).join(' ');
        const bottom = [...idx].reverse().map((i) => `L${x(i)},${y(band.lo[i]!)}`).join(' ');
        return `${top} ${bottom} Z`;
      })()
    : '';

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const p = pointerIn(e, W);
    const i = Math.max(0, Math.min(n - 1, Math.round((p.xView - L) / (iw / Math.max(1, n - 1)))));
    setHover(i);
    const lines = series.filter((s) => s.values[i] !== null).map((s) => `${s.name}${isForecast(i) ? ' (dự báo)' : ''}: ${format(s.values[i]!)}`);
    if (band && band.lo[i] !== null && band.hi[i] !== null) lines.push(`Khoảng tin cậy 80%: ${format(band.lo[i]!)} – ${format(band.hi[i]!)}`);
    setTip({ x: p.x, y: p.y, title: tipTitle ? tipTitle(i) : labels[i], lines });
  };

  const last = n - 1;

  return (
    <>
      {(series.length > 1 || forecastFrom !== undefined) && (
        <div className="rc-legend">
          {series.map((s, k) => <span key={s.name}><i style={{ background: color(k) }} /> {s.name}</span>)}
          {forecastFrom !== undefined && <span><i className="rc-legend__dash" /> Dự báo</span>}
          {band && <span><i style={{ background: SERIES_COLORS[0], opacity: 0.15 }} /> Khoảng tin cậy 80%</span>}
        </div>
      )}
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="rc-svg" role="img" aria-label={ariaLabel} onMouseMove={onMove} onMouseLeave={() => { setHover(undefined); setTip(null); }}>
          {forecastFrom !== undefined && (
            <>
              <rect x={x(forecastFrom) - (iw / Math.max(1, n - 1)) / 2} y={T} width={W - R - (x(forecastFrom) - (iw / Math.max(1, n - 1)) / 2)} height={ih} className="rc-forecast" />
              <text x={W - R - 4} y={T + 10} className="rc-axis" textAnchor="end">Dự báo</text>
            </>
          )}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="rc-grid" />
              <text x={L - 6} y={y(v) + 3} className="rc-axis" textAnchor="end">{axisFormat(v)}</text>
            </g>
          ))}
          {bandPath && <path d={bandPath} fill={SERIES_COLORS[0]} opacity={0.12} />}
          {target && (
            <>
              <line x1={L} x2={W - R} y1={y(target.value)} y2={y(target.value)} className="rc-target" />
              <text x={L + 4} y={y(target.value) - 5} className="rc-axis" textAnchor="start">{target.label}</text>
            </>
          )}
          {hover !== undefined && <line x1={x(hover)} x2={x(hover)} y1={T} y2={T + ih} className="rc-cross" />}
          {series.map((s, k) => (
            <g key={s.name}>
              <path d={path(s.values, 0, forecastFrom !== undefined ? forecastFrom - 1 : last)} fill="none" stroke={color(k)} strokeWidth={2} strokeLinejoin="round" />
              {forecastFrom !== undefined && (
                <path d={path(s.values, Math.max(0, forecastFrom - 1), last)} fill="none" stroke={color(k)} strokeWidth={2} strokeDasharray="5 4" />
              )}
              {s.values.map((v, i) =>
                v === null ? null : (
                  <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 4} fill={isForecast(i) ? 'var(--surface)' : color(k)} stroke={isForecast(i) ? color(k) : 'var(--surface)'} strokeWidth={2} />
                ),
              )}
            </g>
          ))}
          {labels.map((lab, i) => (i % labelEvery === last % labelEvery ? <text key={lab} x={x(i)} y={H - 8} className="rc-axis" textAnchor="middle">{lab}</text> : null))}
        </svg>
        <ChartTooltip tip={tip} />
      </div>
    </>
  );
}
