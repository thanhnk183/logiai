import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { Badge, OutlineBadge, toneColor } from '../../../components/ui/Badge';
import { JobLink } from '../../../components/ui/JobLink';
import { LifecycleStepper } from '../../../components/ui/LifecycleStepper';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { jobStats, jobs } from '../data';
import { jobStatusTone, jobStatuses } from '../shared';
import type { JobMode, JobStatus } from '../types';
import '../jobs.css';

type StatusFilter = 'all' | JobStatus;
type ModeFilter = 'all' | 'sea' | 'air' | 'truck' | 'wh';

const modeGroups: Record<Exclude<ModeFilter, 'all'>, JobMode[]> = {
  sea: ['FCL', 'LCL'],
  air: ['AIR'],
  truck: ['FTL'],
  wh: ['WH'],
};

export default function JobListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (status === 'all' || j.status === status) &&
        (mode === 'all' || modeGroups[mode].includes(j.mode)) &&
        (!q || [j.code, j.customer, j.pol, j.pod, j.vessel ?? '', j.booking ?? '', j.bl ?? ''].some((s) => s.toLowerCase().includes(q))),
    );
  }, [status, mode, query]);

  const count = (s: JobStatus) => jobs.filter((j) => j.status === s).length;

  return (
    <>
      <PageHeader
        icon={<Boxes size={18} />}
        section="Job / Lô hàng"
        title="Danh sách job"
        description="Mọi lô hàng đang chạy, theo vòng đời Booking → Lấy hàng → Hải quan → Khởi hành → Đến → Giao → Hóa đơn. Bấm vào job để mở màn hình chi tiết."
      />
      <StatGrid items={jobStats} />

      <div className="toolbar">
        <Segmented<StatusFilter>
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'Tất cả', count: jobs.length }, ...jobStatuses.map((s) => ({ value: s, label: s, count: count(s) }))]}
        />
        <Segmented<ModeFilter>
          value={mode}
          onChange={setMode}
          options={[
            { value: 'all', label: 'Mọi loại hình' },
            { value: 'sea', label: 'Sea' },
            { value: 'air', label: 'Air' },
            { value: 'truck', label: 'Trucking' },
            { value: 'wh', label: 'Kho' },
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số job, khách, tàu, booking, B/L..." />
        <span className="toolbar__right">{rows.length} / 128 job</span>
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Khách hàng</th>
              <th>Tuyến</th>
              <th>Tiến độ</th>
              <th>ETD → ETA</th>
              <th>Phụ trách</th>
              <th>Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.code} className="clickable" onClick={() => navigate(`/job/${j.code}`)}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <JobLink code={j.code} />
                  <div style={{ marginTop: 2 }}><OutlineBadge>{j.mode}</OutlineBadge></div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{j.customer}</div>
                  <div className="subtle" style={{ fontSize: 11.5 }}>{j.direction}</div>
                </td>
                <td>
                  <div style={{ whiteSpace: 'nowrap' }}>{j.pol} → {j.pod}</div>
                  <div className="subtle" style={{ fontSize: 11.5 }}>{j.equipment}</div>
                </td>
                <td><LifecycleStepper steps={j.steps} size="compact" /></td>
                <td style={{ whiteSpace: 'nowrap' }}>{j.etd} → {j.eta}</td>
                <td>
                  <div>{j.cs}</div>
                  <div className="subtle" style={{ fontSize: 11.5 }}>Sales: {j.sales}</div>
                </td>
                <td style={{ minWidth: 170 }}>
                  <Badge tone={jobStatusTone[j.status]}>{j.status}</Badge>
                  {j.alert && <div style={{ fontSize: 11.5, marginTop: 3, color: toneColor[j.alert.tone] }}>{j.alert.text}</div>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có job phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
