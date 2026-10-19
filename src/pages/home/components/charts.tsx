import { Card } from '../../../components/ui/Card';
import { jobsByType, onTimeRate, weeklyJobs, weeks } from '../data';

const W = 220;
const H = 100;
const PAD = { l: 26, r: 6, t: 6, b: 18 };
const innerW = W - PAD.l - PAD.r;
const innerH = H - PAD.t - PAD.b;

export function WeeklyJobsChart() {
  const max = 150;
  const slot = innerW / weeklyJobs.length;
  const barW = slot * 0.72;
  const latest = weeklyJobs.length - 1;

  return (
    <Card title="Job mở mới theo tuần" subtitle={`Tuần này: ${weeklyJobs[latest]} job, cao nhất 8 tuần`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Biểu đồ job mở mới theo tuần">
        {[0, 50, 100, 150].map((v) => {
          const y = PAD.t + innerH - (v / max) * innerH;
          return (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} className="chart__grid" />
              <text x={PAD.l - 4} y={y + 2} className="chart__axis" textAnchor="end">{v}</text>
            </g>
          );
        })}
        {weeklyJobs.map((v, i) => {
          const h = (v / max) * innerH;
          const x = PAD.l + i * slot + (slot - barW) / 2;
          return (
            <g key={weeks[i]}>
              <rect x={x} y={PAD.t + innerH - h} width={barW} height={h} rx={1.5}
                fill={i === latest ? 'var(--brand)' : '#7fa6d6'}>
                <title>{`${weeks[i]}: ${v} job`}</title>
              </rect>
              <text x={x + barW / 2} y={H - 6} className="chart__axis" textAnchor="middle">{weeks[i]}</text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

export function OnTimeChart() {
  const min = 89;
  const max = 97;
  const target = 95;
  const yOf = (v: number) => PAD.t + innerH - ((v - min) / (max - min)) * innerH;
  const step = innerW / (onTimeRate.length - 1);
  const pts = onTimeRate.map((v, i) => [PAD.l + i * step, yOf(v)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${PAD.t + innerH} L${PAD.l},${PAD.t + innerH} Z`;
  const hits = onTimeRate.filter((v) => v >= target).length;

  return (
    <Card title="Tỷ lệ giao đúng hạn" subtitle={`8 tuần gần nhất · ${hits} tuần đạt mục tiêu ${target}%`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Biểu đồ tỷ lệ giao đúng hạn">
        {[89, 93, 97].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(v)} y2={yOf(v)} className="chart__grid" />
            <text x={PAD.l - 4} y={yOf(v) + 2} className="chart__axis" textAnchor="end">{v}%</text>
          </g>
        ))}
        <path d={area} fill="var(--brand)" opacity={0.08} />
        <line x1={PAD.l} x2={W - PAD.r} y1={yOf(target)} y2={yOf(target)}
          stroke="var(--amber)" strokeDasharray="2 2" strokeWidth={0.7} />
        <text x={W - PAD.r} y={yOf(target) - 2} className="chart__axis" textAnchor="end" style={{ fill: 'var(--amber)' }}>
          Mục tiêu {target}%
        </text>
        <path d={line} fill="none" stroke="var(--brand)" strokeWidth={1.2} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} fill="#fff" stroke="var(--brand)" strokeWidth={0.9}>
            <title>{`${weeks[i]}: ${onTimeRate[i].toLocaleString('vi-VN')}%`}</title>
          </circle>
        ))}
        {weeks.map((w, i) => (
          <text key={w} x={PAD.l + i * step} y={H - 6} className="chart__axis" textAnchor="middle">{w}</text>
        ))}
      </svg>
    </Card>
  );
}

export function JobTypeBars() {
  const total = jobsByType.reduce((s, j) => s + j.count, 0);
  const max = Math.max(...jobsByType.map((j) => j.count));
  return (
    <Card title="Job đang mở theo loại hình" subtitle={`Tổng ${total} job`}>
      <div className="type-bars">
        {jobsByType.map((j) => (
          <div key={j.label} className="type-bars__row">
            <span>{j.label}</span>
            <div className="progress" style={{ height: 8 }}>
              <div className="progress__bar" style={{ width: `${(j.count / max) * 100}%`, background: 'var(--brand)' }} />
            </div>
            <span className="type-bars__num">
              <b>{j.count}</b> <span className="subtle">{j.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
