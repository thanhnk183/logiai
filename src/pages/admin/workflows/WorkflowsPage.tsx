import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, GitBranch, Zap } from 'lucide-react';
import { Badge, ModuleTag } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { users, workflows as initialWorkflows } from '../data';
import type { Workflow } from '../types';
import '../admin.css';

/** Người đang giữ vai trò duyệt (lấy từ danh sách người dùng) */
const holder: Record<string, string> = {
  'Trưởng phòng kinh doanh': users.find((u) => u.roles.includes('sales-head'))!.name,
  'Giám đốc': users.find((u) => u.roles.includes('director'))!.name,
  'Kế toán trưởng': users.find((u) => u.roles.includes('chief-accountant'))!.name,
  'Trưởng kho': 'Quang Minh',
  'CS phụ trách job': 'Lan Anh và nhóm CS',
};

function WorkflowDetail({ wf, onChange }: { wf: Workflow; onChange: (w: Workflow) => void }) {
  const setSla = (i: number, v: number) => onChange({ ...wf, steps: wf.steps.map((s, k) => (k === i ? { ...s, slaHours: v } : s)) });
  const total = wf.steps.reduce((s, x) => s + x.slaHours, 0);
  return (
    <section className="card">
      <DetailHeader
        code={<>{wf.id} · {wf.area}</>}
        badge={<Badge tone={wf.enabled ? 'green' : 'gray'}>{wf.enabled ? 'Đang bật' : 'Đang tắt'}</Badge>}
        title={wf.name}
        subtitle={`Kích hoạt khi: ${wf.trigger}`}
        actions={
          <>
            <label className="switch">
              <input type="checkbox" checked={wf.enabled} onChange={(e) => onChange({ ...wf, enabled: e.target.checked })} />
              <span className="switch__track" />
              {wf.enabled ? 'Tắt quy trình' : 'Bật quy trình'}
            </label>
            {wf.pending > 0 && wf.pendingLink && <Link to={wf.pendingLink} className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>Xem {wf.pending} yêu cầu đang chờ</Link>}
          </>
        }
      />
      <div className="detail__section">
        <div className="section-title">Các bước duyệt <small>SLA tổng tối đa {total} giờ</small></div>
        <div className="flow">
          <div className="flow__node flow__node--start"><Zap size={14} /> {wf.trigger}</div>
          {wf.steps.map((s, i) => (
            <Fragment key={s.approver}>
              <ArrowRight size={16} className="flow__arrow" />
              <div className="flow__node">
                <div className="subtle" style={{ fontSize: 11 }}>Bước {i + 1}{s.when ? ' · có điều kiện' : ''}</div>
                <b>{s.approver}</b>
                <div className="muted" style={{ fontSize: 11.5 }}>{holder[s.approver] ?? '—'}</div>
                {s.when && <div className="flow__when">Khi: {s.when}</div>}
                <label className="flow__sla">
                  SLA
                  <input type="number" min={1} max={72} value={s.slaHours} onChange={(e) => setSla(i, Math.max(1, Number(e.target.value) || 1))} aria-label={`SLA bước ${i + 1}`} />
                  giờ
                </label>
              </div>
            </Fragment>
          ))}
          <ArrowRight size={16} className="flow__arrow" />
          <div className="flow__node flow__node--end"><CircleCheck size={14} /> Hoàn tất</div>
        </div>
      </div>
      <div className="detail__section kv-grid kv-grid--3">
        <Field label="Đang chờ duyệt">{wf.pending ? <b>{wf.pending} yêu cầu</b> : 'Không có'}</Field>
        <Field label="Thời gian duyệt bình quân · 30 ngày">{wf.avgHours ? `${formatNumber(wf.avgHours, 1)} giờ` : '—'}</Field>
        <Field label="Quá hạn SLA thì">{wf.escalation}</Field>
      </div>
      <div className="detail__section subtle" style={{ fontSize: 11.5 }}>
        Người duyệt nhận thông báo trên web, email và ứng dụng di động. Từ chối phải ghi lý do, người gửi được báo ngay.
      </div>
    </section>
  );
}

export default function WorkflowsPage() {
  const [list, setList] = useState(initialWorkflows);
  const [selected, setSelected] = useState('WF-01');
  const current = list.find((w) => w.id === selected)!;
  const pending = list.reduce((s, w) => s + (w.enabled ? w.pending : 0), 0);
  const busiest = [...list].sort((a, b) => b.pending - a.pending)[0];

  return (
    <>
      <PageHeader
        icon={<GitBranch size={18} />}
        section="Quản trị"
        title="Quy trình duyệt (Workflow)"
        description="Ai duyệt, theo điều kiện nào, trong bao lâu. Số yêu cầu đang chờ đếm trực tiếp từ báo giá, công nợ phải trả, danh mục, kiểm kê và chứng từ."
        actions={<button className="btn btn--primary">Tạo quy trình</button>}
      />
      <StatGrid
        items={[
          { label: 'Quy trình đang bật', value: `${list.filter((w) => w.enabled).length}/${list.length}`, note: 'Áp dụng cho mọi chi nhánh' },
          { label: 'Yêu cầu đang chờ duyệt', value: String(pending), note: `Nhiều nhất: ${busiest.name.toLowerCase()} (${busiest.pending})`, valueTone: 'amber' },
          { label: 'Duyệt bình quân · 30 ngày', value: `${formatNumber(list.filter((w) => w.avgHours).reduce((s, w) => s + w.avgHours, 0) / list.filter((w) => w.avgHours).length, 1)} giờ`, note: 'Từ lúc gửi đến lúc có kết quả' },
          { label: 'Quá hạn SLA trong tháng', value: '7', note: '5 thanh toán NCC, 2 biểu phí', noteTone: 'red' },
        ]}
      />
      <div className="master-detail">
        <div className="card md-list">
          {list.map((w) => (
            <button key={w.id} className={`md-item ${w.id === current.id ? 'is-active' : ''}`} onClick={() => setSelected(w.id)}>
              <div className="md-item__row">
                <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  {w.module && <ModuleTag module={w.module} />}
                  <span className="subtle" style={{ fontSize: 11 }}>{w.steps.length} bước</span>
                </span>
                {!w.enabled ? <Badge tone="gray">Tắt</Badge> : w.pending ? <Badge tone="amber">{w.pending} chờ</Badge> : <Badge tone="green">Không chờ</Badge>}
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{w.name}</div>
              <div className="subtle" style={{ fontSize: 11.5 }}>{w.steps.map((s) => s.approver).join(' → ')}</div>
            </button>
          ))}
        </div>
        <WorkflowDetail key={current.id} wf={current} onChange={(w) => setList((l) => l.map((x) => (x.id === w.id ? w : x)))} />
      </div>
    </>
  );
}
