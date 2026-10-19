import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Files, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { StatItem } from '../../../types';
import { findVehicle, orders } from '../data';
import { fmtHour, orderStatusTone, orderStatuses } from '../shared';
import type { OrderStatus, Region, TransportOrder } from '../types';
import '../transport.css';

type StatusFilter = 'all' | OrderStatus;
type RegionFilter = 'all' | Region;

const stats: StatItem[] = [
  { label: 'Lệnh hôm nay', value: String(orders.filter((o) => o.date === '19/10').length), note: '2 đang chạy', module: 'TMS' },
  { label: 'Chờ điều xe', value: String(orders.filter((o) => o.status === 'Chờ điều xe').length), note: '1 lệnh hạn gán xe 17:00 hôm nay', valueTone: 'amber', noteTone: 'amber' },
  { label: 'Chờ POD', value: String(orders.filter((o) => o.status === 'Chờ POD').length), note: '1 lệnh trễ 2 ngày, chặn hóa đơn', valueTone: 'red', noteTone: 'red' },
  { label: 'Giao đúng hạn · 30 ngày', value: '94,2%', note: 'Mục tiêu 95%' },
];

function OrderDetail({ o }: { o: TransportOrder }) {
  const v = findVehicle(o.vehicle);
  const action =
    o.status === 'Chờ điều xe' ? (
      <Link to="/dieu-phoi-xe" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>Điều xe</Link>
    ) : o.status === 'Chờ POD' ? (
      <Link to="/duyet-pod" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>Xem POD</Link>
    ) : o.trip ? (
      <Link to="/chuyen" className="btn btn--sm" style={{ textDecoration: 'none' }}>Xem chuyến {o.trip}</Link>
    ) : null;

  return (
    <aside className="card">
      <DetailHeader
        code={o.code}
        badge={<Badge tone={orderStatusTone[o.status]}>{o.status}</Badge>}
        title={o.kind}
        subtitle={o.customer}
        actions={
          <>
            {action}
            <button className="btn btn--sm">Sửa lệnh</button>
          </>
        }
      />
      {o.note && (
        <div className="detail__section">
          <Alert tone={o.status === 'Chờ POD' ? 'red' : 'amber'}>{o.note}</Alert>
        </div>
      )}
      <div className="detail__section">
        <div className="route-mini">
          <div><span className="route-mini__dot" /> <div><div className="kv__k">Điểm đi</div>{o.from}</div></div>
          <div><span className="route-mini__dot route-mini__dot--end" /> <div><div className="kv__k">Điểm đến</div>{o.to}</div></div>
        </div>
      </div>
      <div className="detail__section kv-grid">
        <Field label={o.job ? 'Job' : 'Theo'}>{o.job ? <JobLink code={o.job} /> : o.contract}</Field>
        <Field label="Khu vực">{o.region}</Field>
        <Field label="Hàng">{o.cargo}</Field>
        <Field label="Container">{o.container ? <span className="mono">{o.container}</span> : '—'}</Field>
        <Field label="Thời gian">{o.date} · {fmtHour(o.start)} – {fmtHour(o.end)}</Field>
        <Field label="Quãng đường">{o.distanceKm} km</Field>
        <Field label="Loại xe cần">{o.needs}</Field>
        <Field label="Chuyến">{o.trip ?? '—'}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Xe và tài xế</div>
        {v ? (
          <div className="kv-grid">
            <Field label="Biển số"><span className="mono">{v.plate}</span> · {v.type}</Field>
            <Field label="Đơn vị">{v.owner}</Field>
            <Field label="Tài xế">{v.driver}</Field>
            <Field label="Điện thoại"><span className="mono">{v.phone}</span></Field>
          </div>
        ) : (
          <p className="subtle">Chưa gán xe.</p>
        )}
      </div>
    </aside>
  );
}

export default function TransportOrdersPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [region, setRegion] = useState<RegionFilter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(orders[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (status === 'all' || o.status === status) &&
        (region === 'all' || o.region === region) &&
        (!q || [o.code, o.customer, o.job ?? '', o.container ?? '', o.vehicle ?? '', o.from, o.to].some((s) => s.toLowerCase().includes(q))),
    );
  }, [status, region, query]);

  const current = rows.find((o) => o.code === selected) ?? rows[0];
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <>
      <PageHeader
        icon={<Files size={18} />}
        section="Vận tải"
        title="Lệnh vận chuyển"
        description="Lệnh lấy rỗng, đóng hàng, hạ bãi, giao hàng tạo từ job hoặc theo hợp đồng vận tải. Lệnh chưa có xe chuyển sang Điều phối xe."
        actions={<button className="btn btn--primary"><Plus size={15} /> Tạo lệnh</button>}
      />
      <StatGrid items={stats} />

      <div className="toolbar">
        <Segmented<StatusFilter>
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'Tất cả', count: orders.length }, ...orderStatuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
        <Segmented<RegionFilter>
          value={region}
          onChange={setRegion}
          options={[{ value: 'all', label: 'Mọi khu vực' }, { value: 'Hải Phòng', label: 'Hải Phòng' }, { value: 'TP.HCM', label: 'TP.HCM' }]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số lệnh, job, container, biển số..." />
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Lệnh</th>
                <th>Công việc</th>
                <th>Tuyến</th>
                <th>Thời gian</th>
                <th>Xe</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.code} className={`clickable ${o.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(o.code)}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{o.code}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{o.job ?? o.contract}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.kind}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{o.customer} · {o.cargo}</div>
                  </td>
                  <td>
                    <div>{o.from}</div>
                    <div className="subtle" style={{ fontSize: 11.5 }}>→ {o.to}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div>{o.date}</div>
                    <div className="subtle" style={{ fontSize: 11.5 }}>{fmtHour(o.start)} – {fmtHour(o.end)}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {o.vehicle ? <span className="mono" style={{ fontSize: 12 }}>{o.vehicle}</span> : <OutlineBadge>{o.needs}</OutlineBadge>}
                  </td>
                  <td><Badge tone={orderStatusTone[o.status]}>{o.status}</Badge></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có lệnh phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {current ? <OrderDetail o={current} /> : <aside className="card md-empty">Chọn một lệnh để xem chi tiết.</aside>}
      </div>
    </>
  );
}
