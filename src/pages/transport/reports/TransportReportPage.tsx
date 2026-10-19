import { useState, type MouseEvent } from 'react';
import { BarChart3 } from 'lucide-react';
import { ChartTooltip, SERIES_COLORS, type TipState } from '../../../components/charts/ChartTooltip';
import { HBars } from '../../../components/charts/HBars';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { contractors, delayReasons, onTimeByWeek, reportWeeks, routeCosts, tripDays, tripsContractor, tripsInternal } from '../data';
import '../transport.css';

const SERIES = { internal: SERIES_COLORS[0], contractor: SERIES_COLORS[1] };
const ON_TIME_TARGET = 95;
const CONTRACTOR_TARGET = 90;

/** Tìm vị trí chuột trong khung chart (px) và chỉ số cột gần nhất */
function pointer(e: MouseEvent<SVGElement>, count: number, padL: number, padR: number, width: number) {
  const box = (e.currentTarget.closest('.chart-wrap') as HTMLElement).getBoundingClientRect();
  const svgBox = e.currentTarget.getBoundingClientRect();
  const scale = svgBox.width / width;
  const xIn = (e.clientX - svgBox.left) / scale;
  const step = (width - padL - padR) / count;
  const idx = Math.max(0, Math.min(count - 1, Math.floor((xIn - padL) / step)));
  return { idx, x: e.clientX - box.left, y: e.clientY - box.top, scale };
}

// ---------- Tỷ lệ đúng giờ theo tuần (đường) ----------
function OnTimeChart() {
  const [hover, setHover] = useState<number>();
  const [tip, setTip] = useState<TipState>(null);
  const W = 480, H = 200, L = 36, R = 12, T = 12, B = 26;
  const min = 90, max = 97;
  const iw = W - L - R, ih = H - T - B;
  const x = (i: number) => L + (iw / (onTimeByWeek.length - 1)) * i;
  const y = (v: number) => T + ih - ((v - min) / (max - min)) * ih;
  const path = onTimeByWeek.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const svgBox = e.currentTarget.getBoundingClientRect();
    const scale = svgBox.width / W;
    const xIn = (e.clientX - svgBox.left) / scale;
    const idx = Math.max(0, Math.min(onTimeByWeek.length - 1, Math.round((xIn - L) / (iw / (onTimeByWeek.length - 1)))));
    const box = (e.currentTarget.closest('.chart-wrap') as HTMLElement).getBoundingClientRect();
    setHover(idx);
    setTip({
      x: e.clientX - box.left, y: e.clientY - box.top, title: `Tuần ${reportWeeks[idx].slice(1)}`,
      lines: [`Đúng giờ: ${formatNumber(onTimeByWeek[idx], 1)}%`, onTimeByWeek[idx] >= ON_TIME_TARGET ? 'Đạt mục tiêu' : `Thấp hơn mục tiêu ${formatNumber(ON_TIME_TARGET - onTimeByWeek[idx], 1)} điểm`],
    });
  };

  return (
    <Card title="Tỷ lệ giao đúng giờ theo tuần" subtitle={`8 tuần gần nhất · mục tiêu ${ON_TIME_TARGET}%`}>
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Tỷ lệ giao đúng giờ 8 tuần" onMouseMove={onMove} onMouseLeave={() => { setHover(undefined); setTip(null); }}>
          {[90, 93, 96].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="rc-grid" />
              <text x={L - 6} y={y(v) + 3} className="rc-axis" textAnchor="end">{v}%</text>
            </g>
          ))}
          <line x1={L} x2={W - R} y1={y(ON_TIME_TARGET)} y2={y(ON_TIME_TARGET)} className="rc-target" />
          {/* nhãn đặt ở đầu trái: tuần đầu thấp hơn mục tiêu nên không đè lên điểm dữ liệu */}
          <text x={L + 4} y={y(ON_TIME_TARGET) - 5} className="rc-axis" textAnchor="start">Mục tiêu {ON_TIME_TARGET}%</text>
          {hover !== undefined && <line x1={x(hover)} x2={x(hover)} y1={T} y2={T + ih} className="rc-cross" />}
          <path d={path} fill="none" stroke={SERIES.internal} strokeWidth={2} />
          {onTimeByWeek.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 4} fill={SERIES.internal} stroke="var(--surface)" strokeWidth={2} />
          ))}
          <text x={x(onTimeByWeek.length - 1)} y={y(onTimeByWeek[onTimeByWeek.length - 1]) + 16} className="rc-label" textAnchor="end">
            {formatNumber(onTimeByWeek[onTimeByWeek.length - 1], 1)}%
          </text>
          {reportWeeks.map((w, i) => <text key={w} x={x(i)} y={H - 8} className="rc-axis" textAnchor="middle">{w}</text>)}
        </svg>
        <ChartTooltip tip={tip} />
      </div>
    </Card>
  );
}

