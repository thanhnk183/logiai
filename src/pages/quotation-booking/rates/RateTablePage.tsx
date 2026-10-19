import { useMemo, useState } from 'react';
import { Plus, Tags, Upload } from 'lucide-react';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import type { Charge, FreightMode, FreightRate } from '../types';
import { rateColumns, rateStats, rateUnit, rates } from './data';
import '../quotation-booking.css';

const modeLabel: Record<FreightMode, string> = { FCL: 'Sea FCL', LCL: 'Sea LCL', AIR: 'Air' };

function ChargeTable({ title, rows }: { title: string; rows: Charge[] }) {
  return (
    <div className="detail__section">
      <div className="section-title">{title}</div>
      <table className="table table--compact">
        <tbody>
          {rows.map((c) => (
            <tr key={c.name}>
              <td>
                <div>{c.name}</div>
                <div className="subtle" style={{ fontSize: 11 }}>{c.basis}</div>
              </td>
              <td className="num"><b>{c.amount}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RateDetail({ r }: { r: FreightRate }) {
  const cols = rateColumns[r.mode];
  return (
    <aside className="card">
      <DetailHeader
        code={r.id}
        badge={r.expiring ? <Badge tone="amber">Sắp hết hiệu lực</Badge> : <Badge tone="green">Hiệu lực</Badge>}
        title={`${r.pol} → ${r.pod}`}
        subtitle={`${r.carrier} · ${modeLabel[r.mode]}${r.via ? ` · chuyển tải ${r.via}` : ''}`}
        actions={
          <>
            <button className="btn btn--primary btn--sm">Dùng cho báo giá</button>
            <button className="btn btn--sm">Cập nhật giá</button>
          </>
        }
      />
      <div className="detail__section">
        <div className="section-title">Giá cước <small>{rateUnit[r.mode]}</small></div>
        <div className="debt-boxes" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
          {cols.map((c, i) => (
            <div key={c}>
              <span>{c}</span>
              <b>{formatNumber(r.prices[i])}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="detail__section kv-grid">
        <Field label="Thời gian vận chuyển">{r.transit}</Field>
        <Field label="Tần suất">{r.frequency}</Field>
        <Field label="Hiệu lực">{r.validFrom} – {r.validTo}</Field>
        <Field label="Cập nhật">{r.updatedAt}</Field>
        <Field label="Free time" full>{r.freeTime}</Field>
        {r.note && <Field label="Ghi chú" full>{r.note}</Field>}
      </div>
      <ChargeTable title="Phụ phí của hãng" rows={r.surcharges} />
      <ChargeTable title="Phí địa phương đầu đi" rows={r.localCharges} />
    </aside>
  );
}

export default function RateTablePage() {
  const [mode, setMode] = useState<FreightMode>('FCL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rates.filter(
      (r) => r.mode === mode && (!q || [r.carrier, r.pol, r.pod, r.via ?? ''].some((s) => s.toLowerCase().includes(q))),
    );
  }, [mode, query]);

  const current = rows.find((r) => r.id === selected) ?? rows[0];
  const cols = rateColumns[mode];
  const count = (m: FreightMode) => rates.filter((r) => r.mode === m).length;

  // Giá thấp nhất mỗi cột trong danh sách đang lọc, để tô đậm
  const lowest = cols.map((_, i) => Math.min(...rows.map((r) => r.prices[i])));

  return (
    <>
      <PageHeader
        icon={<Tags size={18} />}
        section="Báo giá và Booking"
        title="Bảng giá cước"
        description="Giá cước theo hãng tàu, hãng bay, tuyến và loại hàng, kèm phụ phí, local charge và thời hạn hiệu lực."
        actions={
          <>
            <button className="btn"><Upload size={15} /> Nhập giá từ Excel</button>
            <button className="btn btn--primary"><Plus size={15} /> Thêm giá</button>
          </>
        }
      />
      <StatGrid items={rateStats} />

      <div className="toolbar">
        <Segmented<FreightMode>
          value={mode}
          onChange={setMode}
          options={(['FCL', 'LCL', 'AIR'] as FreightMode[]).map((m) => ({ value: m, label: modeLabel[m], count: count(m) }))}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Hãng, cảng đi, cảng đến..." />
        <button className="chip">Hiệu lực: Đang áp dụng</button>
        <span className="toolbar__right">Đơn vị: {rateUnit[mode]} · <b>đậm</b> = giá thấp nhất</span>
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Hãng</th>
                <th>Tuyến</th>
                {cols.map((c) => <th key={c} className="num">{c}</th>)}
                <th>Vận chuyển</th>
                <th>Hiệu lực đến</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`clickable ${r.id === current?.id ? 'selected' : ''}`} onClick={() => setSelected(r.id)}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.carrier}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div>{r.pol} → {r.pod}</div>
                    {r.via && <div className="subtle" style={{ fontSize: 11 }}>qua {r.via}</div>}
                  </td>
                  {r.prices.map((p, i) => (
                    <td key={i} className="num" style={{ fontWeight: p === lowest[i] ? 700 : 400, color: p === lowest[i] ? 'var(--green)' : undefined }}>
                      {formatNumber(p)}
                    </td>
                  ))}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div>{r.transit}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{r.frequency}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {r.expiring ? <span className="text-amber" style={{ fontWeight: 600 }}>{r.validTo}</span> : r.validTo}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={cols.length + 4} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có giá phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {current ? <RateDetail r={current} /> : <aside className="card md-empty">Chọn một dòng giá để xem chi tiết.</aside>}
      </div>
      <p className="subtle" style={{ fontSize: 11.5, marginTop: 10 }}>
        <OutlineBadge>FMS</OutlineBadge> Giá đã bao gồm cước cơ bản, chưa gồm phụ phí và phí địa phương.
      </p>
    </>
  );
}
