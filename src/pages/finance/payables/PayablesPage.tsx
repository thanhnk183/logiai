import { useMemo, useState } from 'react';
import { ArrowUpFromLine, CheckCircle2, XCircle } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { apBills } from '../data';
import { apStatuses, apTone, vnd, vndShort } from '../shared';
import type { ApBill, ApStatus } from '../types';
import '../finance.css';

type Filter = 'all' | ApStatus;

function BillDetail({ b, onStatus }: { b: ApBill; onStatus: (s: ApStatus) => void }) {
  return (
    <section className="card">
      <DetailHeader
        code={<>{b.code}{b.job && <> · <JobLink code={b.job} /></>}</>}
        badge={<Badge tone={apTone[b.status]}>{b.status}</Badge>}
        title={b.vendor}
        subtitle={`${b.kind} · ${b.description}`}
        actions={
          b.status === 'Chờ duyệt' ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => onStatus('Đã duyệt')}>{b.match.ok ? 'Duyệt thanh toán' : 'Duyệt dù chưa khớp'}</button>
              <button className="btn btn--sm">Trả lại để đối soát</button>
            </>
          ) : b.status === 'Đã duyệt' ? (
            <button className="btn btn--primary btn--sm" onClick={() => onStatus('Đã thanh toán')}>Lập ủy nhiệm chi</button>
          ) : b.status === 'Chờ HĐ NCC' ? (
            <button className="btn btn--sm">Nhắc nhà cung cấp gửi hóa đơn</button>
          ) : null
        }
      />
      <div className="detail__section">
        <Alert tone={b.match.ok ? 'green' : 'amber'}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {b.match.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            <b>Đối chiếu với chi phí job / hợp đồng:</b> {b.match.text}
          </span>
        </Alert>
      </div>
      <div className="detail__section kv-grid">
        <Field label="Số tiền"><b style={{ fontSize: 16 }}>{vnd(b.amount)}</b></Field>
        <Field label="Hạn thanh toán">{b.due}</Field>
        <Field label="Hóa đơn nhà cung cấp">{b.vendorInvoice ? <span className="mono">{b.vendorInvoice}</span> : 'Chưa nhận'}</Field>
        <Field label="Job">{b.job ? <JobLink code={b.job} /> : 'Nhiều job'}</Field>
        {b.note && <Field label="Ghi chú" full>{b.note}</Field>}
      </div>
    </section>
  );
}

export default function PayablesPage() {
  const [items, setItems] = useState(apBills);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState(apBills[0].code);

  const rows = useMemo(() => items.filter((b) => filter === 'all' || b.status === filter), [items, filter]);
  const current = rows.find((b) => b.code === selected) ?? rows[0];
  const count = (s: ApStatus) => items.filter((b) => b.status === s).length;
  const sum = (f: (b: ApBill) => boolean) => items.filter(f).reduce((s, b) => s + b.amount, 0);
  const setStatus = (code: string, status: ApStatus) => setItems((l) => l.map((b) => (b.code === code ? { ...b, status } : b)));

  return (
    <>
      <PageHeader
        icon={<ArrowUpFromLine size={18} />}
        section="Tài chính"
        title="Công nợ phải trả"
        description="Hóa đơn nhà cung cấp (hãng tàu, hãng bay, nhà xe, kho) được ghép với chi phí của job, qua bước duyệt rồi mới thanh toán."
      />
      <StatGrid
        items={[
          { label: 'Phải trả chưa thanh toán', value: vndShort(sum((b) => b.status !== 'Đã thanh toán')), note: `${items.filter((b) => b.status !== 'Đã thanh toán').length} khoản`, module: 'FIN' },
          { label: 'Chờ duyệt', value: String(count('Chờ duyệt')), note: vndShort(sum((b) => b.status === 'Chờ duyệt')), valueTone: 'amber', noteTone: 'amber' },
          { label: 'Không khớp chi phí job', value: String(items.filter((b) => !b.match.ok && b.status !== 'Đã thanh toán').length), note: 'Cần đối soát trước khi duyệt', valueTone: 'red', noteTone: 'red' },
          { label: 'Đến hạn trong 7 ngày', value: '3', note: 'Gần nhất: CMA CGM 20/10' },
        ]}
      />
      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: items.length }, ...apStatuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
      </div>
      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có khoản phải trả.</div>}
          {rows.map((b) => (
            <button key={b.code} className={`md-item ${b.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(b.code)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{b.code}</span>
                <Badge tone={apTone[b.status]}>{b.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{b.vendor}</div>
              <div className="muted" style={{ fontSize: 12 }}>{b.description}</div>
              <div className="md-item__row" style={{ fontSize: 12 }}>
                <span style={{ color: b.match.ok ? 'var(--green)' : 'var(--red)', fontSize: 11.5 }}>{b.match.ok ? 'Khớp chi phí' : 'Chưa khớp'}</span>
                <b>{vndShort(b.amount)}</b>
              </div>
            </button>
          ))}
        </div>
        {current ? <BillDetail key={current.code} b={current} onStatus={(s) => setStatus(current.code, s)} /> : <div className="card md-empty">Chọn một khoản.</div>}
      </div>
    </>
  );
}
