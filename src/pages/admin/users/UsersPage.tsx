import { useState } from 'react';
import { KeyRound, Lock, Mail, ShieldCheck, Unlock, UserPlus, Users } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { StatGrid } from '../../../components/ui/StatCard';
import { fold } from '../../documents/shared';
import { externalAccounts, roles, users as initialUsers } from '../data';
import { initials, roleName, userStatusTone } from '../shared';
import type { User } from '../types';
import '../admin.css';

function UserDetail({ user, onChange, onNotice }: { user: User; onChange: (patch: Partial<User>) => void; onNotice: (t: string) => void }) {
  const toggleRole = (key: string) => {
    const next = user.roles.includes(key) ? user.roles.filter((r) => r !== key) : [...user.roles, key];
    if (!next.length) return;
    onChange({ roles: next });
  };
  return (
    <section className="card">
      <DetailHeader
        code={`${user.id} · ${user.email}`}
        badge={<Badge tone={userStatusTone[user.status]}>{user.status}</Badge>}
        title={user.name}
        subtitle={`${user.title} · ${user.branch}`}
        actions={
          <>
            {user.status === 'Hoạt động' && <button className="btn btn--sm" onClick={() => { onChange({ status: 'Bị khóa' }); onNotice(`Đã khóa tài khoản ${user.email}, mọi phiên đăng nhập bị đăng xuất.`); }}><Lock size={14} /> Khóa</button>}
            {user.status === 'Bị khóa' && <button className="btn btn--sm" onClick={() => { onChange({ status: 'Hoạt động' }); onNotice(`Đã mở khóa ${user.email}.`); }}><Unlock size={14} /> Mở khóa</button>}
            {user.status === 'Đã mời' && <button className="btn btn--primary btn--sm" onClick={() => onNotice(`Đã gửi lại lời mời đến ${user.email}.`)}><Mail size={14} /> Gửi lại lời mời</button>}
            {user.status !== 'Đã mời' && <button className="btn btn--sm" onClick={() => onNotice(`Đã gửi liên kết đặt lại mật khẩu đến ${user.email}.`)}><KeyRound size={14} /> Đặt lại mật khẩu</button>}
          </>
        }
      />
      {!user.mfa && user.status === 'Hoạt động' && (
        <div className="detail__section">
          <Alert tone="amber">Chưa bật xác thực 2 lớp. Chính sách công ty yêu cầu bật trước 31/10 với tài khoản có quyền duyệt hoặc xem tài chính.</Alert>
        </div>
      )}
      <div className="detail__section kv-grid">
        <Field label="Chi nhánh">{user.branch}</Field>
        <Field label="Đăng nhập gần nhất">{user.lastLogin}</Field>
        <Field label="Xác thực 2 lớp">{user.mfa ? <span style={{ color: 'var(--green)' }}><ShieldCheck size={13} style={{ verticalAlign: -2 }} /> Đã bật</span> : 'Chưa bật'}</Field>
        <Field label="Phạm vi dữ liệu">{roles.find((r) => r.key === user.roles[0])?.scope}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Vai trò <small>bấm để gán hoặc bỏ</small></div>
        <div className="role-chips">
          {roles.map((r) => (
            <button key={r.key} className={`pill ${user.roles.includes(r.key) ? 'active' : ''}`} onClick={() => toggleRole(r.key)} title={r.desc}>
              {r.name}
            </button>
          ))}
        </div>
        <div className="subtle" style={{ fontSize: 11.5, marginTop: 8 }}>Quyền của người dùng là hợp các quyền của mọi vai trò được gán. Xem chi tiết ở Phân quyền.</div>
      </div>
    </section>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [selected, setSelected] = useState('U-011');
  const [notice, setNotice] = useState('');
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState({ name: '', email: '', role: 'cs' });

  const q = fold(query.trim());
  const list = users.filter((u) => (!role || u.roles.includes(role)) && (!q || fold(`${u.name} ${u.email} ${u.title}`).includes(q)));
  const current = users.find((u) => u.id === selected) ?? list[0];
  const update = (id: string, patch: Partial<User>) => setUsers((l) => l.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  const active = users.filter((u) => u.status === 'Hoạt động');
  const noMfa = active.filter((u) => !u.mfa).length;

  const sendInvite = () => {
    const id = `U-${String(users.length + 1).padStart(3, '0')}`;
    setUsers((l) => [...l, { id, name: invite.name, email: invite.email, title: roleName(invite.role), branch: 'TP.HCM', roles: [invite.role], status: 'Đã mời', lastLogin: 'Chưa đăng nhập', mfa: false }]);
    setSelected(id);
    setInviting(false);
    setNotice(`Đã gửi lời mời đến ${invite.email}. Liên kết có hiệu lực 7 ngày.`);
    setInvite({ name: '', email: '', role: 'cs' });
  };
  const validInvite = invite.name.trim() && /^[^@\s]+@logiai\.vn$/.test(invite.email.trim());

  return (
    <>
      <PageHeader
        icon={<Users size={18} />}
        section="Quản trị"
        title="Người dùng và vai trò"
        description="Tài khoản nhân viên, vai trò được gán, chi nhánh và trạng thái bảo mật. Tài xế và khách hàng dùng tài khoản riêng trên Driver App và Portal."
        actions={<button className="btn btn--primary" onClick={() => setInviting((v) => !v)}><UserPlus size={14} /> Mời người dùng</button>}
      />
      <StatGrid
        items={[
          { label: 'Nhân viên đang hoạt động', value: String(active.length), note: `${users.filter((u) => u.status === 'Đã mời').length} lời mời chưa nhận · ${users.filter((u) => u.status === 'Bị khóa').length} bị khóa` },
          { label: 'Chưa bật xác thực 2 lớp', value: String(noMfa), note: 'Hạn bắt buộc 31/10', valueTone: noMfa ? 'amber' : undefined, noteTone: noMfa ? 'amber' : undefined },
          { label: externalAccounts[0].label, value: String(externalAccounts[0].value), note: externalAccounts[0].note, module: 'TMS' },
          { label: externalAccounts[1].label, value: String(externalAccounts[1].value), note: externalAccounts[1].note },
        ]}
      />
      {notice && <div style={{ marginBottom: 12 }}><Alert tone="green">{notice}</Alert></div>}
      {inviting && (
        <Card title="Mời người dùng mới" style={{ marginBottom: 16 }}>
          <div className="invite-form">
            <div><label className="field-label" htmlFor="iv-name">Họ tên</label><input id="iv-name" className="input" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} /></div>
            <div><label className="field-label" htmlFor="iv-email">Email công ty</label><input id="iv-email" className="input" placeholder="ten@logiai.vn" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} /></div>
            <div>
              <label className="field-label" htmlFor="iv-role">Vai trò</label>
              <select id="iv-role" className="select" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
                {roles.filter((r) => !r.system).map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}
              </select>
            </div>
            <button className="btn btn--primary" disabled={!validInvite} onClick={sendInvite}>Gửi lời mời</button>
          </div>
          {invite.email && !validInvite && <div className="subtle" style={{ fontSize: 11.5, marginTop: 6 }}>Chỉ mời được email đuôi @logiai.vn.</div>}
        </Card>
      )}

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Tên, email, chức danh" />
        <select className="select" style={{ width: 220, height: 32, padding: '0 8px' }} value={role} onChange={(e) => setRole(e.target.value)} aria-label="Lọc theo vai trò">
          <option value="">Tất cả vai trò</option>
          {roles.map((r) => <option key={r.key} value={r.key}>{r.name} ({users.filter((u) => u.roles.includes(r.key)).length})</option>)}
        </select>
      </div>

      <div className="split" style={{ gridTemplateColumns: 'minmax(0, 1fr) 380px' }}>
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Người dùng</th><th>Vai trò</th><th>Chi nhánh</th><th>Đăng nhập gần nhất</th><th>2 lớp</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className={`clickable ${u.id === current?.id ? 'selected' : ''}`} onClick={() => setSelected(u.id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={initials(u.name)} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div className="subtle" style={{ fontSize: 11.5 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><div className="role-chips">{u.roles.map((r) => <OutlineBadge key={r}>{roleName(r)}</OutlineBadge>)}</div></td>
                  <td className="muted">{u.branch}</td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>{u.lastLogin}</td>
                  <td>{u.mfa ? <ShieldCheck size={15} color="var(--green)" aria-label="Đã bật" /> : <span className="subtle">Chưa</span>}</td>
                  <td><Badge tone={userStatusTone[u.status]}>{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {current && <UserDetail key={current.id} user={current} onChange={(p) => update(current.id, p)} onNotice={setNotice} />}
      </div>
    </>
  );
}
