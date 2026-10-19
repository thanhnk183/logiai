import { useMemo, useState } from 'react';
import { Camera, CheckCircle2, CircleDashed, PackagePlus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { findSku, inbounds as initialInbounds } from '../data';
import { inboundStatusTone, inboundStatuses } from '../shared';
import type { InboundOrder, InboundStatus } from '../types';
import '../warehouse.css';

type Filter = 'all' | InboundStatus;

const totals = (o: InboundOrder) => ({
  expected: o.lines.reduce((s, l) => s + l.expected, 0),
  received: o.lines.reduce((s, l) => s + l.received, 0),
  damaged: o.lines.reduce((s, l) => s + l.damaged, 0),
});

function InboundDetail({ o, onUpdate }: { o: InboundOrder; onUpdate: (next: InboundOrder) => void }) {
  const t = totals(o);
  const pct = t.expected ? Math.round((t.received / t.expected) * 100) : 0;

  const next: Partial<Record<InboundStatus, { label: string; apply: () => InboundOrder }>> = {
    'Chờ lịch hẹn': { label: 'Đặt lịch hẹn 20/10 · 09:00', apply: () => ({ ...o, status: 'Đã hẹn', appointment: '20/10 · 09:00', dock: 'Cửa 1' }) },
    'Đã hẹn': { label: 'Bắt đầu nhận hàng', apply: () => ({ ...o, status: 'Đang nhận hàng' }) },
    'Đang nhận hàng': {
      label: 'Hoàn tất kiểm đếm',
      apply: () => ({ ...o, status: 'Chờ cất hàng', lines: o.lines.map((l) => ({ ...l, received: l.expected - l.damaged })) }),
    },
    'Chờ cất hàng': { label: 'Xác nhận đã cất hàng', apply: () => ({ ...o, status: 'Hoàn tất', lines: o.lines.map((l) => ({ ...l, putaway: true })) }) },
  };
  const action = next[o.status];

  return (
    <section className="card">
      <DetailHeader
        code={<>{o.code}{o.job && <> · <JobLink code={o.job} /></>}</>}
        badge={<Badge tone={inboundStatusTone[o.status]}>{o.status}</Badge>}
        title={o.customer}
        subtitle={o.source}
        actions={
          <>
            {action && <button className="btn btn--primary btn--sm" onClick={() => onUpdate(action.apply())}>{action.label}</button>}
            <button className="btn btn--sm">In phiếu nhập (GRN)</button>
          </>
        }
      />
      {o.note && <div className="detail__section"><Alert tone={o.status === 'Chờ lịch hẹn' ? 'red' : 'amber'}>{o.note}</Alert></div>}

      <div className="detail__section kv-grid kv-grid--4">
        <Field label="Lịch hẹn">{o.appointment}</Field>
        <Field label="Cửa nhận">{o.dock}</Field>
        <Field label="Đã nhận / dự kiến">{formatNumber(t.received)} / {formatNumber(t.expected)}</Field>
        <Field label="Hư hỏng">{t.damaged ? <span className="text-red">{t.damaged}</span> : '0'}</Field>
      </div>
      <div className="detail__section">
        <div className="progress" style={{ height: 6 }}>
          <div className="progress__bar" style={{ width: `${pct}%`, background: 'var(--brand)' }} />
        </div>
        <div className="subtle" style={{ fontSize: 11.5, marginTop: 4 }}>Đã kiểm đếm {pct}%</div>
      </div>

      <div className="detail__section">
        <div className="section-title">Hàng nhận <small>quét mã trên Warehouse App</small></div>
        <div className="table-wrap">
          <table className="table table--compact">
            <thead>
              <tr><th>Mã hàng</th><th className="num">Dự kiến</th><th className="num">Đã nhận</th><th className="num">Hư hỏng</th><th>Vị trí cất</th><th>Cất hàng</th></tr>
            </thead>
            <tbody>
              {o.lines.map((l) => {
                const sku = findSku(l.sku);
                const short = l.received + l.damaged < l.expected && o.status !== 'Chờ lịch hẹn' && o.status !== 'Đã hẹn';
                return (
                  <tr key={l.sku}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sku.name}</div>
                      <div className="mono subtle" style={{ fontSize: 11 }}>{l.sku}</div>
                    </td>
                    <td className="num">{formatNumber(l.expected)}</td>
                    <td className="num" style={{ color: short ? 'var(--amber)' : undefined, fontWeight: 600 }}>{formatNumber(l.received)}</td>
                    <td className="num" style={{ color: l.damaged ? 'var(--red)' : undefined }}>{l.damaged}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{l.location} <span className="subtle" style={{ fontFamily: 'var(--font)', fontSize: 11 }}>gợi ý</span></td>
                    <td>
                      {l.putaway
                        ? <span className="inline-ok"><CheckCircle2 size={14} /> Đã cất</span>
                        : <span className="inline-wait"><CircleDashed size={14} /> Chưa</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {o.photos > 0 && (
        <div className="detail__section">
          <div className="section-title">Ảnh nhận hàng <small>{o.photos} ảnh</small></div>
          <div className="photo-row">
            {Array.from({ length: o.photos }, (_, i) => (
              <span key={i} className="photo-tile"><Camera size={18} /><span>Ảnh {i + 1}</span></span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function InboundPage() {
  const [items, setItems] = useState(initialInbounds);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState(initialInbounds[0].code);

  const rows = useMemo(() => items.filter((o) => filter === 'all' || o.status === filter), [items, filter]);
  const current = rows.find((o) => o.code === selected) ?? rows[0];
  const count = (s: InboundStatus) => items.filter((o) => o.status === s).length;
  const update = (next: InboundOrder) => setItems((l) => l.map((o) => (o.code === next.code ? next : o)));

  return (
    <>
      <PageHeader
        icon={<PackagePlus size={18} />}
        section="Kho"
        title="Nhập kho (GRN)"
        description="Lịch hẹn nhập, kiểm đếm bằng quét mã, ghi nhận hư hỏng và cất hàng vào vị trí gợi ý. Phiếu nhập (GRN) lưu ở DMS."
      />
      <StatGrid
        items={[
          { label: 'Lệnh nhập đang mở', value: String(items.filter((o) => o.status !== 'Hoàn tất').length), note: '1 chưa đặt lịch hẹn', noteTone: 'red', module: 'WMS' },
          { label: 'Đang nhận tại cửa', value: String(count('Đang nhận hàng')), note: 'Cửa 2 · Dệt Minh Phát' },
          { label: 'Chờ cất hàng', value: String(count('Chờ cất hàng')), note: 'Hàng đông lạnh, cất trong 2 giờ', noteTone: 'amber' },
          { label: 'Hư hỏng khi nhận · 30 ngày', value: '0,4%', note: 'Mục tiêu dưới 0,5%', noteTone: 'green' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: items.length }, ...inboundStatuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có lệnh nhập.</div>}
          {rows.map((o) => {
            const t = totals(o);
            return (
              <button key={o.code} className={`md-item ${o.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(o.code)}>
                <div className="md-item__row">
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{o.code}</span>
                  <Badge tone={inboundStatusTone[o.status]}>{o.status}</Badge>
                </div>
                <div style={{ fontWeight: 600 }}>{o.customer}</div>
                <div className="muted" style={{ fontSize: 12 }}>{o.appointment}</div>
                <div className="subtle" style={{ fontSize: 11 }}>{formatNumber(t.received)} / {formatNumber(t.expected)} đã nhận · {o.lines.length} mã hàng</div>
              </button>
            );
          })}
        </div>
        {current ? <InboundDetail key={current.code} o={current} onUpdate={update} /> : <div className="card md-empty">Chọn một lệnh nhập.</div>}
      </div>
    </>
  );
}
