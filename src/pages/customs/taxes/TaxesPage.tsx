import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { declarations } from '../data';
import { fmtVnd, payTone, totalTax } from '../shared';
import type { Declaration, PayStatus } from '../types';
import '../customs.css';

export default function TaxesPage() {
  const [items, setItems] = useState<Declaration[]>(declarations);
  const setPay = (job: string, pay: PayStatus) => setItems((l) => l.map((d) => (d.job === job ? { ...d, pay } : d)));

  const sum = (f: (d: Declaration) => number) => items.reduce((s, d) => s + f(d), 0);
  const unpaid = items.filter((d) => d.pay === 'Chưa nộp');
  const toFinance = items.filter((d) => d.pay === 'Đã nộp' && d.duty + d.vat > 0);

  return (
    <>
      <PageHeader
        icon={<Receipt size={18} />}
        section="Hải quan"
        title="Thuế và phí"
        description="Thuế nhập khẩu, VAT hàng nhập và lệ phí hải quan theo tờ khai. Khoản đã nộp thay khách được chuyển sang Finance để thu lại."
      />
      <StatGrid
        items={[
          { label: 'Thuế NK · tháng 10', value: `${formatNumber(sum((d) => d.duty) / 1e6, 1)} tr ₫`, note: `${items.filter((d) => d.duty > 0).length} tờ khai nhập`, module: 'CUS' },
          { label: 'VAT hàng nhập · tháng 10', value: `${formatNumber(sum((d) => d.vat) / 1e6, 1)} tr ₫`, note: 'Khách được khấu trừ đầu vào' },
          { label: 'Lệ phí chưa nộp', value: String(unpaid.length), note: `${fmtVnd(unpaid.reduce((s, d) => s + d.fees, 0))} · nộp khi truyền tờ khai`, noteTone: 'amber' },
          { label: 'Chờ chuyển Finance', value: String(toFinance.length), note: 'Thu hộ thuế từ khách', valueTone: toFinance.length ? 'amber' : undefined },
        ]}
      />
      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Tờ khai</th>
              <th>Khách hàng</th>
              <th className="num">Thuế NK</th>
              <th className="num">VAT</th>
              <th className="num">Lệ phí</th>
              <th className="num">Tổng</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.job}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{d.number ?? 'Chưa có số'}</div>
                  <JobLink code={d.job} style={{ fontSize: 11 }} />
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.customer}</div>
                  <div className="subtle" style={{ fontSize: 11 }}>{d.typeCode} · {d.direction}</div>
                </td>
                <td className="num">{fmtVnd(d.duty)}</td>
                <td className="num">{fmtVnd(d.vat)}</td>
                <td className="num">{fmtVnd(d.fees)}</td>
                <td className="num"><b>{fmtVnd(totalTax(d))}</b></td>
                <td><Badge tone={payTone[d.pay]}>{d.pay}</Badge></td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {d.pay === 'Chưa nộp' && d.number && <button className="btn btn--sm" onClick={() => setPay(d.job, 'Đã nộp')}>Nộp thuế điện tử</button>}
                  {d.pay === 'Đã nộp' && d.duty + d.vat > 0 && (
                    <button className="btn btn--primary btn--sm" onClick={() => setPay(d.job, 'Đã chuyển Kế toán')}>Chuyển Finance thu hộ</button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={2}><b>Tổng</b></td>
              <td className="num"><b>{fmtVnd(sum((d) => d.duty))}</b></td>
              <td className="num"><b>{fmtVnd(sum((d) => d.vat))}</b></td>
              <td className="num"><b>{fmtVnd(sum((d) => d.fees))}</b></td>
              <td className="num"><b>{fmtVnd(sum(totalTax))}</b></td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="subtle" style={{ fontSize: 11.5, marginTop: 10 }}>Hàng xuất khẩu trong danh sách không phát sinh thuế xuất khẩu, chỉ có lệ phí hải quan 20.000 ₫ mỗi tờ khai.</p>
    </>
  );
}
