import { useMemo, useState } from 'react';
import { Camera, Container } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { containers } from '../data';
import type { ContainerRec } from '../types';
import '../transport.css';

type Filter = 'all' | 'freetime' | 'damaged' | 'customer';

const isDamaged = (c: ContainerRec) => c.eirs.some((e) => e.condition === 'Có hư hỏng');
const isExpiring = (c: ContainerRec) => c.freeTone === 'red' || c.freeTone === 'amber';
const atCustomer = (c: ContainerRec) => c.location.startsWith('Kho');

const filters: Record<Exclude<Filter, 'all'>, (c: ContainerRec) => boolean> = {
  freetime: isExpiring,
  damaged: isDamaged,
  customer: atCustomer,
};

function ContainerDetail({ c }: { c: ContainerRec }) {
  return (
    <aside className="card">
      <DetailHeader
        code={c.job ? <JobLink code={c.job} /> : '—'}
        badge={<Badge tone={c.statusTone}>{c.status}</Badge>}
        title={<span className="mono">{c.no}</span>}
        subtitle={`${c.type} · ${c.carrier} · ${c.customer}`}
        actions={
          <>
            <button className="btn btn--primary btn--sm"><Camera size={14} /> Ghi EIR mới</button>
            <button className="btn btn--sm">Xin gia hạn free time</button>
          </>
        }
      />
      {c.freeTime && isExpiring(c) && (
        <div className="detail__section">
          <Alert tone={c.freeTone}>{c.freeTime}. Cần kéo về kho hoặc xin gia hạn để tránh phí lưu bãi.</Alert>
        </div>
      )}
      <div className="detail__section kv-grid">
        <Field label="Vị trí hiện tại" full>{c.location}</Field>
        <Field label="Di chuyển gần nhất">{c.lastMove}</Field>
        <Field label="Seal">{c.seal ? <span className="mono">{c.seal}</span> : <span className="text-amber">Chưa có</span>}</Field>
        <Field label="Free time" full>{c.freeTime ?? '—'}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Phiếu EIR / Gate <small>{c.eirs.length} phiếu</small></div>
        {c.eirs.length === 0 && <p className="subtle">Chưa có phiếu giao nhận.</p>}
        {c.eirs.map((e, i) => (
          <div key={i} className={`eir ${e.condition === 'Có hư hỏng' ? 'is-damaged' : ''}`}>
            <div className="md-item__row">
              <b>{e.kind}</b>
              <Badge tone={e.condition === 'Tốt' ? 'green' : 'red'}>{e.condition}</Badge>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>{e.place} · {e.time}</div>
            <div className="subtle" style={{ fontSize: 11.5 }}>{e.by}</div>
            {e.note && <div style={{ fontSize: 12, color: toneColor.red, marginTop: 4 }}>{e.note}</div>}
            <div className="photo-row">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className="photo-tile photo-tile--sm" aria-label={`Ảnh ${n}`}><Camera size={14} /></span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ContainersPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(containers[0].no);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return containers.filter(
      (c) => (filter === 'all' || filters[filter](c)) && (!q || [c.no, c.customer, c.job ?? '', c.carrier, c.seal ?? ''].some((s) => s.toLowerCase().includes(q))),
    );
  }, [filter, query]);

  const current = rows.find((c) => c.no === selected) ?? rows[0];

  return (
    <>
      <PageHeader
        icon={<Container size={18} />}
        section="Vận tải"
        title="Container và EIR"
        description="Vị trí, trạng thái và hạn miễn phí lưu bãi / lưu container của từng container, kèm phiếu EIR và ảnh tình trạng chụp từ Driver App."
      />
      <StatGrid
        items={[
          { label: 'Container đang theo dõi', value: '164', note: '52 tại kho khách, 38 tại bãi cảng' },
          { label: 'Sắp hết free time · 2 ngày', value: String(containers.filter(isExpiring).length), note: 'Container LGPU 482193-0 còn 1 ngày', valueTone: 'red', noteTone: 'red' },
          { label: 'EIR ghi nhận hư hỏng', value: String(containers.filter(isDamaged).length), note: 'Trong 30 ngày, cần lưu bằng chứng', valueTone: 'amber' },
          { label: 'Phí lưu bãi phát sinh · tháng 10', value: '12,6 tr ₫', note: '4 container, giảm 38% so với tháng 9', noteTone: 'green' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: containers.length },
            { value: 'freetime', label: 'Sắp hết free time', count: containers.filter(isExpiring).length },
            { value: 'damaged', label: 'Có hư hỏng', count: containers.filter(isDamaged).length },
            { value: 'customer', label: 'Tại kho khách', count: containers.filter(atCustomer).length },
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số container, seal, job, khách..." />
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>Container</th><th>Khách hàng / job</th><th>Vị trí</th><th>Trạng thái</th><th>Free time</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.no} className={`clickable ${c.no === current?.no ? 'selected' : ''}`} onClick={() => setSelected(c.no)}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{c.no}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{c.type} · {c.carrier}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.customer}</div>
                    {c.job && <JobLink code={c.job} style={{ fontSize: 11 }} />}
                  </td>
                  <td>
                    <div>{c.location}</div>
                    <div className="subtle" style={{ fontSize: 11.5 }}>{c.lastMove}</div>
                  </td>
                  <td>
                    <Badge tone={c.statusTone}>{c.status}</Badge>
                    {isDamaged(c) && <div className="text-red" style={{ fontSize: 11.5, marginTop: 3 }}>EIR có hư hỏng</div>}
                  </td>
                  <td style={{ fontSize: 12, fontWeight: c.freeTone === 'red' ? 600 : 400, color: c.freeTone && c.freeTone !== 'green' ? toneColor[c.freeTone] : 'var(--text-2)' }}>
                    {c.freeTime ?? '—'}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có container phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
        {current ? <ContainerDetail c={current} /> : <aside className="card md-empty">Chọn một container.</aside>}
      </div>
    </>
  );
}
