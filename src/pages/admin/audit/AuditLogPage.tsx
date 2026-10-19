import { useState } from 'react';
import { Download, History, X } from 'lucide-react';
import { Badge, ModuleTag } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { fold } from '../../documents/shared';
import { auditEvents } from '../data';
import type { AuditEvent, AuditKind } from '../types';
import '../admin.css';

type KindFilter = 'all' | AuditKind;
const kinds: AuditKind[] = ['Sửa dữ liệu', 'Duyệt', 'Tích hợp', 'Đăng nhập', 'Bảo mật', 'Phân quyền'];
const kindTone: Record<AuditKind, Tone> = { 'Sửa dữ liệu': 'blue', 'Duyệt': 'green', 'Tích hợp': 'gray', 'Đăng nhập': 'gray', 'Bảo mật': 'red', 'Phân quyền': 'amber' };
/** Sự kiện bảo mật bình thường (vd. sao lưu thành công) không tô đỏ */
const toneOf = (e: AuditEvent): Tone => (e.kind === 'Bảo mật' && e.tone !== 'red' ? 'gray' : kindTone[e.kind]);
const userList = [...new Set(auditEvents.map((e) => e.user))].sort();

function ModuleCell({ m }: { m?: AuditEvent['module'] }) {
  if (!m) return <span className="subtle">—</span>;
  if (m === 'ADM') return <span className="mod mod--text" style={{ color: 'var(--text-2)' }}>ADM</span>;
  return <ModuleTag module={m} plain />;
}

export default function AuditLogPage() {
  const [kind, setKind] = useState<KindFilter>('all');
  const [user, setUser] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>('A-9821');

  const q = fold(query.trim());
  const base = auditEvents.filter((e) => (!user || e.user === user) && (!q || fold(`${e.action} ${e.target} ${e.user} ${e.ip}`).includes(q)));
  const rows = kind === 'all' ? base : base.filter((e) => e.kind === kind);
  const current = auditEvents.find((e) => e.id === selected);
  const security = auditEvents.filter((e) => e.kind === 'Bảo mật' && e.tone === 'red').length;

  return (
    <>
      <PageHeader
        icon={<History size={18} />}
        section="Quản trị"
        title="Nhật ký hệ thống"
        description="Ai làm gì, lúc nào, trên dữ liệu nào: đăng nhập, sửa dữ liệu, duyệt, phân quyền và các lần đồng bộ tích hợp. Lưu 2 năm, không sửa hoặc xóa được."
        actions={<button className="btn"><Download size={14} /> Xuất CSV</button>}
      />
      <StatGrid
        items={[
          { label: 'Sự kiện từ 00:00', value: String(auditEvents.length), note: `${new Set(auditEvents.filter((e) => e.user !== 'Hệ thống').map((e) => e.user)).size} người dùng, còn lại do hệ thống` },
          { label: 'Sửa dữ liệu, duyệt', value: String(auditEvents.filter((e) => e.kind === 'Sửa dữ liệu' || e.kind === 'Duyệt').length), note: 'Có lưu giá trị trước và sau' },
          { label: 'Cảnh báo bảo mật', value: String(security), note: 'Đăng nhập sai 3 lần · thutrang@logiai.vn', valueTone: security ? 'red' : undefined, noteTone: security ? 'red' : undefined },
          { label: 'Sao lưu gần nhất', value: '02:00', note: 'Hôm nay · 4,2 GB · thành công', noteTone: 'green' },
        ]}
      />
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Hành động, đối tượng, IP" />
        <select className="select" style={{ width: 200, height: 32, padding: '0 8px' }} value={user} onChange={(e) => setUser(e.target.value)} aria-label="Người thực hiện">
          <option value="">Mọi người thực hiện</option>
          {userList.map((u) => <option key={u}>{u}</option>)}
        </select>
        <div className="toolbar__right">
          <Segmented<KindFilter>
            value={kind}
            onChange={setKind}
            options={[{ value: 'all', label: 'Tất cả', count: base.length }, ...kinds.map((k) => ({ value: k, label: k, count: base.filter((e) => e.kind === k).length }))]}
          />
        </div>
      </div>

      <div className={current ? 'split' : undefined} style={current ? { gridTemplateColumns: 'minmax(0, 1fr) 340px' } : undefined}>
        <Card bodyClassName="table-wrap">
          <table className="table table--compact audit-table">
            <thead>
              <tr><th>Lúc</th><th>Người thực hiện</th><th>Loại</th><th>Hành động</th><th>Đối tượng</th><th>Phân hệ</th><th>Nguồn / IP</th></tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className={`clickable ${e.id === selected ? 'selected' : ''}`} onClick={() => setSelected(e.id)}>
                  <td className="mono">{e.time}</td>
                  <td style={{ fontWeight: e.user === 'Hệ thống' ? 400 : 600, color: e.user === 'Hệ thống' ? 'var(--text-2)' : undefined }}>{e.user}</td>
                  <td><Badge tone={toneOf(e)}>{e.kind}</Badge></td>
                  <td style={{ color: e.tone === 'red' ? 'var(--red)' : undefined }}>{e.action}</td>
                  <td className="muted">{e.target}</td>
                  <td><ModuleCell m={e.module} /></td>
                  <td className="mono subtle" style={{ fontSize: 11.5 }}>{e.ip}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} className="md-empty">Không có sự kiện phù hợp.</td></tr>}
            </tbody>
          </table>
        </Card>

        {current && (
          <section className="card">
            <DetailHeader
              code={`${current.id} · 19/10/2026 ${current.time}`}
              badge={<Badge tone={toneOf(current)}>{current.kind}</Badge>}
              title={current.action}
              subtitle={current.target}
              actions={<button className="btn btn--sm" onClick={() => setSelected(null)} aria-label="Đóng"><X size={14} /></button>}
            />
            <div className="detail__section kv-grid">
              <Field label="Người thực hiện">{current.user}</Field>
              <Field label="Nguồn / IP"><span className="mono">{current.ip}</span></Field>
              <Field label="Phân hệ"><ModuleCell m={current.module} /></Field>
              <Field label="Mã sự kiện"><span className="mono">{current.id}</span></Field>
            </div>
            {current.changes && (
              <div className="detail__section">
                <div className="section-title">Thay đổi</div>
                {current.changes.map((c) => (
                  <div key={c.field} className="diff">
                    <div className="kv__k">{c.field}</div>
                    <div className="diff__before">{c.before}</div>
                    <div className="diff__after">{c.after}</div>
                  </div>
                ))}
              </div>
            )}
            {current.kind === 'Bảo mật' && current.tone === 'red' && (
              <div className="detail__section" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn--sm">Khóa tạm tài khoản</button>
                <button className="btn btn--sm">Chặn IP {current.ip}</button>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
