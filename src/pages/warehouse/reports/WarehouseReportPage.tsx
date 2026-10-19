import { useState, type MouseEvent } from 'react';
import { ChartColumn } from 'lucide-react';
import { ChartTooltip, SERIES_COLORS, type TipState } from '../../../components/charts/ChartTooltip';
import { HBars } from '../../../components/charts/HBars';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { WAREHOUSE, agingBuckets, findSku, flowDays, inboundByDay, outboundByDay, topMovers, zoneFill, zones } from '../data';
import '../warehouse.css';

const [IN_COLOR, OUT_COLOR] = SERIES_COLORS;
const OCCUPANCY_LIMIT = 85;

/** Nhập / xuất theo ngày: cột đôi, 2px khe giữa hai cột */
function FlowChart() {
  const [hover, setHover] = useState<number>();
  const [tip, setTip] = useState<TipState>(null);
  const W = 520, H = 210, L = 38, R = 8, T = 10, B = 26;
  const iw = W - L - R, ih = H - T - B;
  const max = 1000;
  const slot = iw / flowDays.length;
  const bw = (slot * 0.7 - 2) / 2;
  const y = (v: number) => (v / max) * ih;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget.getBoundingClientRect();
    const wrap = (e.currentTarget.closest('.chart-wrap') as HTMLElement).getBoundingClientRect();
    const xIn = ((e.clientX - svg.left) / svg.width) * W;
    const i = Math.max(0, Math.min(flowDays.length - 1, Math.floor((xIn - L) / slot)));
    setHover(i);
    setTip({
      x: e.clientX - wrap.left, y: e.clientY - wrap.top, title: `Ngày ${flowDays[i]}/10`,
      lines: [`Nhập: ${formatNumber(inboundByDay[i])} thùng`, `Xuất: ${formatNumber(outboundByDay[i])} thùng`],
    });
  };

  return (
    <Card title="Nhập và xuất theo ngày" subtitle="14 ngày gần nhất · đơn vị thùng / cuộn / hộp">
      <div className="rc-legend">
        <span><i style={{ background: IN_COLOR }} /> Nhập</span>
        <span><i style={{ background: OUT_COLOR }} /> Xuất</span>
      </div>
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Nhập và xuất kho theo ngày" onMouseMove={onMove} onMouseLeave={() => { setHover(undefined); setTip(null); }}>
          {[0, 500, 1000].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={T + ih - y(v)} y2={T + ih - y(v)} className="rc-grid" />
              <text x={L - 6} y={T + ih - y(v) + 3} className="rc-axis" textAnchor="end">{formatNumber(v)}</text>
            </g>
          ))}
          {flowDays.map((d, i) => {
            const x0 = L + slot * i + slot * 0.15;
            return (
              <g key={d} opacity={hover === undefined || hover === i ? 1 : 0.5}>
                <rect x={x0} y={T + ih - y(inboundByDay[i])} width={bw} height={y(inboundByDay[i])} fill={IN_COLOR} rx={2} />
                <rect x={x0 + bw + 2} y={T + ih - y(outboundByDay[i])} width={bw} height={y(outboundByDay[i])} fill={OUT_COLOR} rx={2} />
                {i % 2 === 1 && <text x={x0 + bw + 1} y={H - 8} className="rc-axis" textAnchor="middle">{d}</text>}
              </g>
            );
          })}
        </svg>
        <ChartTooltip tip={tip} />
      </div>
    </Card>
  );
}

export default function WarehouseReportPage() {
  const totalIn = inboundByDay.reduce((s, v) => s + v, 0);
  const totalOut = outboundByDay.reduce((s, v) => s + v, 0);
  const totalAged = agingBuckets.reduce((s, b) => s + b.value, 0);

  return (
    <>
      <PageHeader
        icon={<ChartColumn size={18} />}
        section="Kho"
        title="Báo cáo kho"
        description={`Sản lượng nhập xuất, mức lấp đầy theo khu, tuổi tồn kho và mã hàng luân chuyển nhiều nhất tại ${WAREHOUSE}.`}
        actions={<button className="btn">Xuất Excel</button>}
      />
      <StatGrid
        items={[
          { label: 'Nhập · 14 ngày', value: formatNumber(totalIn), note: 'thùng, cuộn, hộp', module: 'WMS' },
          { label: 'Xuất · 14 ngày', value: formatNumber(totalOut), note: `Chênh lệch +${formatNumber(totalIn - totalOut)} vào tồn` },
          { label: 'Độ chính xác tồn kho', value: '99,2%', note: 'Mục tiêu 99,5%', noteTone: 'amber' },
          { label: 'Doanh thu dịch vụ kho · T10', value: '312 tr ₫', note: 'Lưu kho, bốc xếp, dán nhãn', noteTone: 'green' },
        ]}
      />

      <div className="report-grid">
        <FlowChart />
        <Card title="Lấp đầy theo khu" subtitle={`Vạch dọc là ngưỡng ${OCCUPANCY_LIMIT}%, vượt ngưỡng nên mở thêm vị trí`}>
          <HBars
            rows={zones.map((z) => ({ label: z.name, value: zoneFill(z), sub: `${z.customer} · ${z.temp}` }))}
            unit="%"
            target={OCCUPANCY_LIMIT}
            targetMode="max"
          />
        </Card>
        <Card title="Tuổi tồn kho" subtitle={`${formatNumber(totalAged)} đơn vị đang lưu, tính từ ngày nhập`}>
          <HBars rows={agingBuckets.map((b) => ({ label: b.label, value: b.value, sub: `${formatNumber((b.value / totalAged) * 100, 1)}% tổng tồn` }))} unit="" />
        </Card>
        <Card title="Luân chuyển nhiều nhất · 30 ngày" bodyClassName="table-wrap">
          <table className="table">
            <thead><tr><th>Mã hàng</th><th className="num">Nhập</th><th className="num">Xuất</th><th className="num">Số ngày tồn bình quân</th></tr></thead>
            <tbody>
              {topMovers.map((m) => (
                <tr key={m.sku}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{findSku(m.sku).name}</div>
                    <div className="mono subtle" style={{ fontSize: 11 }}>{m.sku}</div>
                  </td>
                  <td className="num">{formatNumber(m.in)}</td>
                  <td className="num">{formatNumber(m.out)}</td>
                  <td className="num">{m.days} ngày</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
