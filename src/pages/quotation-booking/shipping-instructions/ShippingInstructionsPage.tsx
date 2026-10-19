import { useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed, ClipboardList, XCircle } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import type { CheckState, ShippingInstruction, SiStatus } from '../types';
import { shippingInstructions, siStats } from './data';
import '../quotation-booking.css';

type Filter = 'all' | SiStatus;

const statuses: SiStatus[] = ['Chưa gửi', 'Đang soạn', 'Đã gửi hãng', 'Hãng đã nhận'];

const statusTone: Record<SiStatus, Tone> = {
  'Chưa gửi': 'red',
  'Đang soạn': 'amber',
  'Đã gửi hãng': 'blue',
  'Hãng đã nhận': 'green',
};

const checkIcon: Record<CheckState, JSX.Element> = {
  ok: <CheckCircle2 size={15} color="var(--green)" />,
  error: <XCircle size={15} color="var(--red)" />,
  pending: <CircleDashed size={15} color="var(--text-3)" />,
};

const isSent = (s: SiStatus) => s === 'Đã gửi hãng' || s === 'Hãng đã nhận';

function DocCell({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`doc-cell ${wide ? 'doc-cell--wide' : ''}`}>
      <div className="doc-cell__label">{label}</div>
      <div className="doc-cell__value">{value}</div>
    </div>
  );
}

function SiDetail({ si, onSend }: { si: ShippingInstruction; onSend: () => void }) {
  const errors = si.checks.filter((c) => c.state === 'error').length;
  const pending = si.checks.filter((c) => c.state === 'pending').length;
  const sent = isSent(si.status);

  return (
    <section className="card">
      <DetailHeader
        code={`${si.code} · ${si.booking}`}
        badge={<Badge tone={statusTone[si.status]}>{si.status}</Badge>}
        title={si.customer}
        subtitle={`${si.carrier} · ${si.vessel} · ${si.pol} → ${si.pod}`}
        actions={
          sent ? (
            <button className="btn btn--sm">Tải SI (PDF)</button>
          ) : (
            <>
              <button className="btn btn--primary btn--sm" onClick={onSend}>Gửi hãng tàu</button>
              <button className="btn btn--sm">Lưu nháp</button>
              <button className="btn btn--sm">Điền từ chứng từ (AI)</button>
            </>
          )
        }
      />

      <div className="detail__section" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sent ? (
          <Alert tone="green">Đã gửi hãng {si.sentAt}. Hãng dùng SI này để soạn B/L draft.</Alert>
        ) : (
          <Alert tone={si.cutoffTone ?? 'blue'}>
            <b>Cut-off SI: {si.cutoff}</b> · tàu {si.vessel}
          </Alert>
        )}
        {!sent && errors > 0 && (
          <Alert tone="red">Có {errors} điểm lệch với chứng từ. Nên sửa trước khi gửi để tránh phí sửa B/L.</Alert>
        )}
      </div>

      <div className="detail__section">
        <div className="section-title">Các bên</div>
        <div className="doc-sheet doc-sheet--3">
          <DocCell label="Shipper" value={si.shipper} />
          <DocCell label="Consignee" value={si.consignee} />
          <DocCell label="Notify party" value={si.notify} />
        </div>
      </div>

      <div className="detail__section">
        <div className="section-title">Hàng hóa</div>
        <div className="kv-grid kv-grid--4" style={{ marginBottom: 10 }}>
          <Field label="Mã HS">{si.hsCode}</Field>
          <Field label="Số kiện">{si.packages}</Field>
          <Field label="Trọng lượng (GW)">{si.grossWeight}</Field>
          <Field label="Thể tích">{si.measurement}</Field>
          <Field label="Cước">{si.freightTerm}</Field>
          <Field label="Loại B/L">{si.blType}</Field>
          <Field label="Job"><JobLink code={si.job} /></Field>
        </div>
        <div className="doc-sheet">
          <DocCell label="Description of goods" value={si.cargoDesc} wide />
        </div>
      </div>

      <div className="detail__section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
        <div>
          <div className="section-title">Container và seal</div>
          <table className="table table--compact">
            <thead>
              <tr><th>Container</th><th>Seal</th><th className="num">Kiện</th><th className="num">GW</th></tr>
            </thead>
            <tbody>
              {si.containers.map((c) => (
                <tr key={c.no}>
                  <td>
                    <div className="mono" style={{ fontWeight: 600 }}>{c.no}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{c.type}</div>
                  </td>
                  <td className="mono" style={{ color: c.seal ? undefined : 'var(--red)' }}>{c.seal || 'Thiếu'}</td>
                  <td className="num">{c.packages}</td>
                  <td className="num">{c.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="section-title">
            Đối chiếu chứng từ (DMS)
            <small>{errors} lệch · {pending} chờ</small>
          </div>
          <ul className="checks">
            {si.checks.map((c) => (
              <li key={c.label}>
                {checkIcon[c.state]}
                <div>
                  <div>{c.label}</div>
                  {c.detail && (
                    <div className="checks__detail" style={{ color: c.state === 'error' ? toneColor.red : 'var(--text-3)' }}>{c.detail}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function ShippingInstructionsPage() {
  const [items, setItems] = useState(shippingInstructions);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(shippingInstructions[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (s) =>
        (filter === 'all' || s.status === filter) &&
        (!q || [s.code, s.job, s.customer, s.vessel].some((v) => v.toLowerCase().includes(q))),
    );
  }, [items, filter, query]);

  const current = rows.find((s) => s.code === selected) ?? rows[0];
  const count = (st: SiStatus) => items.filter((s) => s.status === st).length;
  const send = (code: string) =>
    setItems((list) => list.map((s) => (s.code === code ? { ...s, status: 'Đã gửi hãng', sentAt: 'vừa xong' } : s)));

  return (
    <>
      <PageHeader
        icon={<ClipboardList size={18} />}
        section="Báo giá và Booking"
        title="Shipping Instruction"
        description="Soạn hướng dẫn gửi hàng cho hãng tàu trước cut-off, đối chiếu với Invoice và Packing List đã OCR trong DMS."
      />
      <StatGrid items={siStats} />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: items.length },
            ...statuses.map((s) => ({ value: s, label: s, count: count(s) })),
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số SI, job, khách, tàu..." />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có SI phù hợp.</div>}
          {rows.map((s) => (
            <button key={s.code} className={`md-item ${s.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(s.code)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{s.code}</span>
                <Badge tone={statusTone[s.status]}>{s.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{s.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}>{s.vessel}</div>
              <div className="md-item__row" style={{ fontSize: 11.5 }}>
                <span className="subtle">{s.pol} → {s.pod}</span>
                {isSent(s.status) ? (
                  <span className="subtle">Gửi {s.sentAt}</span>
                ) : (
                  <span style={{ fontWeight: 600, color: s.cutoffTone ? toneColor[s.cutoffTone] : 'var(--text-2)' }}>Cut-off {s.cutoff}</span>
                )}
              </div>
            </button>
          ))}
        </div>
        {current ? (
          <SiDetail si={current} onSend={() => send(current.code)} />
        ) : (
          <div className="card md-empty">Chọn một SI để xem chi tiết.</div>
        )}
      </div>
    </>
  );
}
