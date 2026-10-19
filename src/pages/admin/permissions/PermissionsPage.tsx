import { useMemo, useState } from 'react';
import { Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { ModuleTag } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { initialPerms, permActions, permAreas, roles, users } from '../data';
import type { DataScope, PermAction } from '../types';
import '../admin.css';

const scopes: DataScope[] = ['Của mình', 'Chi nhánh', 'Toàn công ty'];

export default function PermissionsPage() {
  const [role, setRole] = useState('cs');
  const [perms, setPerms] = useState(() => new Set(initialPerms));
  const [saved, setSaved] = useState(() => new Set(initialPerms));
  const [scopeOf, setScopeOf] = useState(() => Object.fromEntries(roles.map((r) => [r.key, r.scope])) as Record<string, DataScope>);
  const [notice, setNotice] = useState('');

  const current = roles.find((r) => r.key === role)!;
  const has = (area: string, a: PermAction) => perms.has(`${role}|${area}|${a}`);
  const toggle = (area: string, a: PermAction) => {
    setNotice('');
    setPerms((p) => {
      const n = new Set(p);
      const k = `${role}|${area}|${a}`;
      if (n.has(k)) {
        n.delete(k);
        // bỏ quyền xem thì bỏ luôn các quyền khác của khu vực đó
        if (a === 'view') permActions.forEach((x) => n.delete(`${role}|${area}|${x.key}`));
      } else {
        n.add(k);
        n.add(`${role}|${area}|view`);
      }
      return n;
    });
  };

  const diff = useMemo(() => {
    const added = [...perms].filter((k) => !saved.has(k));
    const removed = [...saved].filter((k) => !perms.has(k));
    return { added, removed };
  }, [perms, saved]);
  const changes = diff.added.length + diff.removed.length;
  const affected = users.filter((u) => u.roles.includes(role) && u.status !== 'Bị khóa');
  const approveAreas = permAreas.filter((a) => has(a.key, 'approve'));

  return (
    <>
      <PageHeader
        icon={<ShieldCheck size={18} />}
        section="Quản trị"
        title="Phân quyền"
        description="Quyền xem, tạo sửa, duyệt và xuất dữ liệu của từng vai trò trên từng phân hệ, cùng phạm vi dữ liệu được thấy. Thay đổi có hiệu lực ở lần tải trang tiếp theo của người dùng."
      />
      {notice && <div style={{ marginBottom: 12 }}><Alert tone="green">{notice}</Alert></div>}

      <div className="perm-layout">
        <Card title="Vai trò" bodyClassName="">
          {roles.map((r) => {
            const n = users.filter((u) => u.roles.includes(r.key)).length;
            const dirty = [...diff.added, ...diff.removed].some((k) => k.startsWith(`${r.key}|`));
            return (
              <button key={r.key} className={`role-item ${r.key === role ? 'is-active' : ''}`} onClick={() => setRole(r.key)}>
                <div className="md-item__row">
                  <b>{r.name}</b>
                  <span className="subtle" style={{ fontSize: 11.5 }}>{n} người{dirty ? ' · đã sửa' : ''}</span>
                </div>
                <div className="subtle" style={{ fontSize: 11.5 }}>{r.desc}</div>
              </button>
            );
          })}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Card
            title={`Quyền của vai trò ${current.name}`}
            subtitle={`Áp dụng cho ${affected.length} người: ${affected.map((u) => u.name).join(', ') || 'chưa có ai'}`}
            action={
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--sm" disabled={!changes} onClick={() => setPerms(new Set(saved))}><RotateCcw size={14} /> Hoàn tác</button>
                <button
                  className="btn btn--primary btn--sm"
                  disabled={!changes}
                  onClick={() => { setSaved(new Set(perms)); setNotice(`Đã lưu ${changes} thay đổi quyền. Ghi vào Nhật ký hệ thống.`); }}
                >
                  <Check size={14} /> Lưu {changes ? `${changes} thay đổi` : ''}
                </button>
              </div>
            }
            bodyClassName="table-wrap"
          >
            {current.system && <div style={{ padding: '0 16px 12px' }}><Alert tone="blue">Vai trò hệ thống: không xem được chi tiết giao dịch, chỉ cấu hình.</Alert></div>}
            <table className="table perm-table">
              <thead>
                <tr><th>Khu vực</th>{permActions.map((a) => <th key={a.key} className="perm-col">{a.label}</th>)}</tr>
              </thead>
              <tbody>
                {permAreas.map((area) => (
                  <tr key={area.key}>
                    <td>
                      <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                        {area.module && <ModuleTag module={area.module} plain />}
                        {area.label}
                      </span>
                    </td>
                    {permActions.map((a) => {
                      const on = has(area.key, a.key);
                      const k = `${role}|${area.key}|${a.key}`;
                      const changed = saved.has(k) !== on;
                      return (
                        <td key={a.key} className="perm-col">
                          <button
                            className={`perm-cell ${on ? 'is-on' : ''} ${changed ? 'is-changed' : ''}`}
                            onClick={() => toggle(area.key, a.key)}
                            aria-pressed={on}
                            aria-label={`${a.label} ${area.label}`}
                            title={changed ? 'Đã thay đổi, chưa lưu' : undefined}
                          >
                            {on && <Check size={13} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="report-grid" style={{ marginBottom: 0 }}>
            <Card title="Phạm vi dữ liệu" subtitle="Bản ghi vai trò này được thấy">
              <div className="scope-list">
                {scopes.map((s) => (
                  <label key={s} className={`scope-opt ${scopeOf[role] === s ? 'is-active' : ''}`}>
                    <input type="radio" name="scope" checked={scopeOf[role] === s} onChange={() => setScopeOf((m) => ({ ...m, [role]: s }))} />
                    <div>
                      <b>{s}</b>
                      <div className="subtle" style={{ fontSize: 11.5 }}>
                        {s === 'Của mình' ? 'Chỉ khách hàng, job do mình phụ trách' : s === 'Chi nhánh' ? 'Mọi bản ghi của chi nhánh được gán' : 'Mọi bản ghi trong công ty'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
            <Card title="Quyền duyệt của vai trò" subtitle="Dùng trong Quy trình duyệt">
              {approveAreas.length ? (
                <ul className="checks">
                  {approveAreas.map((a) => <li key={a.key}><Check size={14} color="var(--green)" /> {a.label}</li>)}
                </ul>
              ) : <div className="subtle" style={{ fontSize: 12.5 }}>Vai trò này không có quyền duyệt.</div>}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
