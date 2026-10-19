import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CircleDashed, Upload } from 'lucide-react';
import { Badge, ModuleTag, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Timeline } from '../../../components/ui/Timeline';
import { formatNumber } from '../../../utils/format';
import { docIssues, docStatusTone, formatMoney, jobFinance, modeLabel } from '../shared';
import type { ChargeLine, Job } from '../types';

function Empty({ text }: { text: string }) {
  return <div className="card job-empty">{text}</div>;
}

// ---------- Tổng quan ----------
export function OverviewTab({ job }: { job: Job }) {
  const [todos, setTodos] = useState(job.todos);
  const f = jobFinance(job);
  const approved = job.documents.filter((d) => d.status === 'Đã duyệt').length;
  const issues = job.documents.filter((d) => d.status === 'Thiếu' || d.status === 'Lệch');
  const isAir = job.mode === 'AIR';

  return (
    <div className="job-overview">
      <div className="job-col">
        <Card title="Thông tin lô hàng">
          <div className="kv-grid kv-grid--3">
            <Field label="Khách hàng">{job.customer}</Field>
            <Field label="Loại hình">{modeLabel[job.mode]} · {job.direction}</Field>
            <Field label="Điều kiện giao hàng">{job.incoterm}</Field>
            <Field label="Hàng hóa">{job.cargo}</Field>
            <Field label={job.mode === 'FCL' ? 'Container' : 'Số lượng'}>{job.equipment}</Field>
            <Field label="Tuyến">{job.pol} → {job.pod}{job.via ? ` (qua ${job.via})` : ''}</Field>
            <Field label={isAir ? 'Hãng bay' : 'Hãng vận chuyển'}>{job.carrier ?? '—'}</Field>
            <Field label={isAir ? 'Chuyến bay' : 'Tàu / chuyến'}>{job.vessel ?? '—'}</Field>
            <Field label="ETD → ETA">{job.etd} → {job.eta}</Field>
            <Field label="Booking">{job.booking ? <Link to="/booking">{job.booking}</Link> : '—'}</Field>
            <Field label="Báo giá">{job.quotation ? <Link to="/bao-gia">{job.quotation}</Link> : '—'}</Field>
            <Field label="Vận đơn">{job.bl ? <Link to="/van-don">{job.bl}</Link> : '—'}</Field>
            <Field label="CS / Ops">{job.cs}</Field>
            <Field label="Sales">{job.sales}</Field>
            <Field label="Ngày mở job">{job.openedAt}</Field>
          </div>
        </Card>

        <Card title="Việc cần làm của job" action={<Badge tone="blue">{todos.filter((t) => !t.done).length}</Badge>} bodyClassName="">
          {todos.length === 0 && <p className="subtle" style={{ padding: '0 16px 16px' }}>Không còn việc nào.</p>}
          {todos.map((t) => (
            <label key={t.id} className={`job-todo ${t.done ? 'is-done' : ''}`}>
              <input type="checkbox" checked={t.done} onChange={() => setTodos((l) => l.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} />
              <ModuleTag module={t.module} />
              <span className="job-todo__text">{t.text}</span>
              <span className="job-todo__due" style={{ color: t.group === 'overdue' && !t.done ? 'var(--red)' : undefined }}>{t.due}</span>
            </label>
          ))}
        </Card>
      </div>

      <div className="job-col">
        <Card title="Mốc chính">
          <Timeline items={job.milestones} />
        </Card>
        <Card title="Tài chính" subtitle="Doanh thu và chi phí theo job">
          <div className="debt-boxes">
            <div><span>Doanh thu</span><b>{formatMoney(f.revenue, job.finance.currency)}</b></div>
            <div><span>Chi phí</span><b>{formatMoney(f.cost, job.finance.currency)}</b></div>
            <div><span>Lãi gộp</span><b className={f.margin < 8 ? 'text-red' : 'text-green'}>{formatNumber(f.margin, 1)}%</b></div>
          </div>
        </Card>
        <Card title="Chứng từ" subtitle={`${approved}/${job.documents.length} đã duyệt`}>
          {issues.length === 0 ? (
            <p className="text-green" style={{ fontSize: 12.5 }}>Đủ bộ, không có chứng từ lệch.</p>
          ) : (
            <ul className="job-issues">
              {issues.map((d) => (
                <li key={d.name}>
                  <Badge tone={docStatusTone[d.status]}>{d.status}</Badge>
                  <div>
                    <div>{d.type}</div>
                    {d.note && <div className="subtle" style={{ fontSize: 11.5 }}>{d.note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

// ---------- Vận tải ----------
export function TransportTab({ job }: { job: Job }) {
  if (job.transport.length === 0) return <Empty text="Job này chưa có lệnh vận chuyển nội địa." />;
  return (
    <Card title="Lệnh vận chuyển" subtitle="Từ TMS · cập nhật từ Driver App" action={<Link to="/lenh-van-chuyen" className="link-small">Mở trong Vận tải</Link>} bodyClassName="table-wrap">
      <table className="table">
        <thead>
          <tr><th>Lệnh</th><th>Công việc</th><th>Tuyến</th><th>Xe / tài xế</th><th>Thời gian</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {job.transport.map((t, i) => (
            <tr key={i}>
              <td className="mono" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{t.order}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{t.kind}</td>
              <td>
                <div>{t.from}</div>
                <div className="subtle" style={{ fontSize: 11.5 }}>→ {t.to}</div>
              </td>
              <td>
                <div className="mono" style={{ fontSize: 12 }}>{t.vehicle}</div>
                <div className="subtle" style={{ fontSize: 11.5 }}>{t.driver}</div>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{t.time}</td>
              <td><Badge tone={t.tone}>{t.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ---------- Kho ----------
export function WarehouseTab({ job }: { job: Job }) {
  const w = job.warehouse;
  if (!w) return <Empty text="Job này không dùng dịch vụ kho." />;
  return (
    <div className="job-overview">
      <Card title="Lệnh kho" action={<Badge tone={w.statusTone}>{w.status}</Badge>}>
        <div className="kv-grid">
          <Field label="Số lệnh">{w.order}</Field>
          <Field label="Loại">{w.kind}</Field>
          <Field label="Kho">{w.warehouse}</Field>
          <Field label="Lịch hẹn">{w.appointment}</Field>
        </div>
        <Link to="/nhap-kho" className="btn btn--primary btn--sm" style={{ marginTop: 12, textDecoration: 'none' }}>Mở lệnh nhập trong Kho</Link>
      </Card>
      <Card title="Hàng dự kiến" bodyClassName="table-wrap">
        <table className="table">
          <thead><tr><th>Mã hàng</th><th>Mô tả</th><th className="num">Số lượng</th><th>Vị trí</th></tr></thead>
          <tbody>
            {w.items.map((it) => (
              <tr key={it.sku}>
                <td className="mono" style={{ fontSize: 12 }}>{it.sku}</td>
                <td>{it.desc}</td>
                <td className="num">{it.qty}</td>
                <td className="muted">{it.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------- Hải quan ----------
const channelTone = { 'Xanh': 'green', 'Vàng': 'amber', 'Đỏ': 'red' } as const;

export function CustomsTab({ job }: { job: Job }) {
  const c = job.customs;
  if (!c) return <Empty text="Job này không có khai báo hải quan." />;
  const done = c.checklist.filter((x) => x.done).length;
  return (
    <div className="job-overview">
      <Card title="Tờ khai" action={<Badge tone={c.statusTone}>{c.status}</Badge>}>
        <div className="kv-grid">
          <Field label="Số tờ khai"><span className="mono">{c.declaration}</span></Field>
          <Field label="Loại hình">{c.type}</Field>
          <Field label="Chi cục" full>{c.office}</Field>
          <Field label="Phân luồng">{c.channel ? <Badge tone={channelTone[c.channel]}>Luồng {c.channel.toLowerCase()}</Badge> : 'Chưa phân luồng'}</Field>
          <Field label="Thuế và phí">{c.duty}</Field>
        </div>
      </Card>
      <Card title="Bộ hồ sơ khai" subtitle={`${done}/${c.checklist.length} đã đủ`}>
        <ul className="checks">
          {c.checklist.map((x) => (
            <li key={x.label}>
              {x.done ? <CheckCircle2 size={15} color="var(--green)" /> : <CircleDashed size={15} color="var(--amber)" />}
              <span style={{ color: x.done ? undefined : 'var(--amber)' }}>{x.label}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ---------- Tài chính ----------
function ChargeTable({ title, lines, currency, showParty }: { title: string; lines: ChargeLine[]; currency: 'USD' | 'VND'; showParty: boolean }) {
  const total = lines.reduce((s, l) => s + l.amount, 0);
  return (
    <Card title={title} action={<b>{formatMoney(total, currency)}</b>} bodyClassName="table-wrap">
      <table className="table">
        <thead>
          <tr><th>Khoản</th>{showParty && <th>Nhà cung cấp</th>}<th className="num">Số tiền</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td>{l.item}</td>
              {showParty && <td className="muted">{l.party}</td>}
              <td className="num">{formatMoney(l.amount, currency)}</td>
              <td><Badge tone={l.tone}>{l.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function FinanceTab({ job }: { job: Job }) {
  const f = jobFinance(job);
  const cur = job.finance.currency;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="stats" style={{ marginBottom: 0, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat"><div className="stat__label">Doanh thu</div><div className="stat__value">{formatMoney(f.revenue, cur)}</div></div>
        <div className="card stat"><div className="stat__label">Chi phí</div><div className="stat__value">{formatMoney(f.cost, cur)}</div></div>
        <div className="card stat">
          <div className="stat__label">Lãi gộp</div>
          <div className="stat__value" style={{ color: f.margin < 8 ? toneColor.red : toneColor.green }}>
            {formatMoney(f.profit, cur)}
          </div>
          <div className="stat__note">{formatNumber(f.margin, 1)}% doanh thu</div>
        </div>
      </div>
      <div className="job-overview">
        <ChargeTable title="Doanh thu (AR)" lines={job.finance.revenue} currency={cur} showParty={false} />
        <ChargeTable title="Chi phí (AP)" lines={job.finance.costs} currency={cur} showParty />
      </div>
    </div>
  );
}

// ---------- Chứng từ ----------
export function DocumentsTab({ job }: { job: Job }) {
  return (
    <Card
      title="Chứng từ của job"
      subtitle={`Lưu ở DMS · ${docIssues(job)} chứng từ thiếu hoặc lệch`}
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/chung-tu?job=${job.code}`} className="btn btn--sm" style={{ textDecoration: 'none' }}>Mở trong DMS</Link>
          <Link to="/tai-len" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}><Upload size={14} /> Tải lên</Link>
        </div>
      }
      bodyClassName="table-wrap"
    >
      <table className="table">
        <thead>
          <tr><th>Loại</th><th>Tệp</th><th>Nguồn</th><th>Phiên bản</th><th>Cập nhật</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {job.documents.map((d) => (
            <tr key={d.name}>
              <td style={{ fontWeight: 600 }}>{d.type}</td>
              <td>
                {d.status === 'Thiếu' ? <span className="subtle">Chưa có</span> : <a href="#">{d.name}</a>}
                {d.note && <div style={{ fontSize: 11.5, color: d.status === 'Lệch' ? toneColor.red : 'var(--text-3)' }}>{d.note}</div>}
              </td>
              <td className="muted">{d.source}</td>
              <td className="mono" style={{ fontSize: 12 }}>{d.version ?? '—'}</td>
              <td className="muted">{d.updated ?? '—'}</td>
              <td><Badge tone={docStatusTone[d.status]}>{d.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ---------- Lịch sử ----------
export function HistoryTab({ job }: { job: Job }) {
  return (
    <Card title="Lịch sử thay đổi" subtitle="Nhật ký từ các module, app di động và hệ thống" bodyClassName="">
      <ul className="job-history">
        {job.history.map((h, i) => (
          <li key={i}>
            <span className="mono subtle">{h.time}</span>
            <div>
              <div>{h.text}</div>
              <div className="subtle" style={{ fontSize: 11.5 }}>{h.by}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
