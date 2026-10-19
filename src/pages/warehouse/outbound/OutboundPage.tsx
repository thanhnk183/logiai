import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageMinus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { findSku, outbounds as initialOutbounds, stock } from '../data';
import { outboundStatusTone, outboundStatuses } from '../shared';
import type { OutboundOrder, OutboundStatus } from '../types';
import '../warehouse.css';

type Filter = 'all' | OutboundStatus;

const picked = (o: OutboundOrder) => o.lines.reduce((s, l) => s + l.picked, 0);
const total = (o: OutboundOrder) => o.lines.reduce((s, l) => s + l.qty, 0);

function OutboundDetail({ o, onUpdate }: { o: OutboundOrder; onUpdate: (next: OutboundOrder) => void }) {
  const done = picked(o);
  const all = total(o);
  const nearExpiry = o.lines.filter((l) => stock.some((s) => s.location === l.location && s.status === 'Cận hạn'));

  const next: Partial<Record<OutboundStatus, { label: string; apply: () => OutboundOrder }>> = {
    'Mới': { label: 'Bắt đầu soạn hàng', apply: () => ({ ...o, status: 'Đang soạn hàng', picker: 'Văn Hậu' }) },
    'Đang soạn hàng': { label: 'Soạn xong · đóng gói', apply: () => ({ ...o, status: 'Đã đóng gói', lines: o.lines.map((l) => ({ ...l, picked: l.qty })) }) },
    'Đã đóng gói': { label: 'Xác nhận đã xuất lên xe', apply: () => ({ ...o, status: 'Đã xuất' }) },
  };
  const action = next[o.status];

  return (
    <section className="card">
      <DetailHeader
        code={o.code}
        badge={<Badge tone={outboundStatusTone[o.status]}>{o.status}</Badge>}
        title={o.destination}
        subtitle={`${o.customer} · xuất ${o.shipAt}`}
        actions={
          <>
            {action && <button className="btn btn--primary btn--sm" onClick={() => onUpdate(action.apply())}>{action.label}</button>}
            <button className="btn btn--sm">In phiếu soạn hàng</button>
          </>
        }
      />
      {(o.note || nearExpiry.length > 0) && (
        <div className="detail__section" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {o.note && <Alert tone="amber">{o.note}</Alert>}
          {nearExpiry.length > 0 && o.status !== 'Đã xuất' && (
            <Alert tone="blue">Lấy hàng cận hạn trước (FEFO) ở vị trí {nearExpiry.map((l) => l.location).join(', ')}.</Alert>
          )}
        </div>
      )}
      <div className="detail__section kv-grid kv-grid--4">
        <Field label="Giờ xuất">{o.shipAt}</Field>
        <Field label="Người soạn">{o.picker ?? '—'}</Field>
        <Field label="Đã soạn">{done} / {all}</Field>
        <Field label="Lệnh vận chuyển">{o.transportOrder ? <Link to="/lenh-van-chuyen" className="link-mono">{o.transportOrder}</Link> : 'Khách tự lấy'}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Danh sách soạn hàng <small>theo thứ tự vị trí</small></div>
        <table className="table table--compact">
          <thead><tr><th>Vị trí</th><th>Mã hàng</th><th className="num">Cần lấy</th><th style={{ width: 160 }}>Đã soạn</th></tr></thead>
          <tbody>
            {[...o.lines].sort((a, b) => a.location.localeCompare(b.location)).map((l) => {
              const sku = findSku(l.sku);
              const pct = Math.round((l.picked / l.qty) * 100);
              return (
                <tr key={l.sku}>
                  <td><Link to={`/so-do-kho?o=${l.location}`} className="link-mono">{l.location}</Link></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sku.name}</div>
                    <div className="mono subtle" style={{ fontSize: 11 }}>{l.sku}</div>
                  </td>
                  <td className="num">{l.qty} {sku.uom}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress" style={{ flex: 1 }}>
                        <div className="progress__bar" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--brand)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 44, textAlign: 'right' }}>{l.picked}/{l.qty}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function OutboundPage() {
  const [items, setItems] = useState(initialOutbounds);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState(initialOutbounds[0].code);

  const rows = useMemo(() => items.filter((o) => filter === 'all' || o.status === filter), [items, filter]);
  const current = rows.find((o) => o.code === selected) ?? rows[0];
  const count = (s: OutboundStatus) => items.filter((o) => o.status === s).length;
  const update = (next: OutboundOrder) => setItems((l) => l.map((o) => (o.code === next.code ? next : o)));

  return (
    <>
      <PageHeader
        icon={<PackageMinus size={18} />}
        section="Kho"
        title="Xuất kho"
        description="Lệnh xuất từ khách hàng, soạn hàng theo vị trí, đóng gói và giao cho xe. Đơn có lệnh vận chuyển sẽ nối sang module Vận tải."
      />
      <StatGrid
        items={[
          { label: 'Đơn xuất hôm nay', value: String(items.filter((o) => o.shipAt.startsWith('19/10')).length), note: '1 đơn chưa có xe', noteTone: 'amber', module: 'WMS' },
          { label: 'Đang soạn hàng', value: String(count('Đang soạn hàng')), note: `${items.filter((o) => o.status === 'Đang soạn hàng').reduce((s, o) => s + total(o) - picked(o), 0)} thùng còn lại` },
          { label: 'Chờ lên xe', value: String(count('Đã đóng gói')), note: 'Đã đóng gói xong' },
          { label: 'Soạn đúng · 30 ngày', value: '99,6%', note: '2 thùng thiếu ở OB-2610-0208', noteTone: 'amber' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: items.length }, ...outboundStatuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có đơn xuất.</div>}
          {rows.map((o) => (
            <button key={o.code} className={`md-item ${o.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(o.code)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{o.code}</span>
                <Badge tone={outboundStatusTone[o.status]}>{o.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{o.destination}</div>
              <div className="muted" style={{ fontSize: 12 }}>{o.customer} · {o.shipAt}</div>
              <div className="progress" style={{ marginTop: 6 }}>
                <div className="progress__bar" style={{ width: `${(picked(o) / total(o)) * 100}%`, background: 'var(--brand)' }} />
              </div>
              <div className="subtle" style={{ fontSize: 11 }}>{formatNumber(picked(o))} / {formatNumber(total(o))} đã soạn</div>
            </button>
          ))}
        </div>
        {current ? <OutboundDetail key={current.code} o={current} onUpdate={update} /> : <div className="card md-empty">Chọn một đơn xuất.</div>}
      </div>
    </>
  );
}
