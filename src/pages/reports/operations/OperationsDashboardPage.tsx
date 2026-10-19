import { Link } from 'react-router-dom';
import { Activity, ChevronRight } from 'lucide-react';
import { ColumnChart } from '../../../components/charts/ColumnChart';
import { HBars } from '../../../components/charts/HBars';
import { LineChart } from '../../../components/charts/LineChart';
import { Badge, ModuleTag } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Module, Tone } from '../../../types';
import { formatNumber } from '../../../utils/format';
import { declarations, channelStats, clearHoursByChannel } from '../../customs/data';
import { docAlerts, ocrQueue } from '../../documents/data';
import { jobsByType, onTimeRate, weeklyJobs, weeks } from '../../home/data';
import { pods, orders } from '../../transport/data';
import { flowDays, inboundByDay, inbounds, outboundByDay, zoneFill, zones } from '../../warehouse/data';
import '../reports.css';

const ON_TIME_TARGET = 95;
const channelCount: Record<string, number> = { 'Luồng xanh': channelStats.Xanh, 'Luồng vàng': channelStats['Vàng'], 'Luồng đỏ': channelStats['Đỏ'] };

/** Điểm nghẽn đang mở, đếm trực tiếp từ dữ liệu từng phân hệ */
const bottlenecks: { module: Module; label: string; count: number; tone: Tone; to: string }[] = [
  { module: 'DMS', label: 'Chứng từ thiếu hoặc lệch', count: docAlerts.length, tone: 'red', to: '/canh-bao-chung-tu' },
  { module: 'DMS', label: 'Chứng từ chờ duyệt OCR', count: ocrQueue.length, tone: 'amber', to: '/duyet-ocr' },
  { module: 'TMS', label: 'Lệnh vận chuyển chờ điều xe', count: orders.filter((o) => o.status === 'Chờ điều xe').length, tone: 'amber', to: '/dieu-phoi-xe' },
  { module: 'TMS', label: 'POD chờ duyệt hoặc còn thiếu', count: pods.filter((p) => p.status !== 'Đã duyệt').length, tone: 'amber', to: '/duyet-pod' },
  { module: 'CUS', label: 'Tờ khai chưa thông quan', count: declarations.filter((d) => d.status !== 'Đã thông quan').length, tone: 'blue', to: '/to-khai' },
  { module: 'WMS', label: 'Lệnh nhập kho chờ lịch hẹn', count: inbounds.filter((i) => i.status === 'Chờ lịch hẹn').length, tone: 'amber', to: '/nhap-kho' },
];

export default function OperationsDashboardPage() {
  const last = weeklyJobs.length - 1;
  const growth = ((weeklyJobs[last] - weeklyJobs[last - 1]) / weeklyJobs[last - 1]) * 100;
  const totalCells = zones.reduce((s, z) => s + z.racks * z.bays, 0);
  const fill = zones.reduce((s, z) => s + zoneFill(z) * z.racks * z.bays, 0) / totalCells;
  const green = (channelStats.Xanh / channelStats.total) * 100;

  return (
    <>
      <PageHeader
        icon={<Activity size={18} />}
        section="Báo cáo"
        title="Dashboard vận hành"
        description="Sản lượng job, giao đúng hạn, thông quan và kho trên cùng một màn. Số liệu cập nhật từ các phân hệ lúc 08:15 hôm nay."
        actions={<button className="btn">Xuất PDF</button>}
      />
      <StatGrid
        items={[
          { label: 'Job mở mới tuần này', value: String(weeklyJobs[last]), note: `${growth >= 0 ? '+' : ''}${formatNumber(growth, 1)}% so với tuần trước`, noteTone: growth >= 0 ? 'green' : 'red', module: 'FMS' },
          { label: 'Giao đúng hạn · tuần 42', value: `${formatNumber(onTimeRate[last], 1)}%`, note: `Mục tiêu ${ON_TIME_TARGET}%`, noteTone: onTimeRate[last] >= ON_TIME_TARGET ? 'green' : 'amber', module: 'TMS' },
          { label: 'Tờ khai luồng xanh · 30 ngày', value: `${formatNumber(green, 0)}%`, note: `${channelStats.total} tờ khai · ${channelStats['Đỏ']} luồng đỏ`, module: 'CUS' },
          { label: 'Lấp đầy kho Tân Uyên', value: `${formatNumber(fill, 0)}%`, note: `${zones.length} khu · ${totalCells} ô kệ`, module: 'WMS' },
        ]}
      />

      <div className="report-grid">
        <Card title="Job mở mới theo tuần" subtitle="8 tuần gần nhất">
          <ColumnChart
            labels={weeks}
            series={[{ name: 'Job mở mới', values: weeklyJobs }]}
            format={(v) => `${v} job`}
            axisFormat={(v) => String(v)}
            tipTitle={(i) => `Tuần ${weeks[i].slice(1)}`}
            highlight={last}
            ariaLabel="Số job mở mới theo tuần"
          />
        </Card>
        <Card title="Tỷ lệ giao đúng hạn" subtitle={`8 tuần gần nhất · mục tiêu ${ON_TIME_TARGET}%`}>
          <LineChart
            labels={weeks}
            series={[{ name: 'Đúng hạn', values: onTimeRate }]}
            format={(v) => `${formatNumber(v, 1)}%`}
            axisFormat={(v) => `${v}%`}
            tipTitle={(i) => `Tuần ${weeks[i].slice(1)}`}
            domain={[90, 97]}
            target={{ value: ON_TIME_TARGET, label: `Mục tiêu ${ON_TIME_TARGET}%` }}
            ariaLabel="Tỷ lệ giao đúng hạn theo tuần"
          />
        </Card>
        <Card title="Nhập và xuất kho theo ngày" subtitle="Kho Tân Uyên · 14 ngày · đơn vị thùng">
          <ColumnChart
            labels={flowDays}
            series={[{ name: 'Nhập', values: inboundByDay }, { name: 'Xuất', values: outboundByDay }]}
            format={(v) => `${formatNumber(v)} thùng`}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Ngày ${flowDays[i]}/10`}
            labelEvery={2}
            ariaLabel="Số thùng nhập và xuất kho theo ngày"
          />
        </Card>
        <Card title="Job đang mở theo loại hình" subtitle={`${jobsByType.reduce((s, j) => s + j.count, 0)} job`}>
          <HBars rows={jobsByType.map((j) => ({ label: j.label, value: j.count, sub: `${j.pct}% tổng số job` }))} unit=" job" />
        </Card>
      </div>

      <div className="report-grid">
        <Card title="Điểm nghẽn đang mở" subtitle="Bấm để mở danh sách ở phân hệ tương ứng" bodyClassName="">
          {bottlenecks.map((b) => (
            <Link key={b.label} to={b.to} className="bn-row">
              <ModuleTag module={b.module} />
              <span className="bn-row__label">{b.label}</span>
              <Badge tone={b.count ? b.tone : 'green'}>{b.count}</Badge>
              <ChevronRight size={14} className="subtle" />
            </Link>
          ))}
        </Card>
        <Card title="Thời gian thông quan theo luồng" subtitle="Giờ, từ khi truyền tờ khai đến khi thông quan · 30 ngày">
          <HBars rows={clearHoursByChannel.map((c) => ({ ...c, sub: `${channelCount[c.label]} tờ khai` }))} unit=" giờ" />
        </Card>
      </div>
    </>
  );
}
