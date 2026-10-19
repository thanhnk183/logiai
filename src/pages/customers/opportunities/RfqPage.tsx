import { useMemo, useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { OutlineBadge, toneColor } from '../../../components/ui/Badge';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Rfq, RfqSource } from '../types';
import { rfqStats, rfqs, salesPerformance, stages } from './data';
import { formatK, formatUsd } from '../../../utils/format';
import './rfq.css';

type SourceFilter = 'all' | RfqSource;

function RfqCard({ r, active, onClick }: { r: Rfq; active: boolean; onClick: () => void }) {
  return (
    <button className={`rfq-card ${active ? 'is-active' : ''}`} onClick={onClick}>
      <div className="rfq-card__top">
        <span className="mono" style={{ fontSize: 10.5 }}>{r.code}</span>
        <OutlineBadge>{r.source}</OutlineBadge>
      </div>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.customer}</div>
      <div>{r.route}</div>
      <div className="muted" style={{ fontSize: 11.5 }}>{r.cargo}</div>
      <div className="rfq-card__foot">
        <b>{formatUsd(r.value)}</b>
        <span style={{ color: r.deadlineTone ? toneColor[r.deadlineTone] : 'var(--text-2)', fontSize: 11.5 }}>{r.deadline}</span>
        <Avatar initials={r.salesInitials} size={22} />
      </div>
    </button>
  );
}

function RfqDetail({ r }: { r: Rfq }) {
  const stage = stages.find((s) => s.key === r.stage)!;
  return (
    <section className="card">
      <div className="detail__section rfq-detail__head">
        <div>
          <div className="mono subtle" style={{ fontSize: 11 }}>{r.code} · {r.receivedAt}</div>
          <h2 style={{ fontSize: 17, margin: '4px 0 2px' }}>{r.customer}</h2>
          <div className="muted">{r.route} · {r.cargo}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">Đánh dấu thua</button>
          <button className="btn btn--primary">Chuyển sang FMS lập báo giá</button>
        </div>
      </div>
      <div className="detail__section rfq-detail__grid">
        <div><div className="kv__k">Giai đoạn</div><div className="kv__v"><b>{stage.title}</b></div></div>
        <div><div className="kv__k">Giá trị ước tính</div><div className="kv__v"><b>{formatUsd(r.value)}</b></div></div>
        <div><div className="kv__k">Sales phụ trách</div><div className="kv__v">{r.sales}</div></div>
        <div>
          <div className="kv__k">Hạn phản hồi khách</div>
          <div className="kv__v" style={{ color: r.deadlineTone && toneColor[r.deadlineTone], fontWeight: 600 }}>{r.deadline}</div>
        </div>
        <div><div className="kv__k">Điều kiện giao hàng</div><div className="kv__v">{r.incoterm}</div></div>
        <div><div className="kv__k">Ngày hàng sẵn sàng</div><div className="kv__v">{r.readyDate}</div></div>
      </div>
      <div className="detail__section">
        <div className="section-title">Yêu cầu của khách</div>
        <div className="quote-box">{r.request}</div>
        {r.attachments.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <b>Tệp đính kèm (lưu ở DMS):</b>
            {r.attachments.map((a) => <a key={a} href="#">{a}</a>)}
          </div>
        )}
      </div>
    </section>
  );
}

function SalesPerformance() {
  const max = Math.max(...salesPerformance.map((s) => s.revenue));
  return (
    <section className="card">
      <div className="card__head">
        <h3 className="card__title">Doanh số theo sales · tháng 10</h3>
        <a href="#" className="link-small">Báo cáo đầy đủ</a>
      </div>
      <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {salesPerformance.map((s) => (
          <div key={s.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <b>{s.name}</b>
              <span className="muted">{formatUsd(s.revenue)} · chốt {s.winRate}%</span>
            </div>
            <div className="progress" style={{ height: 6 }}>
              <div className="progress__bar" style={{ width: `${(s.revenue / max) * 100}%`, background: 'var(--green)' }} />
            </div>
          </div>
        ))}
        <p className="muted" style={{ fontSize: 11.5 }}>Doanh số tính theo job đã mở từ báo giá được chấp nhận.</p>
      </div>
    </section>
  );
}

export default function RfqPage() {
  const [source, setSource] = useState<SourceFilter>('all');
  const [selected, setSelected] = useState(rfqs[0].code);

  const visible = useMemo(() => rfqs.filter((r) => source === 'all' || r.source === source), [source]);
  const current = rfqs.find((r) => r.code === selected) ?? rfqs[0];

  return (
    <>
      <PageHeader
        icon={<Filter size={18} />}
        section="Khách hàng"
        title="Cơ hội và RFQ"
        description="RFQ nhận từ Portal, email và form. Khi đủ thông tin, chuyển sang FMS để lập báo giá."
        actions={
          <>
            <button className="btn">Danh sách</button>
            <button className="btn btn--primary"><Plus size={15} /> Tạo RFQ</button>
          </>
        }
      />
      <StatGrid items={rfqStats} />

      <div className="toolbar">
        <span className="muted">Nguồn</span>
        <Segmented<SourceFilter>
          value={source}
          onChange={setSource}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Portal', label: 'Portal' },
            { value: 'Email', label: 'Email' },
            { value: 'Form', label: 'Form' },
            { value: 'Sales nhập', label: 'Sales nhập' },
          ]}
        />
        <button className="chip">Sales: Tất cả</button>
        <button className="chip">Loại hình: Sea, Air, Nội địa</button>
        <span className="toolbar__right">Bấm vào thẻ để xem chi tiết</span>
      </div>

      <div className="kanban">
        {stages.map((s) => {
          const items = visible.filter((r) => r.stage === s.key);
          const total = items.reduce((sum, r) => sum + r.value, 0);
          return (
            <div key={s.key} className="kanban__col">
              <div className="kanban__head">
                <span><i style={{ background: s.color }} /> {s.title}</span>
                <span className="mono subtle" style={{ fontSize: 11 }}>{items.length} · {formatK(total)}</span>
              </div>
              <div className="muted" style={{ fontSize: 11.5, marginBottom: 8 }}>{s.desc}</div>
              {items.map((r) => (
                <RfqCard key={r.code} r={r} active={r.code === current.code} onClick={() => setSelected(r.code)} />
              ))}
            </div>
          );
        })}
      </div>

      <div className="rfq-bottom">
        <RfqDetail r={current} />
        <SalesPerformance />
      </div>
    </>
  );
}
