import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline, type TimelineItem } from '../../../components/ui/Timeline';
import type { Tone } from '../../../types';
import { formatNumber, formatUsd } from '../../../utils/format';
import type { Quotation, QuotationStatus, QuoteOption } from '../types';
import { MIN_MARGIN, approver, quotationStats, quotations as initialQuotations } from './data';
import '../quotation-booking.css';

type Filter = 'all' | QuotationStatus;

const statuses: QuotationStatus[] = ['Nháp', 'Chờ duyệt', 'Đã gửi', 'Chấp nhận', 'Từ chối', 'Hết hạn'];

const statusTone: Record<QuotationStatus, Tone> = {
  'Nháp': 'gray',
  'Chờ duyệt': 'amber',
  'Đã gửi': 'blue',
  'Chấp nhận': 'green',
  'Từ chối': 'red',
  'Hết hạn': 'gray',
};

function optionTotals(o: QuoteOption) {
  const sell = o.lines.reduce((s, l) => s + l.qty * l.sell, 0);
  const cost = o.lines.reduce((s, l) => s + l.qty * l.cost, 0);
  return { sell, cost, profit: sell - cost, margin: sell ? ((sell - cost) / sell) * 100 : 0 };
}

function marginTone(m: number): string {
  if (m < MIN_MARGIN) return 'var(--red)';
  if (m < 12) return 'var(--amber)';
  return 'var(--green)';
}

/** Các bước duyệt suy ra từ trạng thái báo giá */
function approvalSteps(q: Quotation): TimelineItem[] {
  const s = q.status;
  const idx = { 'Nháp': 0, 'Chờ duyệt': 1, 'Đã gửi': 3, 'Chấp nhận': 4, 'Từ chối': 4, 'Hết hạn': 4 }[s];
  const state = (i: number): TimelineItem['state'] => (i < idx ? 'done' : i === idx ? 'doing' : 'todo');
  return [
    { label: 'Sales lập báo giá', meta: `${q.sales} · ${q.createdAt}`, state: state(0) },
    { label: 'Trưởng phòng duyệt', meta: approver, state: state(1) },
    { label: 'Gửi khách qua email / Portal', state: state(2) },
    s === 'Từ chối' || s === 'Hết hạn'
      ? { label: s === 'Từ chối' ? 'Khách từ chối' : 'Hết hiệu lực, khách chưa phản hồi', meta: q.customer, state: 'rejected' }
      : { label: s === 'Chấp nhận' ? 'Khách chấp nhận' : 'Chờ khách phản hồi', meta: q.customer, state: s === 'Chấp nhận' ? 'done' : state(3) },
  ];
}

