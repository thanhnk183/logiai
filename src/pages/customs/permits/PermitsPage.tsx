import { useMemo, useState } from 'react';
import { BadgeCheck, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { permits } from '../data';
import { permitTone } from '../shared';
import type { Permit, PermitStatus } from '../types';
import '../customs.css';

type Filter = 'all' | 'attention' | 'co' | 'license';

const needsAttention = (p: Permit) => p.status === 'Sắp hết hạn' || p.status === 'Hết hạn' || p.status === 'Đang xin';
const isCo = (p: Permit) => p.kind.startsWith('C/O') || p.kind.includes('REX');
const isLicense = (p: Permit) => p.kind.startsWith('Giấy phép');

const filters: Record<Exclude<Filter, 'all'>, (p: Permit) => boolean> = { attention: needsAttention, co: isCo, license: isLicense };

function PermitDetail({ p }: { p: Permit }) {
  const tone = p.status === 'Sắp hết hạn' || p.status === 'Hết hạn' ? 'red' : p.status === 'Đang xin' ? 'blue' : 'gray';
  return (
    <aside className="card">
      <DetailHeader
        code={p.code}
        badge={<Badge tone={permitTone[p.status as PermitStatus]}>{p.status}</Badge>}
        title={p.kind}
        subtitle={p.customer}
        actions={
          p.status === 'Sắp hết hạn' ? <button className="btn btn--primary btn--sm">Nhắc khách xin gia hạn</button>
            : p.status === 'Đang xin' ? <button className="btn btn--sm">Cập nhật tiến độ</button>
              : <button className="btn btn--sm">Xem bản scan</button>
        }
      />
      {p.note && <div className="detail__section"><Alert tone={tone}>{p.note}</Alert></div>}
      <div className="detail__section kv-grid">
        <Field label="Cơ quan cấp" full>{p.issuer}</Field>
        <Field label="Ngày cấp">{p.issued ?? '—'}</Field>
        <Field label="Hiệu lực đến">{p.expiry}</Field>
        <Field label="Job">{p.job ? <JobLink code={p.job} /> : '—'}</Field>
        <Field label="Sử dụng">{p.usage ?? '—'}</Field>
      </div>
    </aside>
  );
}

export default function PermitsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(permits[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return permits.filter((p) => (filter === 'all' || filters[filter](p)) && (!q || [p.code, p.kind, p.customer].some((s) => s.toLowerCase().includes(q))));
  }, [filter, query]);
  const current = rows.find((p) => p.code === selected) ?? rows[0];

  return (
    <>
      <PageHeader
        icon={<BadgeCheck size={18} />}
        section="Hải quan"
        title="Giấy phép và C/O"
        description="Giấy phép xuất nhập khẩu, chứng nhận xuất xứ (C/O), kiểm dịch, hun trùng: hạn hiệu lực, số lần đã dùng và nhắc gia hạn."
        actions={<button className="btn btn--primary"><Plus size={15} /> Thêm giấy phép</button>}
      />
      <StatGrid
        items={[
          { label: 'Đang còn hiệu lực', value: String(permits.filter((p) => p.status === 'Còn hiệu lực').length), note: 'Gồm giấy phép và mã REX', module: 'CUS' },
          { label: 'Sắp hết hạn · 30 ngày', value: String(permits.filter((p) => p.status === 'Sắp hết hạn').length), note: 'PL-2026-0331 hết hạn 24/10', valueTone: 'red', noteTone: 'red' },
          { label: 'Đang xin', value: String(permits.filter((p) => p.status === 'Đang xin').length), note: '2 cho job HPH-SEA-2610-0131', noteTone: 'amber' },
          { label: 'Ưu đãi thuế nhờ C/O · quý 3', value: '214 tr ₫', note: 'Khách tiết kiệm được', noteTone: 'green' },
        ]}
      />
      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: permits.length },
            { value: 'attention', label: 'Cần chú ý', count: permits.filter(needsAttention).length },
            { value: 'license', label: 'Giấy phép', count: permits.filter(isLicense).length },
            { value: 'co', label: 'C/O, xuất xứ', count: permits.filter(isCo).length },
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số giấy phép, loại, khách..." />
      </div>
      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead><tr><th>Số</th><th>Loại</th><th>Khách hàng</th><th>Hiệu lực đến</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.code} className={`clickable ${p.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(p.code)}>
                  <td className="mono" style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{p.code}</td>
                  <td>
                    <div>{p.kind}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{p.issuer}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.customer}</td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: p.status === 'Sắp hết hạn' ? 600 : 400, color: p.status === 'Sắp hết hạn' ? 'var(--red)' : undefined }}>{p.expiry}</td>
                  <td><Badge tone={permitTone[p.status]}>{p.status}</Badge></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có giấy phép phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
        {current ? <PermitDetail p={current} /> : <aside className="card md-empty">Chọn một giấy phép.</aside>}
      </div>
    </>
  );
}
