import { TriangleAlert } from 'lucide-react';
import { formatNumber } from '../../utils/format';

export interface HBarRow {
  label: string;
  value: number;
  sub?: string;
}

interface HBarsProps {
  rows: HBarRow[];
  unit: string;
  /** Mục tiêu (thang 0–100). Có mục tiêu thì thanh tính theo 100 và giá trị dưới mục tiêu có icon cảnh báo */
  target?: number;
  /** min: cảnh báo khi thấp hơn mục tiêu (mặc định) · max: cảnh báo khi vượt ngưỡng */
  targetMode?: 'min' | 'max';
  /** Giá trị tối đa của thang, mặc định là giá trị lớn nhất */
  max?: number;
}

/** Thanh ngang một chuỗi, nhãn và giá trị nằm trên thanh */
export function HBars({ rows, unit, target, targetMode = 'min', max }: HBarsProps) {
  const scale = max ?? (target !== undefined ? 100 : Math.max(...rows.map((r) => r.value)));
  return (
    <div className="hbars">
      {rows.map((r) => {
        const breach = target !== undefined && (targetMode === 'max' ? r.value > target : r.value < target);
        return (
          <div key={r.label} className="hbars__row" title={`${r.label}: ${formatNumber(r.value, 1)}${unit}`}>
            <div className="hbars__label">
              <span>{r.label}</span>
              <span className="hbars__value">
                {breach && <TriangleAlert size={12} color="var(--red)" aria-label={targetMode === 'max' ? 'Vượt ngưỡng' : 'Dưới mục tiêu'} />}
                {formatNumber(r.value, 1)}{unit}
              </span>
            </div>
            <div className="hbars__track">
              <div className="hbars__fill" style={{ width: `${(r.value / scale) * 100}%` }} />
              {target !== undefined && <span className="hbars__target" style={{ left: `${(target / scale) * 100}%` }} title={`Mục tiêu ${target}${unit}`} />}
            </div>
            {r.sub && <div className="subtle" style={{ fontSize: 11 }}>{r.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}
