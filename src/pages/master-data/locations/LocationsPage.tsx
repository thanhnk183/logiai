import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { StatGrid } from '../../../components/ui/StatCard';
import { fold } from '../../documents/shared';
import { jobs } from '../../jobs/data';
import { locations } from '../data';
import { RecordPanel, StatusBadge, useRecords } from '../shared';
import type { Location, LocationKind } from '../types';
import '../master-data.css';

const kinds: LocationKind[] = ['Cảng biển', 'Sân bay', 'Depot / ICD', 'Kho', 'Chi cục hải quan', 'Điểm giao nhận'];

/** Job có cảng đi, cảng đến hoặc cảng chuyển tải trùng tên địa điểm */
const jobsAt = (l: Location) => jobs.filter((j) => l.aliases.some((a) => [j.pol, j.pod, j.via].includes(a)));

export default function LocationsPage() {
  const [rows, update] = useRecords(locations);
  const [kind, setKind] = useState<LocationKind | ''>('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('VNHPH');

  const q = fold(query.trim());
  const list = rows.filter((l) => (!kind || l.kind === kind) && (!q || fold(`${l.code} ${l.name} ${l.city} ${l.country}`).includes(q)));
  const current = rows.find((l) => l.code === selected) ?? list[0];
  const used = current ? jobsAt(current) : [];
  const countries = new Set(rows.map((l) => l.country)).size;

  return (
    <>
      <PageHeader
        icon={<MapPin size={18} />}
        section="Danh mục"
        title="Cảng, kho, địa điểm"
        description="Cảng biển, sân bay theo mã UN/LOCODE; depot, kho, chi cục hải quan và điểm giao nhận của khách. Dùng chung cho báo giá, booking, lệnh vận chuyển và tờ khai."
        actions={<button className="btn btn--primary"><Plus size={14} /> Thêm địa điểm</button>}
      />
      <StatGrid
        items={[
          { label: 'Cảng biển, sân bay', value: String(rows.filter((l) => l.kind === 'Cảng biển' || l.kind === 'Sân bay').length), note: `${countries} quốc gia` },
          { label: 'Depot, kho', value: String(rows.filter((l) => l.kind === 'Depot / ICD' || l.kind === 'Kho').length), note: 'Nơi lấy, trả rỗng và lưu hàng' },
          { label: 'Điểm giao nhận của khách', value: String(rows.filter((l) => l.kind === 'Điểm giao nhận').length), note: 'Nhà máy, kho khách hàng' },
          { label: 'Chờ duyệt', value: String(rows.filter((l) => l.status === 'Chờ duyệt').length), note: 'Thiếu toạ độ hoặc giờ nhận hàng', valueTone: 'amber' },
        ]}
      />
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Mã UN/LOCODE, tên, thành phố" />
        <div className="pill-row">
          <button className={`pill ${!kind ? 'active' : ''}`} onClick={() => setKind('')}>Tất cả</button>
          {kinds.map((k) => (
            <button key={k} className={`pill ${kind === k ? 'active' : ''}`} onClick={() => setKind(k)}>
              {k} <span className="subtle">{rows.filter((l) => l.kind === k).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="split split--wide">
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Mã</th><th>Địa điểm</th><th>Loại</th><th>Thành phố, quốc gia</th><th className="num">Job</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {list.map((l) => {
                const n = jobsAt(l).length;
                return (
                  <tr key={l.code} className={`clickable ${l.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(l.code)}>
                    <td className="mono" style={{ whiteSpace: 'nowrap' }}>{l.code}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      {l.note && <div className="subtle" style={{ fontSize: 11.5 }}>{l.note}</div>}
                    </td>
                    <td className="muted">{l.kind}</td>
                    <td>{l.city}<div className="subtle" style={{ fontSize: 11.5 }}>{l.country}</div></td>
                    <td className="num">{n || <span className="subtle">—</span>}</td>
                    <td><StatusBadge status={l.status} /></td>
                  </tr>
                );
              })}
              {!list.length && <tr><td colSpan={6} className="md-empty">Không có địa điểm phù hợp.</td></tr>}
            </tbody>
          </table>
        </Card>

        {current && (
          <RecordPanel
            key={current.code}
            code={`${current.code} · ${current.kind}`}
            title={current.name}
            subtitle={`${current.city}, ${current.country}`}
            record={current}
            onSave={(patch) => update(current.code, patch as Partial<Location>)}
            onStatus={(status) => update(current.code, { status })}
            issues={current.status === 'Chờ duyệt' ? ['Chưa có toạ độ GPS nên Driver App chưa dẫn đường và chưa tính được quãng đường cho lệnh vận chuyển.'] : []}
            fields={[
              { key: 'name', label: 'Tên', value: current.name, full: true },
              { key: 'city', label: 'Thành phố', value: current.city },
              { key: 'country', label: 'Quốc gia', value: current.country },
              { key: 'note', label: 'Ghi chú vận hành', value: current.note ?? '', full: true },
            ]}
          >
            {used.length > 0 && (
              <div className="detail__section">
                <div className="section-title">Job đi qua địa điểm này <small>{used.length} job</small></div>
                <div className="job-chips">{used.map((j) => <JobLink key={j.code} code={j.code} />)}</div>
              </div>
            )}
          </RecordPanel>
        )}
      </div>
    </>
  );
}