function QuotationDetail({ q, onStatus }: { q: Quotation; onStatus: (s: QuotationStatus) => void }) {
  const [optIdx, setOptIdx] = useState(q.chosenOption);
  const option = q.options[optIdx];
  const t = optionTotals(option);

  const actions: Partial<Record<QuotationStatus, JSX.Element>> = {
    'Nháp': (
      <>
        <button className="btn btn--primary btn--sm" onClick={() => onStatus('Chờ duyệt')}>Gửi duyệt</button>
        <button className="btn btn--sm">Sửa báo giá</button>
      </>
    ),
    'Chờ duyệt': (
      <>
        <button className="btn btn--primary btn--sm" onClick={() => onStatus('Đã gửi')}>Duyệt và gửi khách</button>
        <button className="btn btn--sm" onClick={() => onStatus('Nháp')}>Trả lại sales</button>
      </>
    ),
    'Đã gửi': (
      <>
        <button className="btn btn--primary btn--sm" onClick={() => onStatus('Chấp nhận')}>Khách chấp nhận</button>
        <button className="btn btn--sm" onClick={() => onStatus('Từ chối')}>Khách từ chối</button>
        <button className="btn btn--sm">Nhắc khách</button>
      </>
    ),
    'Chấp nhận': (
      <Link to="/booking" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>
        {q.booking ? `Xem booking ${q.booking}` : 'Tạo booking từ báo giá'}
      </Link>
    ),
    'Hết hạn': <button className="btn btn--sm">Sao chép thành báo giá mới</button>,
  };

  return (
    <section className="card">
      <DetailHeader
        code={`${q.code}${q.rfq ? ` · từ ${q.rfq}` : ''}`}
        badge={<Badge tone={statusTone[q.status]}>{q.status}</Badge>}
        title={q.customer}
        subtitle={`${q.route} · ${q.cargo}`}
        actions={actions[q.status]}
      />

      <div className="detail__section kv-grid kv-grid--4">
        <Field label="Điều kiện giao hàng">{q.incoterm}</Field>
        <Field label="Sales phụ trách">{q.sales}</Field>
        <Field label="Ngày lập">{q.createdAt}</Field>
        <Field label="Hiệu lực đến">{q.validTo}</Field>
      </div>

      <div className="detail__section">
        <div className="section-title">
          Chi tiết giá
          {q.options.length > 1 && (
            <Segmented<string>
              value={String(optIdx)}
              onChange={(v) => setOptIdx(Number(v))}
              options={q.options.map((o, i) => ({ value: String(i), label: o.name }))}
            />
          )}
        </div>
        <div className="option-meta">
          <span>Hãng: <b>{option.carrier}</b></span>
          <span>Lộ trình: <b>{option.routing}</b></span>
          <span>Thời gian: <b>{option.transit}</b></span>
          {optIdx === q.chosenOption && q.options.length > 1 && <Badge tone="blue">Đề xuất cho khách</Badge>}
        </div>
        <div className="table-wrap">
          <table className="table table--compact">
            <thead>
              <tr>
                <th>Khoản mục</th>
                <th>Đơn vị</th>
                <th className="num">SL</th>
                <th className="num">Giá mua</th>
                <th className="num">Giá bán</th>
                <th className="num">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {option.lines.map((ln) => (
                <tr key={ln.item}>
                  <td>{ln.item}</td>
                  <td className="muted">{ln.basis}</td>
                  <td className="num">{formatNumber(ln.qty)}</td>
                  <td className="num muted">{formatNumber(ln.cost)}</td>
                  <td className="num">{formatNumber(ln.sell)}</td>
                  <td className="num"><b>{formatNumber(ln.qty * ln.sell)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="totals">
          <div><span>Tổng giá bán</span><b>{formatUsd(t.sell)}</b></div>
          <div><span>Tổng giá vốn</span><b>{formatUsd(t.cost)}</b></div>
          <div>
            <span>Lãi gộp</span>
            <b style={{ color: marginTone(t.margin) }}>{formatUsd(t.profit)} · {formatNumber(t.margin, 1)}%</b>
          </div>
        </div>
        {t.margin < MIN_MARGIN && (
          <div style={{ marginTop: 10 }}>
            <Alert tone="red">Lãi gộp dưới {MIN_MARGIN}%, cần Giám đốc duyệt thêm sau Trưởng phòng.</Alert>
          </div>
        )}
      </div>

      <div className="detail__section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div className="section-title">Quy trình duyệt</div>
          <Timeline items={approvalSteps(q)} />
        </div>
        <div>
          <div className="section-title">Ghi chú</div>
          <p className="muted">{q.note ?? 'Không có ghi chú.'}</p>
        </div>
      </div>
    </section>
  );
}

export default function QuotationsPage() {
  const [items, setItems] = useState(initialQuotations);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initialQuotations[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (x) =>
        (filter === 'all' || x.status === filter) &&
        (!q || [x.code, x.customer, x.route, x.rfq ?? ''].some((s) => s.toLowerCase().includes(q))),
    );
  }, [items, filter, query]);

  const current = rows.find((x) => x.code === selected) ?? rows[0];
  const count = (s: QuotationStatus) => items.filter((x) => x.status === s).length;
  const setStatus = (code: string, status: QuotationStatus) =>
    setItems((list) => list.map((x) => (x.code === code ? { ...x, status } : x)));

  return (
    <>
      <PageHeader
        icon={<Calculator size={18} />}
        section="Báo giá và Booking"
        title="Báo giá"
        description="Lập báo giá nhiều phương án từ RFQ, duyệt nội bộ, gửi khách và chuyển báo giá được chấp nhận thành booking."
        actions={<button className="btn btn--primary"><Plus size={15} /> Tạo báo giá</button>}
      />
      <StatGrid items={quotationStats} />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: items.length },
            ...statuses.map((s) => ({ value: s, label: s, count: count(s) })),
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số báo giá, RFQ, khách, tuyến..." />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có báo giá phù hợp.</div>}
          {rows.map((x) => {
            const t = optionTotals(x.options[x.chosenOption]);
            return (
              <button key={x.code} className={`md-item ${x.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(x.code)}>
                <div className="md-item__row">
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{x.code}</span>
                  <Badge tone={statusTone[x.status]}>{x.status}</Badge>
                </div>
                <div style={{ fontWeight: 600 }}>{x.customer}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  <OutlineBadge>{x.mode}</OutlineBadge> {x.route}
                </div>
                <div className="md-item__row" style={{ marginTop: 2 }}>
                  <b>{formatUsd(t.sell)}</b>
                  <span style={{ fontSize: 11.5, color: marginTone(t.margin), fontWeight: 600 }}>lãi {formatNumber(t.margin, 1)}%</span>
                </div>
              </button>
            );
          })}
        </div>
        {current ? (
          <QuotationDetail key={current.code} q={current} onStatus={(s) => setStatus(current.code, s)} />
        ) : (
          <div className="card md-empty">Chọn một báo giá để xem chi tiết.</div>
        )}
      </div>
    </>
  );
}
