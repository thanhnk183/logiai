import { useMemo, useState } from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline, type TimelineItem } from '../../../components/ui/Timeline';
import { counts as initialCounts, findSku } from '../data';
import { countDiff, countStatusTone, signed } from '../shared';
import type { StockCount } from '../types';
import '../warehouse.css';

const APPROVER = 'Quang Minh · Trưởng kho';

const netDiff = (c: StockCount) => c.lines.reduce((s, l) => s + (countDiff(l) ?? 0), 0);
const counted = (c: StockCount) => c.lines.filter((l) => l.counted !== undefined).length;

function steps(c: StockCount): TimelineItem[] {
  const idx = { 'Đang đếm': 0, 'Chờ duyệt điều chỉnh': 1, 'Đã điều chỉnh': 3 }[c.status];
  const st = (i: number): TimelineItem['state'] => (i < idx ? 'done' : i === idx ? 'doing' : 'todo');
  return [
    { label: 'Đếm thực tế bằng Warehouse App', meta: `${c.counter} · ${c.date}`, state: st(0) },
    { label: 'Trưởng kho duyệt điều chỉnh', meta: APPROVER, state: st(1) },
    { label: 'Cập nhật tồn kho, báo chủ hàng', state: st(2) },
  ];
}

function CountDetail({ c, onUpdate }: { c: StockCount; onUpdate: (next: StockCount) => void }) {
  const net = netDiff(c);
  return (
    <section className="card">
      <DetailHeader
        code={`${c.code} · ${c.kind}`}
        badge={<Badge tone={countStatusTone[c.status]}>{c.status}</Badge>}
        title={c.zone}
        subtitle={`Người đếm: ${c.counter} · ${c.date}`}
        actions={
          c.status === 'Chờ duyệt điều chỉnh' ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => onUpdate({ ...c, status: 'Đã điều chỉnh' })}>Duyệt điều chỉnh {signed(net)}</button>
              <button className="btn btn--sm" onClick={() => onUpdate({ ...c, status: 'Đang đếm' })}>Yêu cầu đếm lại</button>
            </>
          ) : c.status === 'Đang đếm' ? (
            <button className="btn btn--sm">Nhắc người đếm</button>
          ) : (
            <button className="btn btn--sm">In biên bản kiểm kê</button>
          )
        }
      />
      {c.note && <div className="detail__section"><Alert tone="amber">{c.note}</Alert></div>}
      <div className="detail__section kv-grid kv-grid--3">
        <Field label="Đã đếm">{counted(c)} / {c.lines.length} vị trí</Field>
        <Field label="Chênh lệch ròng">
          <b style={{ color: net < 0 ? 'var(--red)' : net > 0 ? 'var(--amber)' : 'var(--green)' }}>{signed(net)}</b>
        </Field>
        <Field label="Người duyệt">{APPROVER}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Kết quả đếm</div>
        <div className="table-wrap">
          <table className="table table--compact">
            <thead>
              <tr><th>Vị trí</th><th>Mã hàng</th><th className="num">Hệ thống</th><th className="num">Thực tế</th><th className="num">Chênh lệch</th><th>Nguyên nhân</th></tr>
            </thead>
            <tbody>
              {c.lines.map((l) => {
                const d = countDiff(l);
                return (
                  <tr key={l.location}>
                    <td className="mono" style={{ fontWeight: 600 }}>{l.location}</td>
                    <td>
                      <div>{findSku(l.sku).name}</div>
                      <div className="mono subtle" style={{ fontSize: 11 }}>{l.sku}</div>
                    </td>
                    <td className="num">{l.system}</td>
                    <td className="num">{l.counted ?? <span className="subtle">chưa đếm</span>}</td>
                    <td className="num" style={{ fontWeight: 700, color: d === undefined || d === 0 ? undefined : d < 0 ? 'var(--red)' : 'var(--amber)' }}>
                      {d === undefined ? '—' : signed(d)}
                    </td>
                    <td className="muted" style={{ fontSize: 12 }}>{l.reason ?? (d === 0 ? 'Khớp' : '')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="detail__section">
        <div className="section-title">Quy trình</div>
        <Timeline items={steps(c)} />
      </div>
    </section>
  );
}

export default function CountsPage() {
  const [items, setItems] = useState(initialCounts);
  const [selected, setSelected] = useState(initialCounts[0].code);
  const current = useMemo(() => items.find((c) => c.code === selected) ?? items[0], [items, selected]);
  const update = (next: StockCount) => setItems((l) => l.map((c) => (c.code === next.code ? next : c)));

  return (
    <>
      <PageHeader
        icon={<ClipboardCheck size={18} />}
        section="Kho"
        title="Kiểm kê và điều chỉnh"
        description="Phiếu kiểm kê định kỳ hoặc đột xuất theo khu. Chênh lệch chỉ được ghi vào tồn kho sau khi Trưởng kho duyệt."
        actions={<button className="btn btn--primary"><Plus size={15} /> Tạo phiếu kiểm kê</button>}
      />
      <StatGrid
        items={[
          { label: 'Chờ duyệt điều chỉnh', value: String(items.filter((c) => c.status === 'Chờ duyệt điều chỉnh').length), note: 'Khu A3 lệch −14 thùng', valueTone: 'amber', noteTone: 'red', module: 'WMS' },
          { label: 'Đang đếm', value: String(items.filter((c) => c.status === 'Đang đếm').length), note: 'Khu C · kho đông' },
          { label: 'Độ chính xác tồn kho', value: '99,2%', note: 'Theo số vị trí khớp · 30 ngày', noteTone: 'green' },
          { label: 'Kỳ kiểm kê tiếp theo', value: '25/10', note: 'Khu B · dệt may' },
        ]}
      />

      <div className="master-detail">
        <div className="card md-list">
          {items.map((c) => {
            const net = netDiff(c);
            return (
              <button key={c.code} className={`md-item ${c.code === current.code ? 'is-active' : ''}`} onClick={() => setSelected(c.code)}>
                <div className="md-item__row">
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{c.code}</span>
                  <Badge tone={countStatusTone[c.status]}>{c.status}</Badge>
                </div>
                <div style={{ fontWeight: 600 }}>{c.zone}</div>
                <div className="md-item__row" style={{ fontSize: 12 }}>
                  <span className="muted">{c.kind} · {c.counter} · {c.date}</span>
                  <b style={{ color: net < 0 ? 'var(--red)' : undefined }}>{signed(net)}</b>
                </div>
              </button>
            );
          })}
        </div>
        <CountDetail key={current.code} c={current} onUpdate={update} />
      </div>
    </>
  );
}
