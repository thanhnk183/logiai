import { useMemo, useState } from 'react';
import { MapPin, Plane, Ship, Share2, Truck } from 'lucide-react';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline } from '../../../components/ui/Timeline';
import type { StatItem } from '../../../types';
import { jobs } from '../data';
import { jobStatusTone } from '../shared';
import type { Job } from '../types';
import '../jobs.css';

const trackingStats: StatItem[] = [
  { label: 'Lô hàng đang theo dõi', value: '86', note: '52 trên biển, 9 trên không, 25 nội địa' },
  { label: 'Có thể trễ ETA', value: '4', note: 'Dự báo từ lịch tàu và thời tiết', valueTone: 'amber', noteTone: 'amber' },
  { label: 'Đến cảng trong 7 ngày', value: '17', note: 'Cần chuẩn bị D/O và giao hàng' },
  { label: 'Cập nhật tự động', value: '92%', note: 'Qua API hãng tàu, hãng bay, GPS xe' },
];

const tracked = jobs.filter((j) => j.tracking);

function ModeIcon({ job, size = 16 }: { job: Job; size?: number }) {
  if (job.mode === 'AIR') return <Plane size={size} />;
  if (job.mode === 'FTL') return <Truck size={size} />;
  return <Ship size={size} />;
}

function RouteProgress({ job }: { job: Job }) {
  const t = job.tracking!;
  return (
    <div className="route">
      <div className="route__ends">
        <div>
          <div className="kv__k">Đi</div>
          <b>{job.pol}</b>
          <div className="subtle" style={{ fontSize: 11.5 }}>ETD {job.etd}</div>
        </div>
        {job.via && (
          <div style={{ textAlign: 'center' }}>
            <div className="kv__k">Chuyển tải</div>
            <b>{job.via}</b>
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <div className="kv__k">Đến</div>
          <b>{job.pod}</b>
          <div className="subtle" style={{ fontSize: 11.5 }}>ETA {job.eta}</div>
        </div>
      </div>
      <div className="route__track" role="progressbar" aria-valuenow={t.progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="route__fill" style={{ width: `${t.progress}%` }} />
        <span className="route__dot route__dot--start" />
        {job.via && <span className="route__dot" style={{ left: '50%' }} />}
        <span className="route__dot route__dot--end" />
        <span className="route__vehicle" style={{ left: `${t.progress}%` }}><ModeIcon job={job} size={14} /></span>
      </div>
      <div className="route__pos"><MapPin size={13} /> {t.position}</div>
    </div>
  );
}

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(tracked[0]?.code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Tìm theo số job, khách, tàu, B/L và cả số container trong lệnh vận chuyển
    return tracked.filter(
      (j) => !q || [j.code, j.customer, j.vessel ?? '', j.bl ?? '', j.booking ?? '', ...j.transport.map((t) => t.vehicle)].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  const current = rows.find((j) => j.code === selected) ?? rows[0];

  return (
    <>
      <PageHeader
        icon={<MapPin size={18} />}
        section="Job / Lô hàng"
        title="Tracking lô hàng"
        description="Vị trí và các mốc của lô hàng, cập nhật từ hãng tàu, hãng bay và GPS Driver App. Có thể chia sẻ link theo dõi cho khách qua Portal."
      />
      <StatGrid items={trackingStats} />

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Số job, B/L, booking, tàu, biển số xe..." />
        <span className="toolbar__right">{rows.length} lô hàng</span>
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không tìm thấy lô hàng.</div>}
          {rows.map((j) => (
            <button key={j.code} className={`md-item ${j.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(j.code)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{j.code}</span>
                <span className="subtle" style={{ display: 'inline-flex' }}><ModeIcon job={j} size={14} /></span>
              </div>
              <div style={{ fontWeight: 600 }}>{j.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}>{j.pol} → {j.pod}</div>
              <div className="progress" style={{ marginTop: 6 }}>
                <div className="progress__bar" style={{ width: `${j.tracking!.progress}%`, background: 'var(--brand)' }} />
              </div>
              <div className="md-item__row subtle" style={{ fontSize: 11 }}>
                <span>ETA {j.eta}</span>
                <span>{j.tracking!.progress}%</span>
              </div>
            </button>
          ))}
        </div>

        {current ? (
          <section className="card">
            <DetailHeader
              code={<JobLink code={current.code} />}
              badge={<Badge tone={jobStatusTone[current.status]}>{current.status}</Badge>}
              title={current.customer}
              subtitle={<><OutlineBadge>{current.mode}</OutlineBadge> {current.carrier ?? 'Xe nội bộ'} · {current.vessel ?? current.equipment}</>}
              actions={
                <>
                  <button className="btn btn--primary btn--sm"><Share2 size={14} /> Chia sẻ link cho khách</button>
                  <button className="btn btn--sm">Cập nhật thủ công</button>
                </>
              }
            />
            <div className="detail__section">
              <RouteProgress job={current} />
            </div>
            <div className="detail__section kv-grid kv-grid--3">
              <Field label="Cập nhật lần cuối">{current.tracking!.lastUpdate}</Field>
              <Field label="Nguồn dữ liệu">{current.tracking!.source}</Field>
              <Field label="Vận đơn">{current.bl ?? '—'}</Field>
            </div>
            <div className="detail__section">
              <div className="section-title">Các mốc</div>
              <Timeline items={current.tracking!.events} />
            </div>
          </section>
        ) : (
          <div className="card md-empty">Chọn một lô hàng để xem hành trình.</div>
        )}
      </div>
    </>
  );
}
