import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { ColumnChart } from '../../../components/charts/ColumnChart';
import { HBars } from '../../../components/charts/HBars';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber, formatUsd } from '../../../utils/format';
import { customers } from '../../customers/list/data';
import { rfqStats, rfqs, salesPerformance, stages } from '../../customers/opportunities/data';
import { TEU_TARGET, lostReasons, months, newCustomersByMonth, teuByMonth, topLanes } from '../data';
import '../reports.css';

/** Phễu 90 ngày: RFQ nhận → đã báo giá → thương lượng → chốt */
const funnel = [
  { label: 'RFQ nhận', value: 186 },
  { label: 'Đã gửi báo giá', value: 152 },
  { label: 'Thương lượng', value: 74 },
  { label: 'Chốt', value: 49 },
];
const WIN_TARGET = 30;

export default function SalesDashboardPage() {
  const last = months.length - 1;
  const teuPrev = teuByMonth[last - 1];
  const byStage = stages.map((s) => {
    const list = rfqs.filter((r) => r.stage === s.key);
    return { label: s.title, value: list.length, sub: list.length ? formatUsd(list.reduce((t, r) => t + r.value, 0)) : 'Không có' };
  });

  return (
    <>
      <PageHeader
        icon={<Briefcase size={18} />}
        section="Báo cáo"
        title="Dashboard kinh doanh"
        description="Phễu RFQ đến chốt, sản lượng TEU, doanh số theo nhân viên và tuyến. Cơ hội đang mở đọc trực tiếp từ màn Cơ hội và RFQ."
        actions={<button className="btn">Xuất PDF</button>}
      />
      <StatGrid
        items={[
          { label: 'Pipeline đang mở', value: rfqStats[0].value, note: rfqStats[0].note, module: 'FMS' },
          { label: 'Tỷ lệ chốt · 90 ngày', value: `${Math.round((funnel[3].value / funnel[1].value) * 100)}%`, note: `${funnel[3].value} / ${funnel[1].value} báo giá đã gửi`, noteTone: 'green' },
          { label: 'Sản lượng T9', value: `${teuPrev} TEU`, note: `Mục tiêu ${TEU_TARGET} TEU · ${teuPrev >= TEU_TARGET ? 'đạt' : `thiếu ${TEU_TARGET - teuPrev}`}`, noteTone: teuPrev >= TEU_TARGET ? 'green' : 'amber' },
          { label: 'Khách mới · T10', value: String(newCustomersByMonth[last]), note: `${newCustomersByMonth.reduce((s, v) => s + v, 0)} khách trong 6 tháng` },
        ]}
      />

      <div className="report-grid">
        <Card title="Phễu chuyển đổi" subtitle="90 ngày gần nhất">
          <div className="funnel">
            {funnel.map((f, i) => (
              <div key={f.label} className="funnel__row" title={`${f.label}: ${f.value}`}>
                <span>{f.label}</span>
                <div className="funnel__bar" style={{ width: `${(f.value / funnel[0].value) * 100}%` }} />
                <span className="funnel__val">
                  <b>{f.value}</b>
                  {i > 0 && <span className="subtle"> · {Math.round((f.value / funnel[i - 1].value) * 100)}%</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="subtle" style={{ fontSize: 11.5, marginTop: 10 }}>Phần trăm là tỷ lệ so với bước liền trước.</div>
        </Card>
        <Card title="Sản lượng TEU theo tháng" subtitle={`Mục tiêu ${TEU_TARGET} TEU / tháng · tháng 10 tính đến 19/10`}>
          <ColumnChart
            labels={months}
            series={[{ name: 'TEU', values: teuByMonth }]}
            format={(v) => `${formatNumber(v)} TEU`}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Tháng ${months[i].slice(1)}${i === last ? ' (đến 19/10)' : ''}`}
            target={{ value: TEU_TARGET, label: `Mục tiêu ${TEU_TARGET}` }}
            ariaLabel="Sản lượng TEU theo tháng"
          />
        </Card>
        <Card title="Doanh số theo nhân viên" subtitle="Giá trị báo giá đã chốt · 90 ngày">
          <HBars rows={salesPerformance.map((s) => ({ label: s.name, value: s.revenue / 1000 }))} unit="k USD" />
        </Card>
        <Card title="Tỷ lệ chốt theo nhân viên" subtitle={`Vạch dọc là mục tiêu ${WIN_TARGET}%`}>
          <HBars rows={salesPerformance.map((s) => ({ label: s.name, value: s.winRate }))} unit="%" target={WIN_TARGET} max={50} />
        </Card>
        <Card title="Cơ hội đang mở theo giai đoạn" subtitle="RFQ trên bảng Kanban · số lượng và giá trị" action={<Link to="/co-hoi-rfq" className="link-small">Mở Cơ hội và RFQ</Link>}>
          <HBars rows={byStage} unit=" RFQ" />
        </Card>
        <Card title="Tuyến nhiều sản lượng nhất" subtitle="TEU · tháng 9">
          <HBars rows={topLanes} unit=" TEU" />
        </Card>
        <Card title="Khách hàng nhiều job nhất" subtitle="Số job 90 ngày">
          <HBars
            rows={customers.filter((c) => c.jobs90 > 0).sort((a, b) => b.jobs90 - a.jobs90).slice(0, 5).map((c) => ({ label: c.shortName, value: c.jobs90, sub: `Sales: ${c.sales}` }))}
            unit=" job"
          />
        </Card>
        <Card title="Lý do mất báo giá" subtitle={`${lostReasons.reduce((s, r) => s + r.value, 0)} báo giá không chốt · 90 ngày`}>
          <HBars rows={lostReasons} unit=" báo giá" />
        </Card>
      </div>
    </>
  );
}
