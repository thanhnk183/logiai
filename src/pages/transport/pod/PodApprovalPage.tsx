import { useMemo, useState } from 'react';
import { Camera, CheckCircle2, ImageOff, PenLine, XCircle } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { pods as initialPods } from '../data';
import { podStatusTone } from '../shared';
import type { Pod, PodStatus } from '../types';
import '../transport.css';

type Filter = 'all' | PodStatus;
const statuses: PodStatus[] = ['Thiếu POD', 'Chờ duyệt', 'Yêu cầu chụp lại', 'Đã duyệt'];

function PodDetail({ p, onStatus }: { p: Pod; onStatus: (s: PodStatus) => void }) {
  const failed = p.checks.filter((c) => !c.ok).length;
  return (
    <section className="card">
      <DetailHeader
        code={<>{p.id} · {p.order}{p.job && <> · <JobLink code={p.job} /></>}</>}
        badge={<Badge tone={podStatusTone[p.status]}>{p.status}</Badge>}
        title={p.customer}
        subtitle={`${p.place} · giao ${p.deliveredAt}`}
        actions={
          p.status === 'Chờ duyệt' ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => onStatus('Đã duyệt')}>{failed ? 'Duyệt kèm ghi chú chênh lệch' : 'Duyệt POD'}</button>
              <button className="btn btn--sm" onClick={() => onStatus('Yêu cầu chụp lại')}>Yêu cầu chụp lại</button>
            </>
          ) : p.status === 'Thiếu POD' ? (
            <>
              <button className="btn btn--primary btn--sm">Nhắc tài xế</button>
              <button className="btn btn--sm">Xin khách xác nhận qua email</button>
            </>
          ) : null
        }
      />
      {p.overdue && (
        <div className="detail__section"><Alert tone="red">{p.overdue}</Alert></div>
      )}
      {p.status === 'Chờ duyệt' && failed > 0 && (
        <div className="detail__section">
          <Alert tone="amber">Có {failed} điểm chưa khớp. Nếu duyệt, chênh lệch sẽ chuyển sang CS để làm việc với khách.</Alert>
        </div>
      )}
      <div className="detail__section">
        <div className="section-title">Ảnh và chữ ký <small>chụp từ Driver App</small></div>
        <div className="photo-row">
          {p.photos === 0 ? (
            <span className="photo-tile photo-tile--empty"><ImageOff size={18} /><span>Chưa có ảnh</span></span>
          ) : (
            Array.from({ length: p.photos }, (_, i) => (
              <span key={i} className="photo-tile"><Camera size={18} /><span>Ảnh {i + 1}</span></span>
            ))
          )}
          <span className={`photo-tile photo-tile--sign ${p.signature ? '' : 'photo-tile--empty'}`}>
            <PenLine size={18} />
            <span>{p.signature ? 'Có chữ ký' : 'Chưa có chữ ký'}</span>
          </span>
        </div>
      </div>
      <div className="detail__section kv-grid">
        <Field label="Người nhận">{p.receiver ?? '—'}</Field>
        <Field label="Thời gian giao">{p.deliveredAt}</Field>
        <Field label="Tài xế">{p.driver}</Field>
        <Field label="Xe"><span className="mono">{p.vehicle}</span></Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Kiểm tra tự động</div>
        <ul className="checks">
          {p.checks.map((c) => (
            <li key={c.label}>
              {c.ok ? <CheckCircle2 size={15} color="var(--green)" /> : <XCircle size={15} color="var(--red)" />}
              <div>
                <div>{c.label}</div>
                {c.detail && <div className="checks__detail" style={{ color: c.ok ? 'var(--text-3)' : 'var(--red)' }}>{c.detail}</div>}
              </div>
            </li>
          ))}
        </ul>
        {p.note && <p className="muted" style={{ marginTop: 10 }}>{p.note}</p>}
      </div>
    </section>
  );
}

export default function PodApprovalPage() {
  const [items, setItems] = useState(initialPods);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState(initialPods[0].id);

  const rows = useMemo(() => items.filter((p) => filter === 'all' || p.status === filter), [items, filter]);
  const current = rows.find((p) => p.id === selected) ?? rows[0];
  const count = (s: PodStatus) => items.filter((p) => p.status === s).length;
  const setStatus = (id: string, status: PodStatus) => setItems((l) => l.map((p) => (p.id === id ? { ...p, status } : p)));

  return (
    <>
      <PageHeader
        icon={<PenLine size={18} />}
        section="Vận tải"
        title="Duyệt POD"
        description="Bằng chứng giao hàng từ Driver App: ảnh, chữ ký, vị trí GPS. POD được duyệt mới cho phép Kế toán xuất hóa đơn."
      />
      <StatGrid
        items={[
          { label: 'Chờ duyệt', value: String(count('Chờ duyệt')), note: 'Duyệt trong 24 giờ sau khi giao', valueTone: 'amber' },
          { label: 'Thiếu POD', value: String(count('Thiếu POD')), note: 'Đang chặn xuất hóa đơn', valueTone: 'red', noteTone: 'red' },
          { label: 'POD có chênh lệch · 30 ngày', value: '6', note: 'Chủ yếu thiếu kiện khi giao cửa hàng' },
          { label: 'Thời gian duyệt trung bình', value: '5,8 giờ', note: 'Mục tiêu dưới 8 giờ', noteTone: 'green' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: items.length }, ...statuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có POD.</div>}
          {rows.map((p) => (
            <button key={p.id} className={`md-item ${p.id === current?.id ? 'is-active' : ''}`} onClick={() => setSelected(p.id)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{p.order}</span>
                <Badge tone={podStatusTone[p.status]}>{p.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{p.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}>{p.place}</div>
              <div className="md-item__row subtle" style={{ fontSize: 11 }}>
                <span>{p.driver}</span>
                <span>{p.deliveredAt}</span>
              </div>
            </button>
          ))}
        </div>
        {current ? (
          <PodDetail p={current} onStatus={(s) => setStatus(current.id, s)} />
        ) : (
          <div className="card md-empty">Chọn một POD.</div>
        )}
      </div>
    </>
  );
}
