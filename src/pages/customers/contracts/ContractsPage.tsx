import { useMemo, useState } from 'react';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import type { Contract, ContractStatus } from '../types';
import { contractStats, contracts } from './data';

type Filter = 'all' | ContractStatus;

const statusTone: Record<ContractStatus, Tone> = {
  'Hiệu lực': 'green',
  'Sắp hết hạn': 'amber',
  'Hết hạn': 'gray',
  'Nháp chờ duyệt': 'blue',
};

function slaColor(v: number) {
  if (v >= 95) return 'var(--green)';
  if (v >= 90) return 'var(--amber)';
  return 'var(--red)';
}

function SlaCell({ value }: { value: number | null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
      <div className="progress" style={{ width: 44, height: 4 }}>
        {value !== null && <div className="progress__bar" style={{ width: `${value}%`, background: slaColor(value) }} />}
      </div>
      <b style={{ color: value !== null ? slaColor(value) : 'var(--text-3)', fontSize: 12 }}>{value !== null ? `${value}%` : '—'}</b>
    </div>
  );
}

function ContractDetail({ c }: { c: Contract }) {
  return (
    <aside className="card">
      <div className="detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono subtle" style={{ fontSize: 11 }}>{c.code}</span>
          <Badge tone={statusTone[c.status]}>{c.status}</Badge>
        </div>
        <h2 style={{ fontSize: 16, margin: '6px 0 2px' }}>{c.customer}</h2>
        <div className="muted" style={{ fontSize: 12 }}>{c.type} · {c.scope}</div>
      </div>

      <div className="detail__section">
        <div className="kv-grid">
          <div><div className="kv__k">Hiệu lực</div><div className="kv__v">{c.from} – {c.to}</div></div>
          <div><div className="kv__k">Nhắc gia hạn</div><div className="kv__v">{c.reminder}</div></div>
          <div><div className="kv__k">Điều khoản thanh toán</div><div className="kv__v">{c.paymentTerm}</div></div>
          <div><div className="kv__k">Hạn mức công nợ</div><div className="kv__v"><b>{c.creditLimit}</b></div></div>
        </div>
        <div className="sync-note">
          <RefreshCw size={12} /> Hạn mức và điều khoản đã đồng bộ sang Finance lúc 07:00
        </div>
      </div>

      {c.slaMetrics.length > 0 && (
        <div className="detail__section">
          <div className="section-title">Cam kết dịch vụ (SLA) <small>thực tế tháng 9 / mục tiêu</small></div>
          {c.slaMetrics.map((m) => (
            <div key={m.name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{m.name}</span>
                <span><b className="text-green">{m.actual}</b> <span className="muted">/ {m.target}</span></span>
              </div>
              <div className="sla-bar">
                <div className="sla-bar__fill" style={{ width: `${m.percent}%` }} />
                <span className="sla-bar__marker" style={{ left: `${m.marker}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="detail__section">
        <div className="section-title">Tài liệu (lưu ở DMS)</div>
        {c.documents.map((d) => (
          <div key={d.name} className="doc-row">
            <span className="doc-row__type">PDF</span>
            <a href="#">{d.name}</a>
            <span className="subtle" style={{ marginLeft: 'auto', fontSize: 11.5 }}>{d.version}</span>
          </div>
        ))}
        <button className="btn btn--primary btn--block" style={{ marginTop: 10 }}>Tạo phụ lục gia hạn</button>
      </div>
    </aside>
  );
}

export default function ContractsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState(contracts[0].code);

  const count = (s: ContractStatus) => contracts.filter((c) => c.status === s).length;
  const rows = useMemo(() => contracts.filter((c) => filter === 'all' || c.status === filter), [filter]);
  const current = contracts.find((c) => c.code === selected) ?? contracts[0];

  return (
    <>
      <PageHeader
        icon={<FileText size={18} />}
        section="Khách hàng"
        title="Hợp đồng và SLA"
        description="Điều khoản, ngày hiệu lực, cam kết dịch vụ và hạn mức công nợ. Hạn mức và điều khoản thanh toán tự gửi sang Finance."
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn">Mẫu hợp đồng</button>
        <button className="btn btn--primary"><Plus size={15} /> Tạo hợp đồng</button>
      </div>
      <StatGrid items={contractStats} />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: contracts.length },
            { value: 'Hiệu lực', label: 'Hiệu lực', count: count('Hiệu lực') },
            { value: 'Sắp hết hạn', label: 'Sắp hết hạn', count: count('Sắp hết hạn') },
            { value: 'Hết hạn', label: 'Hết hạn', count: count('Hết hạn') },
            { value: 'Nháp chờ duyệt', label: 'Nháp', count: count('Nháp chờ duyệt') },
          ]}
        />
        <button className="chip">Loại: Tất cả</button>
        <button className="chip">Hết hạn trong: 90 ngày</button>
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Số hợp đồng</th>
                <th>Khách hàng</th>
                <th>Loại</th>
                <th>Hiệu lực</th>
                <th>SLA tháng 9</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.code} className={`clickable ${c.code === current.code ? 'selected' : ''}`} onClick={() => setSelected(c.code)}>
                  <td className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{c.code}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.customer}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{c.scope}</div>
                  </td>
                  <td>{c.type}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div>{c.from} –</div>
                    <div>{c.to}</div>
                    <div style={{ fontWeight: 600, fontSize: 11.5, color: c.remainingTone ? toneColor[c.remainingTone] : 'var(--text-2)' }}>
                      {c.remaining}
                    </div>
                  </td>
                  <td><SlaCell value={c.sla} /></td>
                  <td><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContractDetail c={current} />
      </div>
    </>
  );
}
