import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ColumnChart } from '../../../components/charts/ColumnChart';
import { HBars } from '../../../components/charts/HBars';
import { LineChart } from '../../../components/charts/LineChart';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { customers } from '../../customers/list/data';
import { USD_RATE, aging, agingLabels, apBills, bankAccounts } from '../../finance/data';
import { millions, vndShort } from '../../finance/shared';
import { MIN_MARGIN } from '../../quotation-booking/quotations/data';
import { cashIn, cashOut, cashWeeks, costByMonth, fcRevenueForecast, months, revenueByMonth, revenueByService } from '../data';
import '../reports.css';

const ty = (v: number) => `${formatNumber(v, 2)} tỷ ₫`;

export default function FinanceDashboardPage() {
  const last = months.length - 1;
  const margins = revenueByMonth.map((r, i) => ((r - costByMonth[i]) / r) * 100);
  const debt = customers.reduce((s, c) => s + c.debt, 0);
  const overdue = customers.reduce((s, c) => s + c.overdue, 0);
  const payable = apBills.filter((b) => b.status !== 'Đã thanh toán').reduce((s, b) => s + b.amount, 0);
  const cash = bankAccounts.reduce((s, a) => s + (a.currency === 'USD' ? a.balance * USD_RATE : a.balance), 0);

  // Tuổi nợ: cộng theo từng mốc trên mọi khách (triệu ₫)
  const agingTotals = agingLabels.map((label, k) => ({ label, value: Object.values(aging).reduce((s, a) => s + a[k], 0) }));
  const limitUse = customers
    .filter((c) => c.limit)
    .map((c) => ({ label: c.shortName, value: (c.debt / c.limit!) * 100, sub: `${millions(c.debt)} / ${millions(c.limit!)}${c.overdue ? ` · quá hạn ${millions(c.overdue)}` : ''}` }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader
        icon={<Wallet size={18} />}
        section="Báo cáo"
        title="Dashboard tài chính"
        description="Doanh thu, lãi gộp, công nợ và dòng tiền. Công nợ và số dư tài khoản đọc trực tiếp từ phân hệ Tài chính; doanh thu tháng 10 tính đến 19/10."
        actions={<button className="btn">Xuất PDF</button>}
      />
      <StatGrid
        items={[
          { label: 'Doanh thu T10 · đến 19/10', value: ty(revenueByMonth[last]), note: `Dự báo cả tháng ${ty(fcRevenueForecast[0])}`, module: 'FIN' },
          { label: 'Tỷ lệ lãi gộp T10', value: `${formatNumber(margins[last], 1)}%`, note: `T9: ${formatNumber(margins[last - 1], 1)}% · ngưỡng ${MIN_MARGIN}%`, noteTone: margins[last] < margins[last - 1] ? 'amber' : 'green' },
          { label: 'Phải thu khách hàng', value: millions(debt), note: `Quá hạn ${millions(overdue)} (${formatNumber((overdue / debt) * 100, 1)}%)`, noteTone: 'red' },
          { label: 'Tiền trong tài khoản', value: vndShort(cash), note: `Phải trả chưa thanh toán ${vndShort(payable)}` },
        ]}
      />

      <div className="report-grid">
        <Card title="Doanh thu và chi phí theo tháng" subtitle="Tỷ ₫ · tháng 10 tính đến ngày 19">
          <ColumnChart
            labels={months}
            series={[{ name: 'Doanh thu', values: revenueByMonth }, { name: 'Chi phí', values: costByMonth }]}
            format={ty}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Tháng ${months[i].slice(1)}${i === last ? ' (đến 19/10)' : ''}`}
            ariaLabel="Doanh thu và chi phí theo tháng"
          />
        </Card>
        <Card title="Tỷ lệ lãi gộp theo tháng" subtitle={`Lãi gộp trên doanh thu · ngưỡng tối thiểu ${MIN_MARGIN}%`}>
          <LineChart
            labels={months}
            series={[{ name: 'Lãi gộp', values: margins }]}
            format={(v) => `${formatNumber(v, 1)}%`}
            axisFormat={(v) => `${v}%`}
            tipTitle={(i) => `Tháng ${months[i].slice(1)}`}
            domain={[6, 12]}
            target={{ value: MIN_MARGIN, label: `Ngưỡng ${MIN_MARGIN}%` }}
            ariaLabel="Tỷ lệ lãi gộp theo tháng"
          />
        </Card>
        <Card title="Dòng tiền thu và chi theo tuần" subtitle="Tỷ ₫ · tuần 42 mới đến thứ Hai">
          <ColumnChart
            labels={cashWeeks}
            series={[{ name: 'Tiền thu', values: cashIn }, { name: 'Tiền chi', values: cashOut }]}
            format={ty}
            axisFormat={(v) => formatNumber(v)}
            tipTitle={(i) => `Tuần ${cashWeeks[i].slice(1)}`}
            ariaLabel="Tiền thu và tiền chi theo tuần"
          />
        </Card>
        <Card title="Tuổi nợ phải thu" subtitle="Triệu ₫ · cộng mọi khách hàng" action={<Link to="/cong-no-phai-thu" className="link-small">Xem công nợ</Link>}>
          <HBars rows={agingTotals.map((a) => ({ ...a, sub: `${formatNumber((a.value / debt) * 100, 1)}% tổng phải thu` }))} unit=" tr" />
        </Card>
        <Card title="Mức dùng hạn mức công nợ" subtitle="Vạch dọc là ngưỡng cảnh báo 90%">
          <HBars rows={limitUse} unit="%" target={90} targetMode="max" max={100} />
        </Card>
        <Card title="Doanh thu theo loại dịch vụ" subtitle="Tháng 9 · tỷ ₫">
          <HBars rows={revenueByService.map((r) => ({ ...r, sub: `${formatNumber((r.value / revenueByMonth[last - 1]) * 100, 0)}% doanh thu` }))} unit=" tỷ" />
        </Card>
      </div>
    </>
  );
}