// ---------- Số chuyến theo ngày (cột chồng) ----------
function TripsChart() {
  const [hover, setHover] = useState<number>();
  const [tip, setTip] = useState<TipState>(null);
  const W = 480, H = 200, L = 30, R = 8, T = 10, B = 26;
  const iw = W - L - R, ih = H - T - B;
  const max = 25;
  const slot = iw / tripDays.length;
  const bw = slot * 0.62;
  const yv = (v: number) => (v / max) * ih;
  const GAP = 2;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const p = pointer(e, tripDays.length, L, R, W);
    const a = tripsInternal[p.idx], b = tripsContractor[p.idx];
    setHover(p.idx);
    setTip({ x: p.x, y: p.y, title: `Ngày ${tripDays[p.idx]}/10`, lines: [`Xe nội bộ: ${a} chuyến`, `Xe nhà thầu: ${b} chuyến`, `Tổng: ${a + b}`] });
  };

  return (
    <Card title="Số chuyến theo ngày" subtitle="14 ngày gần nhất · xe nội bộ và xe nhà thầu">
      <div className="rc-legend">
        <span><i style={{ background: SERIES.internal }} /> Xe nội bộ</span>
        <span><i style={{ background: SERIES.contractor }} /> Xe nhà thầu</span>
      </div>
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Số chuyến theo ngày" onMouseMove={onMove} onMouseLeave={() => { setHover(undefined); setTip(null); }}>
          {[0, 10, 20].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={T + ih - yv(v)} y2={T + ih - yv(v)} className="rc-grid" />
              <text x={L - 6} y={T + ih - yv(v) + 3} className="rc-axis" textAnchor="end">{v}</text>
            </g>
          ))}
          {tripDays.map((d, i) => {
            const bx = L + slot * i + (slot - bw) / 2;
            const hi = yv(tripsInternal[i]);
            const hc = yv(tripsContractor[i]);
            return (
              <g key={d} opacity={hover === undefined || hover === i ? 1 : 0.55}>
                {/* đoạn dưới gắn trục: bo góc phía trên; đoạn trên cách 2px */}
                <rect x={bx} y={T + ih - hi} width={bw} height={hi} fill={SERIES.internal} rx={2} />
                <rect x={bx} y={T + ih - hi - GAP - hc} width={bw} height={hc} fill={SERIES.contractor} rx={2} />
                {i % 2 === 1 && <text x={bx + bw / 2} y={H - 8} className="rc-axis" textAnchor="middle">{d}</text>}
              </g>
            );
          })}
        </svg>
        <ChartTooltip tip={tip} />
      </div>
    </Card>
  );
}

export default function TransportReportPage() {
  const active = contractors.filter((c) => c.tripsMonth > 0);
  const totalDelays = delayReasons.reduce((s, d) => s + d.count, 0);

  return (
    <>
      <PageHeader
        icon={<BarChart3 size={18} />}
        section="Vận tải"
        title="Báo cáo vận tải"
        description="Tỷ lệ giao đúng giờ, sản lượng chuyến, hiệu suất nhà thầu, nguyên nhân trễ và chi phí theo tuyến. Số liệu tháng 10/2026."
        actions={<button className="btn">Xuất Excel</button>}
      />
      <StatGrid
        items={[
          { label: 'Giao đúng giờ · 30 ngày', value: '94,2%', note: 'Mục tiêu 95%', module: 'TMS', noteTone: 'amber' },
          { label: 'Chuyến tháng 10', value: '214', note: '58% xe nội bộ, 42% xe nhà thầu' },
          { label: 'Chi phí bình quân / km', value: '26.800 ₫', note: '−3% so với tháng 9', noteTone: 'green' },
          { label: 'Tỷ lệ chạy rỗng', value: '31%', note: 'Mục tiêu dưới 28%', noteTone: 'amber' },
        ]}
      />

      <div className="report-grid">
        <OnTimeChart />
        <TripsChart />
        <Card title="Đúng giờ theo nhà thầu" subtitle={`Tháng 10 · vạch dọc là mục tiêu ${CONTRACTOR_TARGET}%`}>
          <HBars
            rows={active.map((c) => ({ label: c.name, value: c.onTime, sub: `${c.tripsMonth} chuyến` }))}
            unit="%"
            target={CONTRACTOR_TARGET}
          />
        </Card>
        <Card title="Nguyên nhân giao trễ" subtitle={`${totalDelays} chuyến trễ trong 30 ngày`}>
          <HBars rows={delayReasons.map((d) => ({ label: d.label, value: d.count }))} unit=" chuyến" />
        </Card>
      </div>

      <Card title="Chi phí theo tuyến" subtitle="Tháng 10 · chi phí gồm cước xe, BOT, nâng hạ" bodyClassName="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Tuyến</th><th className="num">Số chuyến</th><th className="num">Chi phí bình quân / chuyến</th><th className="num">Chi phí / km</th></tr>
          </thead>
          <tbody>
            {routeCosts.map((r) => (
              <tr key={r.route}>
                <td style={{ fontWeight: 600 }}>{r.route}</td>
                <td className="num">{r.trips}</td>
                <td className="num">{formatNumber(r.avgCost, 1)} tr ₫</td>
                <td className="num">{formatNumber(r.costPerKm, 1)} nghìn ₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
