import { useMemo, useState } from 'react';
import { Handshake, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { contractors, vehicles } from '../data';
import { contractorStatusTone } from '../shared';
import type { Contractor } from '../types';
import '../transport.css';

const ON_TIME_TARGET = 90;

function onTimeColor(v: number) {
  if (v >= 95) return 'var(--green)';
  if (v >= ON_TIME_TARGET) return 'var(--amber)';
  return 'var(--red)';
}

function ContractorDetail({ c }: { c: Contractor }) {
  const [recon, setRecon] = useState(c.reconciliation);
  const assigned = vehicles.filter((v) => v.owner === c.name);
  const expiring = c.docs.filter((d) => d.tone !== 'green');

  return (
    <aside className="card">
      <DetailHeader
        code={c.code}
        badge={<Badge tone={contractorStatusTone[c.status]}>{c.status}</Badge>}
        title={c.name}
        subtitle={`${c.services} · ${c.region}`}
        actions={
          c.status === 'Đang thẩm định' ? (
            <button className="btn btn--primary btn--sm">Duyệt hồ sơ nhà thầu</button>
          ) : (
            <>
              <button className="btn btn--sm">Giao lệnh</button>
              <button className="btn btn--sm">Đánh giá</button>
            </>
          )
        }
      />
      {c.note && <div className="detail__section"><Alert tone="amber">{c.note}</Alert></div>}

      {c.status !== 'Đang thẩm định' && (
        <div className="detail__section">
          <div className="debt-boxes">
            <div><span>Chuyến T10</span><b>{c.tripsMonth}</b></div>
            <div><span>Đúng giờ</span><b style={{ color: onTimeColor(c.onTime) }}>{c.onTime}%</b></div>
            <div><span>Chi phí T10</span><b>{formatNumber(c.costMonth, 1)} tr</b></div>
          </div>
        </div>
      )}

      <div className="detail__section kv-grid">
        <Field label="Số xe">{c.fleet}</Field>
        <Field label="Đầu mối">{c.contact}</Field>
        <Field label="Hợp đồng" full>{c.contract}</Field>
      </div>

      <div className="detail__section">
        <div className="section-title">Hồ sơ và hạn hiệu lực {expiring.length > 0 && <small className="text-amber">{expiring.length} cần chú ý</small>}</div>
        {c.docs.map((d) => (
          <div key={d.name} className="cutoff-row">
            <span>{d.name}</span>
            <b style={{ color: toneColor[d.tone] }}>{d.expiry}</b>
          </div>
        ))}
      </div>

      {recon && (
        <div className="detail__section">
          <div className="section-title">Đối soát gần nhất</div>
          <div className="recon">
            <div>
              <div style={{ fontWeight: 600 }}>{recon.period} · {recon.trips} chuyến</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{recon.amount}</div>
            </div>
            <Badge tone={recon.tone}>{recon.status}</Badge>
          </div>
          {recon.status === 'Chờ duyệt' && (
            <button className="btn btn--primary btn--block" style={{ marginTop: 10 }} onClick={() => setRecon({ ...recon, status: 'Đã duyệt, chờ thanh toán', tone: 'blue' })}>
              Duyệt đối soát, chuyển Kế toán
            </button>
          )}
        </div>
      )}

      {assigned.length > 0 && (
        <div className="detail__section">
          <div className="section-title">Xe đang làm cho LogiAI</div>
          {assigned.map((v) => (
            <div key={v.plate} className="cutoff-row">
              <span><span className="mono">{v.plate}</span> · {v.driver}</span>
              <span className="muted">{v.status}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

export default function ContractorsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(contractors[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contractors.filter((c) => !q || [c.name, c.code, c.region, c.services].some((s) => s.toLowerCase().includes(q)));
  }, [query]);
  const current = rows.find((c) => c.code === selected) ?? rows[0];

  return (
    <>
      <PageHeader
        icon={<Handshake size={18} />}
        section="Vận tải"
        title="Nhà thầu vận tải"
        description="Nhà xe thuê ngoài: năng lực, tỷ lệ đúng giờ, hồ sơ pháp lý và hạn hiệu lực, đối soát chi phí hằng tháng."
        actions={<button className="btn btn--primary"><Plus size={15} /> Thêm nhà thầu</button>}
      />
      <StatGrid
        items={[
          { label: 'Nhà thầu đang hợp tác', value: String(contractors.filter((c) => c.status === 'Đang hợp tác').length), note: '1 đang thẩm định' },
          { label: 'Chuyến thuê ngoài · T10', value: String(contractors.reduce((s, c) => s + c.tripsMonth, 0)), note: '42% tổng số chuyến' },
          { label: 'Chi phí thuê ngoài · T10', value: `${formatNumber(contractors.reduce((s, c) => s + c.costMonth, 0), 1)} tr ₫`, note: '1 bảng đối soát chờ duyệt', noteTone: 'amber' },
          { label: 'Hồ sơ sắp hết hạn', value: '2', note: 'Đăng kiểm 15C-118.20 hết hạn 25/10', valueTone: 'red', noteTone: 'red' },
        ]}
      />

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Tên, mã nhà thầu, khu vực..." />
        <span className="toolbar__right">Mục tiêu đúng giờ ≥ {ON_TIME_TARGET}%</span>
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nhà thầu</th><th>Khu vực</th><th className="num">Số xe</th><th className="num">Chuyến T10</th><th>Đúng giờ</th><th className="num">Chi phí T10</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.code} className={`clickable ${c.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(c.code)}>
                  <td>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{c.services}</div>
                  </td>
                  <td className="muted">{c.region}</td>
                  <td className="num">{c.fleet}</td>
                  <td className="num">{c.tripsMonth || '—'}</td>
                  <td style={{ minWidth: 120 }}>
                    {c.tripsMonth ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress" style={{ width: 54 }}>
                          <div className="progress__bar" style={{ width: `${c.onTime}%`, background: onTimeColor(c.onTime) }} />
                        </div>
                        <b style={{ fontSize: 12, color: onTimeColor(c.onTime) }}>{c.onTime}%</b>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="num">{c.costMonth ? `${formatNumber(c.costMonth, 1)} tr` : '—'}</td>
                  <td><Badge tone={contractorStatusTone[c.status]}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {current ? <ContractorDetail key={current.code} c={current} /> : <aside className="card md-empty">Chọn một nhà thầu.</aside>}
      </div>
    </>
  );
}
