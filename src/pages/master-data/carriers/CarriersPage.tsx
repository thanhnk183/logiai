import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Ship } from 'lucide-react';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { fold } from '../../documents/shared';
import { jobs } from '../../jobs/data';
import { rates } from '../../quotation-booking/rates/data';
import { carriers } from '../data';
import { RecordPanel, StatusBadge, useRecords } from '../shared';
import type { Carrier, CarrierKind } from '../types';
import '../master-data.css';

type Kind = 'all' | CarrierKind;
const connTone: Record<Carrier['connection'], Tone> = { API: 'green', EDI: 'blue', Portal: 'gray', Email: 'amber' };

const rateCount = (c: Carrier) => rates.filter((r) => r.carrier === c.name).length;
const jobCount = (c: Carrier) => jobs.filter((j) => j.carrier === c.name).length;
/** Ngưỡng tin cậy lịch: tàu 60%, máy bay 85% */
const lowReliability = (c: Carrier) => c.reliability < (c.kind === 'Hãng bay' ? 85 : 60);

export default function CarriersPage() {
  const [rows, update] = useRecords(carriers);
  const [kind, setKind] = useState<Kind>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('EVG');

  const q = fold(query.trim());
  const list = rows.filter((c) => (kind === 'all' || c.kind === kind) && (!q || fold(`${c.code} ${c.name} ${c.scac} ${c.prefix ?? ''}`).includes(q)));
  const current = rows.find((c) => c.code === selected) ?? list[0];
  const count = (k: CarrierKind) => rows.filter((c) => c.kind === k).length;
  const auto = rows.filter((c) => c.connection === 'API' || c.connection === 'EDI').length;

  return (
    <>
      <PageHeader
        icon={<Ship size={18} />}
        section="Danh mục"
        title="Hãng tàu, hãng bay"
        description="Mã SCAC, mã IATA và tiền tố AWB dùng khi tạo booking, B/L, AWB; cách kết nối để nhận lịch tàu, xác nhận booking và tracking."
        actions={<button className="btn btn--primary"><Plus size={14} /> Thêm hãng</button>}
      />
      <StatGrid
        items={[
          { label: 'Hãng tàu', value: String(count('Hãng tàu')), note: `${rows.filter((c) => c.kind === 'Hãng tàu' && lowReliability(c)).length} hãng đúng lịch dưới 60%` },
          { label: 'Hãng bay', value: String(count('Hãng bay')), note: 'Có tiền tố AWB' },
          { label: 'Co-loader LCL', value: String(count('Co-loader')), note: 'Gom hàng lẻ' },
          { label: 'Kết nối tự động', value: `${auto}/${rows.length}`, note: 'API hoặc EDI · còn lại nhập tay từ email, portal', noteTone: 'blue' },
        ]}
      />
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Tên, SCAC, mã IATA" />
        <Segmented<Kind>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'Tất cả', count: rows.length },
            { value: 'Hãng tàu', label: 'Hãng tàu', count: count('Hãng tàu') },
            { value: 'Hãng bay', label: 'Hãng bay', count: count('Hãng bay') },
            { value: 'Co-loader', label: 'Co-loader', count: count('Co-loader') },
          ]}
        />
      </div>

      <div className="split split--wide">
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Hãng</th><th>SCAC / IATA</th><th>Kết nối</th><th className="num">Đúng lịch 90 ngày</th><th className="num">Bảng giá</th><th className="num">Job</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.code} className={`clickable ${c.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(c.code)}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="subtle" style={{ fontSize: 11.5 }}>{c.kind}</div>
                  </td>
                  <td className="mono">{c.scac}{c.prefix && <span className="subtle"> · {c.prefix}</span>}</td>
                  <td><Badge tone={connTone[c.connection]}>{c.connection}</Badge></td>
                  <td className="num" style={{ fontWeight: 600, color: lowReliability(c) ? 'var(--red)' : undefined }}>{c.reliability}%</td>
                  <td className="num">{rateCount(c) || <span className="subtle">0</span>}</td>
                  <td className="num">{jobCount(c) || <span className="subtle">0</span>}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {current && (
          <RecordPanel
            key={current.code}
            code={`${current.code} · ${current.kind}`}
            title={current.name}
            subtitle={`${rateCount(current)} bảng giá · ${jobCount(current)} job đang theo dõi`}
            record={current}
            onSave={(patch) => update(current.code, patch as Partial<Carrier>)}
            onStatus={(status) => update(current.code, { status })}
            issues={current.connection === 'Email' && current.status === 'Đang dùng' ? ['Chưa kết nối tự động: xác nhận booking và lịch tàu phải nhập tay từ email.'] : []}
            fields={[
              { key: 'name', label: 'Tên hãng', value: current.name },
              { key: 'scac', label: current.kind === 'Hãng bay' ? 'Mã IATA' : 'Mã SCAC', value: current.scac, mono: true },
              ...(current.kind === 'Hãng bay' ? [{ key: 'prefix', label: 'Tiền tố AWB', value: current.prefix ?? '', mono: true }] : []),
              { key: 'connection', label: 'Kết nối', value: current.connection, readOnly: true },
              { key: 'bookingContact', label: 'Liên hệ booking', value: current.bookingContact, full: true },
            ]}
          >
            <div className="detail__section">
              <div className="section-title">Độ tin cậy lịch 90 ngày</div>
              <div className="progress" style={{ height: 8 }}>
                <div className="progress__bar" style={{ width: `${current.reliability}%`, background: lowReliability(current) ? 'var(--red)' : 'var(--brand)' }} />
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                {current.reliability}% chuyến chạy đúng lịch công bố (sai lệch dưới 1 ngày){lowReliability(current) ? ' · thấp, nên báo khách lịch dự phòng' : ''}.
              </div>
              {rateCount(current) > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {rates.filter((r) => r.carrier === current.name).map((r) => <OutlineBadge key={r.id}>{r.pol} → {r.pod}</OutlineBadge>)}
                  <Link to="/bang-gia-cuoc" className="link-small">Mở bảng giá</Link>
                </div>
              )}
            </div>
          </RecordPanel>
        )}
      </div>
    </>
  );
}
