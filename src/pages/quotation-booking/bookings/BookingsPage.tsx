import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline } from '../../../components/ui/Timeline';
import type { Tone } from '../../../types';
import type { Booking, BookingStatus } from '../types';
import { bookingStats, bookings } from './data';
import '../quotation-booking.css';

type Filter = 'all' | BookingStatus;

const statuses: BookingStatus[] = ['Chờ hãng xác nhận', 'Đã xác nhận', 'Đã mở job', 'Đã hủy'];

const statusTone: Record<BookingStatus, Tone> = {
  'Chờ hãng xác nhận': 'amber',
  'Đã xác nhận': 'blue',
  'Đã mở job': 'green',
  'Đã hủy': 'gray',
};

function BookingDetail({ b }: { b: Booking }) {
  const isAir = b.mode === 'AIR';
  const actions: Record<BookingStatus, JSX.Element | null> = {
    'Chờ hãng xác nhận': (
      <>
        <button className="btn btn--primary btn--sm">Nhắc hãng</button>
        <button className="btn btn--sm">Đổi chuyến</button>
      </>
    ),
    'Đã xác nhận': <button className="btn btn--primary btn--sm">Mở job</button>,
    'Đã mở job': isAir ? (
      <button className="btn btn--primary btn--sm">Lập AWB</button>
    ) : (
      <Link to="/shipping-instruction" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>Soạn SI</Link>
    ),
    'Đã hủy': null,
  };

  return (
    <aside className="card">
      <DetailHeader
        code={b.code}
        badge={<Badge tone={statusTone[b.status]}>{b.status}</Badge>}
        title={b.customer}
        subtitle={`${b.pol} → ${b.pod} · ${b.equipment}`}
        actions={actions[b.status]}
      />
      {b.note && (
        <div className="detail__section">
          <Alert tone={b.status === 'Đã hủy' ? 'gray' : 'amber'}>{b.note}</Alert>
        </div>
      )}
      <div className="detail__section kv-grid">
        <Field label={isAir ? 'Hãng bay' : 'Hãng tàu'}>{b.carrier}</Field>
        <Field label={isAir ? 'Chuyến bay' : 'Tàu / chuyến'}>{b.vessel}</Field>
        <Field label="Số booking của hãng">{b.carrierRef ?? '—'}</Field>
        <Field label="ETD / ETA">{b.etd} → {b.eta}</Field>
        <Field label="Báo giá">{b.quotation ? <Link to="/bao-gia">{b.quotation}</Link> : '—'}</Field>
        <Field label="Job">{b.job ? <JobLink code={b.job} /> : '—'}</Field>
      </div>

      {b.cutoffs.length > 0 && (
        <div className="detail__section">
          <div className="section-title">Mốc cut-off</div>
          <div className="cutoffs">
            {b.cutoffs.map((c) => (
              <div key={c.label}>
                <span className="muted">{c.label}</span>
                <b style={{ color: c.tone ? toneColor[c.tone] : undefined }}>{c.time}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {b.containers.length > 0 && (
        <div className="detail__section">
          <div className="section-title">Container <small>{b.containers.length} cont</small></div>
          <table className="table table--compact">
            <tbody>
              {b.containers.map((c) => (
                <tr key={c.no}>
                  <td>
                    <div className="mono" style={{ fontWeight: 600 }}>{c.no}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{c.type} · seal {c.seal ?? 'chưa có'}</div>
                  </td>
                  <td className="num muted">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="detail__section">
        <div className="section-title">Tiến độ</div>
        <Timeline items={b.milestones} />
      </div>
    </aside>
  );
}

export default function BookingsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(bookings[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        (filter === 'all' || b.status === filter) &&
        (!q || [b.code, b.customer, b.carrier, b.vessel, b.job ?? '', b.carrierRef ?? ''].some((s) => s.toLowerCase().includes(q))),
    );
  }, [filter, query]);

  const current = rows.find((b) => b.code === selected) ?? rows[0];
  const count = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;

  return (
    <>
      <PageHeader
        icon={<CalendarCheck size={18} />}
        section="Báo giá và Booking"
        title="Booking"
        description="Đặt chỗ với hãng tàu, hãng bay, theo dõi xác nhận, cut-off, ETD và ETA. Booking được xác nhận sẽ mở job."
        actions={<button className="btn btn--primary"><Plus size={15} /> Tạo booking</button>}
      />
      <StatGrid items={bookingStats} />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: bookings.length },
            ...statuses.map((s) => ({ value: s, label: s, count: count(s) })),
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số booking, job, khách, tàu..." />
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Khách hàng</th>
                <th>Hãng / chuyến</th>
                <th>Tuyến</th>
                <th>ETD → ETA</th>
                <th>Cut-off gần nhất</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const next = b.cutoffs[0];
                return (
                  <tr key={b.code} className={`clickable ${b.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(b.code)}>
                    <td>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{b.code}</div>
                      <div className="subtle" style={{ fontSize: 11 }}>{b.job ?? 'Chưa mở job'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{b.customer}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}><OutlineBadge>{b.mode}</OutlineBadge> {b.equipment}</div>
                    </td>
                    <td>
                      <div style={{ whiteSpace: 'nowrap' }}>{b.carrier}</div>
                      <div className="subtle" style={{ fontSize: 11 }}>{b.vessel}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{b.pol} → {b.pod}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{b.etd} → {b.eta}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {next ? (
                        <>
                          <div className="subtle" style={{ fontSize: 11 }}>{next.label}</div>
                          <div style={{ fontWeight: 600, color: next.tone ? toneColor[next.tone] : undefined }}>{next.time}</div>
                        </>
                      ) : '—'}
                    </td>
                    <td><Badge tone={statusTone[b.status]}>{b.status}</Badge></td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có booking phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {current ? <BookingDetail b={current} /> : <aside className="card md-empty">Chọn một booking để xem chi tiết.</aside>}
      </div>
    </>
  );
}
