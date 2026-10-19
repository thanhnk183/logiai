import { useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed, Gauge, MapPin, Route } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline } from '../../../components/ui/Timeline';
import { findVehicle, orders, trips } from '../data';
import { fmtVnd, tripStatusTone } from '../shared';
import type { Trip, TripStatus } from '../types';
import '../transport.css';

type Filter = 'all' | TripStatus;
const statuses: TripStatus[] = ['Đang chạy', 'Chưa bắt đầu', 'Có sự cố', 'Hoàn tất'];

function TripDetail({ t }: { t: Trip }) {
  const v = findVehicle(t.vehicle);
  const tripOrders = orders.filter((o) => t.orders.includes(o.code));
  const total = t.costs.reduce((s, c) => s + c.amount, 0);

  return (
    <section className="card">
      <DetailHeader
        code={`${t.code} · ${t.date}`}
        badge={<Badge tone={tripStatusTone[t.status]}>{t.status}</Badge>}
        title={<><span className="mono">{t.vehicle}</span> · {t.driver}</>}
        subtitle={`${v?.type ?? ''} · ${v?.owner ?? ''} · ${t.distanceKm} km`}
        actions={
          <>
            {t.status === 'Đang chạy' && <button className="btn btn--sm">Gọi tài xế {v?.phone}</button>}
            {t.status === 'Đang chạy' && <button className="btn btn--primary btn--sm">Kết thúc chuyến</button>}
            {t.status === 'Có sự cố' && <button className="btn btn--primary btn--sm">Nhắc tài xế bổ sung POD</button>}
          </>
        }
      />
      {t.incident && (
        <div className="detail__section">
          <Alert tone="red">{t.incident}</Alert>
        </div>
      )}
      {t.gps && (
        <div className="detail__section">
          <div className="gps">
            <div><MapPin size={16} /><div><div className="kv__k">Vị trí GPS</div><b>{t.gps.position}</b></div></div>
            <div><Gauge size={16} /><div><div className="kv__k">Tốc độ</div><b>{t.gps.speed}</b></div></div>
            <div><Route size={16} /><div><div className="kv__k">Cập nhật</div><b>{t.gps.updated}</b></div></div>
          </div>
        </div>
      )}
      <div className="detail__section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
        <div>
          <div className="section-title">Các điểm dừng</div>
          <Timeline items={t.stops} />
        </div>
        <div>
          <div className="section-title">Lệnh trong chuyến <small>{tripOrders.length}</small></div>
          {tripOrders.map((o) => (
            <div key={o.code} className="trip-order">
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{o.code}</span>
                {o.job ? <JobLink code={o.job} style={{ fontSize: 11 }} /> : <span className="subtle" style={{ fontSize: 11 }}>{o.contract}</span>}
              </div>
              <div style={{ fontWeight: 600 }}>{o.kind}</div>
              <div className="muted" style={{ fontSize: 12 }}>{o.from} → {o.to}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="detail__section">
        <div className="section-title">Chi phí chuyến <small>tài xế nhập trên Driver App</small></div>
        {t.costs.length === 0 ? (
          <p className="subtle">Chưa phát sinh.</p>
        ) : (
          <table className="table table--compact">
            <tbody>
              {t.costs.map((c) => (
                <tr key={c.item}>
                  <td>{c.item}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: c.receipt ? 'var(--green)' : 'var(--amber)' }}>
                      {c.receipt ? <CheckCircle2 size={13} /> : <CircleDashed size={13} />}
                      {c.receipt ? 'Có hóa đơn' : 'Chưa có hóa đơn'}
                    </span>
                  </td>
                  <td className="num">{fmtVnd(c.amount)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}><b>Tổng</b></td>
                <td className="num"><b>{fmtVnd(total)}</b></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="detail__section kv-grid kv-grid--3">
        <Field label="Tài xế">{t.driver}</Field>
        <Field label="Điện thoại"><span className="mono">{v?.phone}</span></Field>
        <Field label="Quãng đường">{t.distanceKm} km</Field>
      </div>
    </section>
  );
}

export default function TripsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(trips[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trips.filter(
      (t) => (filter === 'all' || t.status === filter) && (!q || [t.code, t.vehicle, t.driver, ...t.orders].some((s) => s.toLowerCase().includes(q))),
    );
  }, [filter, query]);

  const current = rows.find((t) => t.code === selected) ?? rows[0];

  return (
    <>
      <PageHeader
        icon={<Route size={18} />}
        section="Vận tải"
        title="Chuyến (Trip)"
        description="Mỗi chuyến là một lượt chạy của xe, gồm một hoặc nhiều lệnh. Vị trí GPS, điểm dừng và chi phí cập nhật từ Driver App."
      />
      <StatGrid
        items={[
          { label: 'Chuyến đang chạy', value: String(trips.filter((t) => t.status === 'Đang chạy').length), note: 'GPS cập nhật mỗi 2 phút', module: 'TMS' },
          { label: 'Chuyến hôm nay', value: String(trips.filter((t) => t.date === '19/10').length), note: '1 chuyến chưa bắt đầu' },
          { label: 'Có sự cố', value: String(trips.filter((t) => t.status === 'Có sự cố').length), note: 'Thiếu POD, cần xử lý', valueTone: 'red', noteTone: 'red' },
          { label: 'Chi phí chưa có hóa đơn', value: '1,51 tr ₫', note: '2 khoản nhiên liệu', noteTone: 'amber' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: trips.length }, ...statuses.map((s) => ({ value: s, label: s, count: trips.filter((t) => t.status === s).length }))]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số chuyến, biển số, tài xế, lệnh..." />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có chuyến phù hợp.</div>}
          {rows.map((t) => (
            <button key={t.code} className={`md-item ${t.code === current?.code ? 'is-active' : ''}`} onClick={() => setSelected(t.code)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{t.code}</span>
                <Badge tone={tripStatusTone[t.status]}>{t.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}><span className="mono">{t.vehicle}</span> · {t.driver}</div>
              <div className="muted" style={{ fontSize: 12 }}>{t.gps ? t.gps.position : `${t.orders.length} lệnh · ${t.distanceKm} km`}</div>
              <div className="subtle" style={{ fontSize: 11 }}>{t.date}</div>
            </button>
          ))}
        </div>
        {current ? <TripDetail t={current} /> : <div className="card md-empty">Chọn một chuyến.</div>}
      </div>
    </>
  );
}
