import { useMemo, useState } from 'react';
import { LayoutList, Plus, Search } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import type { Customer, CustomerStatus } from '../types';
import { customerStats, customers } from './data';
import { formatMillions } from '../../../utils/format';

type Filter = 'all' | CustomerStatus;

const statusTone: Record<CustomerStatus, Tone> = {
  'Đang giao dịch': 'green',
  'Tiềm năng': 'blue',
  'Tạm ngừng': 'gray',
};

function debtColor(c: Customer) {
  if (!c.limit) return 'var(--border-strong)';
  const ratio = c.debt / c.limit;
  if (ratio >= 0.9) return 'var(--red)';
  if (ratio >= 0.7) return 'var(--amber)';
  return 'var(--navy)';
}

function DebtCell({ c }: { c: Customer }) {
  const ratio = c.limit ? Math.min(c.debt / c.limit, 1) : 0;
  const color = debtColor(c);
  const highlight = c.limit && c.debt / c.limit >= 0.7;
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 12.5 }}>
        <b style={{ color: highlight ? color : undefined }}>{formatMillions(c.debt)}</b>
        <span className="muted"> / {c.limit ? formatMillions(c.limit) : '—'}</span>
      </div>
      <div className="progress" style={{ marginTop: 4 }}>
        <div className="progress__bar" style={{ width: `${ratio * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function CustomerDetail({ c }: { c: Customer }) {
  return (
    <aside className="card">
      <div className="detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono subtle" style={{ fontSize: 11 }}>{c.code}</span>
          <Badge tone={statusTone[c.status]}>{c.status}</Badge>
        </div>
        <h2 style={{ fontSize: 16, margin: '6px 0 2px' }}>{c.name}</h2>
        <div className="muted" style={{ fontSize: 12 }}>{c.industry} · Sales phụ trách: {c.sales}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button className="btn btn--primary btn--sm">Tạo RFQ</button>
          <button className="btn btn--sm">Ghi hoạt động</button>
          <button className="btn btn--sm">Sửa hồ sơ</button>
        </div>
      </div>

      <div className="detail__section kv-grid">
        <div><div className="kv__k">Mã số thuế</div><div className="kv__v">{c.taxCode}</div></div>
        <div><div className="kv__k">Điều khoản thanh toán</div><div className="kv__v">{c.paymentTerm}</div></div>
        <div style={{ gridColumn: '1 / -1' }}><div className="kv__k">Địa chỉ</div><div className="kv__v">{c.address}</div></div>
        <div><div className="kv__k">Hợp đồng</div><a href="#" className="kv__v">{c.contract}</a></div>
        <div><div className="kv__k">Tuyến chính</div><div className="kv__v">{c.routes}</div></div>
      </div>

      <div className="detail__section">
        <div className="section-title">Công nợ <small>đồng bộ từ Finance</small></div>
        <div className="debt-boxes">
          <div><span>Hạn mức</span><b>{c.limit ? formatMillions(c.limit) : '—'}</b></div>
          <div><span>Dư nợ</span><b style={{ color: debtColor(c) === 'var(--red)' ? 'var(--red)' : undefined }}>{formatMillions(c.debt)}</b></div>
          <div><span>Quá hạn</span><b style={{ color: c.overdue ? 'var(--red)' : undefined }}>{c.overdue ? formatMillions(c.overdue) : '0'}</b></div>
        </div>
      </div>

      <div className="detail__section">
        <div className="section-title">Đầu mối liên hệ</div>
        {c.contacts.map((p) => (
          <div key={p.name} className="contact">
            <Avatar initials={p.initials} size={28} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div className="subtle" style={{ fontSize: 11.5 }}>{p.title}</div>
            </div>
            <span className="mono" style={{ fontSize: 11 }}>{p.phone}</span>
          </div>
        ))}
      </div>

      <div className="detail__section">
        <div className="section-title">Lịch sử giao dịch gần đây <a href="#" className="link-small">Tất cả job</a></div>
        {c.history.length === 0 && <p className="subtle">Chưa có giao dịch.</p>}
        {c.history.map((h) => (
          <div key={h.job} className="history">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <JobLink code={h.job} style={{ fontSize: 11 }} />
              <span>{h.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">{h.desc}</span>
              <b>{h.amount}</b>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function CustomerListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(customers[0].code);

  const count = (s: CustomerStatus) => customers.filter((c) => c.status === s).length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        (filter === 'all' || c.status === filter) &&
        (!q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.taxCode.includes(q)),
    );
  }, [filter, query]);

  const current = customers.find((c) => c.code === selected) ?? customers[0];

  return (
    <>
      <PageHeader
        icon={<LayoutList size={18} />}
        section="Khách hàng"
        title="Danh sách khách hàng"
        description="Hồ sơ công ty, đầu mối liên hệ, người phụ trách và tình hình giao dịch của từng khách."
        actions={
          <>
            <button className="btn">Nhập từ Excel</button>
            <button className="btn">Xuất danh sách</button>
            <button className="btn btn--primary"><Plus size={15} /> Thêm khách hàng</button>
          </>
        }
      />
      <StatGrid items={customerStats} />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tất cả', count: customers.length },
            { value: 'Đang giao dịch', label: 'Đang giao dịch', count: count('Đang giao dịch') },
            { value: 'Tiềm năng', label: 'Tiềm năng', count: count('Tiềm năng') },
            { value: 'Tạm ngừng', label: 'Tạm ngừng', count: count('Tạm ngừng') },
          ]}
        />
        <label className="search-box">
          <Search size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tên, mã khách, mã số thuế..." />
        </label>
        <button className="chip">Sales: Tất cả</button>
        <button className="chip">Ngành hàng: Tất cả</button>
        <span className="toolbar__right">{rows.length} / 301 khách hàng</span>
      </div>

      <div className="split">
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Phân loại</th>
                  <th>Sales</th>
                  <th>Dư nợ / hạn mức</th>
                  <th style={{ textAlign: 'right' }}>Job 90 ngày</th>
                  <th>Liên hệ gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr
                    key={c.code}
                    className={`clickable ${c.code === current.code ? 'selected' : ''}`}
                    onClick={() => setSelected(c.code)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </div>
                      <div className="mono subtle" style={{ fontSize: 10.5 }}>{c.code} · MST {c.taxCode}</div>
                    </td>
                    <td><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                    <td>{c.sales}</td>
                    <td><DebtCell c={c} /></td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{c.jobs90}</td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{c.lastContact}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không tìm thấy khách hàng phù hợp.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <span className="muted">Trang 1 / 38</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn--sm">Trước</button>
              <button className="btn btn--sm">Sau</button>
            </div>
          </div>
        </div>

        <CustomerDetail c={current} />
      </div>
    </>
  );
}
