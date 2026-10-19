import { useMemo, useState } from 'react';
import { ArrowDownToLine, Ban, Send } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { customers } from '../../customers/list/data';
import type { Customer } from '../../customers/types';
import { aging, agingLabels, arInvoices } from '../data';
import { arStatuses, arTone, millions, vndShort } from '../shared';
import type { ArInvoice, ArStatus } from '../types';
import '../finance.css';

type View = 'customer' | 'invoice';
type StatusFilter = 'all' | ArStatus;

/** Khách có công nợ (bỏ khách tiềm năng chưa giao dịch) */
const debtors = customers.filter((c) => aging[c.code]);

function usageColor(c: Customer) {
  const r = c.limit ? c.debt / c.limit : 0;
  return r >= 0.9 ? 'var(--red)' : r >= 0.7 ? 'var(--amber)' : 'var(--brand)';
}

function CustomerPanel({ c, invoices }: { c: Customer; invoices: ArInvoice[] }) {
  const mine = invoices.filter((i) => i.customer === c.shortName);
  const over = c.limit ? c.debt / c.limit >= 0.9 : false;
  const a = aging[c.code];
  return (
    <aside className="card">
      <DetailHeader
        code={c.code}
        badge={c.overdue ? <Badge tone="red">Có nợ quá hạn</Badge> : <Badge tone="green">Trong hạn</Badge>}
        title={c.shortName}
        subtitle={`${c.paymentTerm} · Sales: ${c.sales}`}
        actions={
          <>
            {c.overdue > 0 && <button className="btn btn--primary btn--sm"><Send size={14} /> Gửi nhắc nợ</button>}
            {over && <button className="btn btn--sm"><Ban size={14} /> Tạm khóa nhận job mới</button>}
          </>
        }
      />
      {over && <div className="detail__section"><Alert tone="red">Dư nợ đã dùng {Math.round((c.debt / c.limit!) * 100)}% hạn mức. Job mới cần Kế toán trưởng duyệt.</Alert></div>}
      <div className="detail__section">
        <div className="debt-boxes">
          <div><span>Hạn mức</span><b>{c.limit ? millions(c.limit) : '—'}</b></div>
          <div><span>Dư nợ</span><b>{millions(c.debt)}</b></div>
          <div><span>Quá hạn</span><b className={c.overdue ? 'text-red' : undefined}>{millions(c.overdue)}</b></div>
        </div>
      </div>
      <div className="detail__section">
        <div className="section-title">Tuổi nợ</div>
        {agingLabels.map((label, i) => (
          <div key={label} className="aging-row">
            <span>{label}</span>
            <div className="progress" style={{ flex: 1 }}>
              <div className="progress__bar" style={{ width: `${(a[i] / c.debt) * 100}%`, background: i === 0 ? 'var(--brand)' : 'var(--red)' }} />
            </div>
            <b>{a[i] ? millions(a[i]) : '—'}</b>
          </div>
        ))}
      </div>
      <div className="detail__section">
        <div className="section-title">Hóa đơn <small>{mine.length}</small></div>
        {mine.length === 0 && <p className="subtle">Không có hóa đơn trong dữ liệu mẫu.</p>}
        {mine.map((i) => (
          <div key={i.number ?? i.description} className="fin-line">
            <div className="md-item__row">
              <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{i.number ?? `${i.kind} chờ xuất`}</span>
              <Badge tone={arTone[i.status]}>{i.status}{i.daysOverdue ? ` ${i.daysOverdue} ngày` : ''}</Badge>
            </div>
            <div className="md-item__row" style={{ fontSize: 12 }}>
              <span className="muted">{i.description}</span>
              <b>{vndShort(i.amount)}</b>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ReceivablesPage() {
  const [view, setView] = useState<View>('customer');
  const [invoices, setInvoices] = useState(arInvoices);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState(debtors[0].code);

  const current = debtors.find((c) => c.code === selected) ?? debtors[0];
  const rows = useMemo(() => invoices.filter((i) => status === 'all' || i.status === status), [invoices, status]);

  const totalDebt = debtors.reduce((s, c) => s + c.debt, 0);
  const totalOverdue = debtors.reduce((s, c) => s + c.overdue, 0);
  const pending = invoices.filter((i) => i.status === 'Chờ xuất');

  const issue = (inv: ArInvoice) =>
    setInvoices((l) =>
      l.map((i) => (i === inv ? { ...i, status: 'Chưa đến hạn', number: `LGA/26E-0${420 + l.filter((x) => x.number).length}`, issued: '19/10', due: '18/11' } : i)),
    );
  const remind = (inv: ArInvoice) => setInvoices((l) => l.map((i) => (i === inv ? { ...i, note: 'Đã gửi nhắc nợ 19/10' } : i)));

  return (
    <>
      <PageHeader
        icon={<ArrowDownToLine size={18} />}
        section="Tài chính"
        title="Công nợ phải thu"
        description="Hóa đơn và debit note xuất từ doanh thu job, theo dõi hạn thanh toán, tuổi nợ và hạn mức tín dụng từng khách."
      />
      <StatGrid
        items={[
          { label: 'Tổng phải thu', value: millions(totalDebt), note: `${debtors.length} khách đang có dư nợ`, module: 'FIN' },
          { label: 'Quá hạn', value: millions(totalOverdue), note: `${Math.round((totalOverdue / totalDebt) * 100)}% tổng phải thu`, valueTone: 'red', noteTone: 'red' },
          { label: 'Chờ xuất hóa đơn', value: String(pending.length), note: `${vndShort(pending.reduce((s, i) => s + i.amount, 0))} · 2 đang bị chặn`, noteTone: 'amber' },
          { label: 'Số ngày thu tiền bình quân (DSO)', value: '38 ngày', note: 'Mục tiêu 35 ngày', noteTone: 'amber' },
        ]}
      />

      <div className="toolbar">
        <Segmented<View> value={view} onChange={setView} options={[{ value: 'customer', label: 'Theo khách hàng' }, { value: 'invoice', label: 'Theo hóa đơn', count: invoices.length }]} />
        {view === 'invoice' && (
          <Segmented<StatusFilter>
            value={status}
            onChange={setStatus}
            options={[{ value: 'all', label: 'Tất cả' }, ...arStatuses.map((s) => ({ value: s, label: s, count: invoices.filter((i) => i.status === s).length }))]}
          />
        )}
      </div>

      {view === 'customer' ? (
        <div className="split">
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dư nợ / hạn mức</th>
                  {agingLabels.map((l) => <th key={l} className="num">{l}</th>)}
                </tr>
              </thead>
              <tbody>
                {debtors.map((c) => {
                  const a = aging[c.code];
                  return (
                    <tr key={c.code} className={`clickable ${c.code === current.code ? 'selected' : ''}`} onClick={() => setSelected(c.code)}>
                      <td>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.shortName}</div>
                        <div className="subtle" style={{ fontSize: 11 }}>{c.paymentTerm}</div>
                      </td>
                      <td style={{ minWidth: 150 }}>
                        <div style={{ fontSize: 12.5 }}><b>{millions(c.debt)}</b> <span className="muted">/ {c.limit ? millions(c.limit) : '—'}</span></div>
                        <div className="progress" style={{ marginTop: 4 }}>
                          <div className="progress__bar" style={{ width: `${c.limit ? Math.min(100, (c.debt / c.limit) * 100) : 0}%`, background: usageColor(c) }} />
                        </div>
                      </td>
                      {a.map((v, i) => (
                        <td key={i} className="num" style={{ color: i > 0 && v ? 'var(--red)' : undefined, fontWeight: i > 0 && v ? 600 : 400 }}>
                          {v ? millions(v) : '—'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <CustomerPanel c={current} invoices={invoices} />
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>Số hóa đơn</th><th>Khách hàng</th><th>Nội dung</th><th>Ngày xuất / hạn</th><th className="num">Số tiền</th><th>Trạng thái</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.number ?? i.description}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{i.number ?? '—'}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{i.kind}</div>
                  </td>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{i.customer}</td>
                  <td>
                    <div>{i.description}</div>
                    {i.job && <JobLink code={i.job} style={{ fontSize: 11 }} />}
                    {(i.blocked || i.note) && <div style={{ fontSize: 11.5, color: i.blocked ? 'var(--red)' : 'var(--text-3)' }}>{i.blocked ?? i.note}</div>}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{i.issued ? <>{i.issued} → {i.due}</> : '—'}</td>
                  <td className="num"><b>{vndShort(i.amount)}</b></td>
                  <td><Badge tone={arTone[i.status]}>{i.status}{i.daysOverdue ? ` ${i.daysOverdue} ngày` : ''}</Badge></td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {i.status === 'Chờ xuất' && (
                      <button className="btn btn--primary btn--sm" disabled={!!i.blocked} title={i.blocked} onClick={() => issue(i)}>Xuất hóa đơn điện tử</button>
                    )}
                    {i.status === 'Quá hạn' && <button className="btn btn--sm" onClick={() => remind(i)}>Gửi nhắc nợ</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="subtle" style={{ fontSize: 11.5, marginTop: 10 }}>
        Dư nợ và hạn mức đồng bộ với hồ sơ khách hàng (module Khách hàng). Hóa đơn USD quy đổi theo tỷ giá ngày xuất.
      </p>
    </>
  );
}
