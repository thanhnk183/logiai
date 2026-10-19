import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { HBars } from '../../../components/charts/HBars';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { jobs } from '../../jobs/data';
import { jobFinance, jobStatusTone } from '../../jobs/shared';
import { USD_RATE } from '../data';
import { vndShort } from '../shared';
import '../finance.css';

type Sort = 'margin-asc' | 'margin-desc' | 'profit';
const MIN_MARGIN = 8;

/** Lãi lỗ từng job quy về VND */
const rows = jobs.map((j) => {
  const f = jobFinance(j);
  const k = j.finance.currency === 'USD' ? USD_RATE : 1;
  return { job: j, revenue: f.revenue * k, cost: f.cost * k, profit: f.profit * k, margin: f.margin };
});

export default function JobPnlPage() {
  const [sort, setSort] = useState<Sort>('margin-asc');
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (sort === 'margin-asc' ? a.margin - b.margin : sort === 'margin-desc' ? b.margin - a.margin : b.profit - a.profit)),
    [sort],
  );

  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  const profit = rows.reduce((s, r) => s + r.profit, 0);
  const low = rows.filter((r) => r.margin < MIN_MARGIN);

  // Lãi gộp theo khách hàng
  const byCustomer = Object.values(
    rows.reduce<Record<string, { label: string; revenue: number; profit: number }>>((acc, r) => {
      const c = (acc[r.job.customer] ??= { label: r.job.customer, revenue: 0, profit: 0 });
      c.revenue += r.revenue;
      c.profit += r.profit;
      return acc;
    }, {}),
  )
    .map((c) => ({ label: c.label, value: (c.profit / c.revenue) * 100, sub: `Lãi ${vndShort(c.profit)} trên doanh thu ${vndShort(c.revenue)}` }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader
        icon={<TrendingUp size={18} />}
        section="Tài chính"
        title="Lãi lỗ theo job"
        description="Doanh thu và chi phí thực tế của từng job (đọc từ module Job), quy đổi VND theo tỷ giá 25.380 ₫/USD. Job dưới ngưỡng lãi 8% được đánh dấu."
        actions={<button className="btn">Xuất Excel</button>}
      />
      <StatGrid
        items={[
          { label: 'Doanh thu các job', value: vndShort(revenue), note: `${rows.length} job trong kỳ`, module: 'FIN' },
          { label: 'Lãi gộp', value: vndShort(profit), note: `${formatNumber((profit / revenue) * 100, 1)}% doanh thu`, noteTone: 'green' },
          { label: 'Job dưới ngưỡng 8%', value: String(low.length), note: low.length ? low.map((r) => r.job.code).join(', ') : 'Không có', valueTone: low.length ? 'red' : undefined, noteTone: low.length ? 'red' : undefined },
          { label: 'Lãi gộp bình quân / job', value: vndShort(profit / rows.length), note: 'Tháng 10' },
        ]}
      />

      <div className="pnl-grid">
        <Card
          title="Từng job"
          action={
            <Segmented<Sort>
              value={sort}
              onChange={setSort}
              options={[{ value: 'margin-asc', label: 'Lãi thấp trước' }, { value: 'margin-desc', label: 'Lãi cao trước' }, { value: 'profit', label: 'Theo số tiền lãi' }]}
            />
          }
          bodyClassName="table-wrap"
        >
          <table className="table">
            <thead>
              <tr><th>Job</th><th>Khách hàng</th><th className="num">Doanh thu</th><th className="num">Chi phí</th><th className="num">Lãi gộp</th><th className="num">Tỷ lệ</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.job.code}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <JobLink code={r.job.code} />
                    <div style={{ marginTop: 2 }}><OutlineBadge>{r.job.mode}</OutlineBadge></div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.job.customer}</td>
                  <td className="num">{vndShort(r.revenue)}</td>
                  <td className="num muted">{vndShort(r.cost)}</td>
                  <td className="num"><b>{vndShort(r.profit)}</b></td>
                  <td className="num" style={{ fontWeight: 700, color: r.margin < MIN_MARGIN ? 'var(--red)' : r.margin < 12 ? 'var(--amber)' : 'var(--green)' }}>
                    {formatNumber(r.margin, 1)}%
                  </td>
                  <td><Badge tone={jobStatusTone[r.job.status]}>{r.job.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Tỷ lệ lãi gộp theo khách hàng" subtitle={`Vạch dọc là ngưỡng tối thiểu ${MIN_MARGIN}%`}>
          <HBars rows={byCustomer} unit="%" target={MIN_MARGIN} max={Math.max(...byCustomer.map((c) => c.value))} />
        </Card>
      </div>
    </>
  );
}
