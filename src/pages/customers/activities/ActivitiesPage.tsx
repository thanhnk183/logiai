import { useState, type FormEvent } from 'react';
import { AlertTriangle, CalendarDays, FileText, Mail, MessageSquare, Phone, type LucideIcon } from 'lucide-react';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import {
  activities as initialActivities,
  activityTypes,
  appointments,
  complaints,
  contactsByCustomer,
  reminders as initialReminders,
} from './data';
import type { Activity, ActivityType } from '../types';
import './activities.css';

const typeStyle: Record<ActivityType, { icon: LucideIcon; color: string; bg: string }> = {
  'Cuộc gọi': { icon: Phone, color: 'var(--brand)', bg: 'var(--blue-bg)' },
  Email: { icon: Mail, color: 'var(--text-2)', bg: 'var(--gray-bg)' },
  'Gặp mặt': { icon: CalendarDays, color: 'var(--green)', bg: 'var(--green-bg)' },
  'Ghi chú': { icon: FileText, color: 'var(--amber)', bg: 'var(--amber-bg)' },
  'Khiếu nại': { icon: AlertTriangle, color: 'var(--red)', bg: 'var(--red-bg)' },
};

const placeholders: Record<ActivityType, string> = {
  'Cuộc gọi': 'Tóm tắt cuộc gọi: nội dung trao đổi, khách cần gì, bước tiếp theo...',
  Email: 'Tóm tắt email đã gửi/nhận...',
  'Gặp mặt': 'Biên bản gặp mặt: người tham dự, nội dung chính, cam kết...',
  'Ghi chú': 'Ghi chú nội bộ về khách hàng...',
  'Khiếu nại': 'Mô tả khiếu nại: job liên quan, vấn đề, yêu cầu của khách...',
};

function ActivityForm({ onSave }: { onSave: (a: Activity) => void }) {
  const customers = Object.keys(contactsByCustomer);
  const [type, setType] = useState<ActivityType>('Cuộc gọi');
  const [customer, setCustomer] = useState(customers[0]);
  const [contact, setContact] = useState(contactsByCustomer[customers[0]][0]);
  const [reminder, setReminder] = useState('Thứ Năm 22/10, 10:00');
  const [content, setContent] = useState('');

  const changeCustomer = (c: string) => {
    setCustomer(c);
    setContact(contactsByCustomer[c][0]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({
      id: Date.now(),
      type,
      customer,
      contact: contact.split(' · ')[0],
      time: 'Vừa xong',
      owner: 'Lan Anh',
      content: content.trim(),
      reminder: reminder.trim() || undefined,
    });
    setContent('');
  };

  return (
    <Card
      title="Ghi hoạt động"
      action={
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {activityTypes.map((t) => (
            <button key={t} type="button" className={`pill ${t === type ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      }
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            <span className="field-label">Khách hàng</span>
            <select className="select" value={customer} onChange={(e) => changeCustomer(e.target.value)}>
              {customers.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span className="field-label">Người liên hệ</span>
            <select className="select" value={contact} onChange={(e) => setContact(e.target.value)}>
              {contactsByCustomer[customer].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span className="field-label">Nhắc việc tiếp theo</span>
            <input className="input" value={reminder} onChange={(e) => setReminder(e.target.value)} />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 10 }}>
          <span className="field-label">Nội dung</span>
          <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder={placeholders[type]} />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span className="muted" style={{ fontSize: 11.5, flex: 1 }}>Email gửi từ hộp thư công ty được tự gắn vào hồ sơ khách.</span>
          <button type="button" className="btn">Đính kèm</button>
          <button type="submit" className="btn btn--primary" disabled={!content.trim()}>Lưu hoạt động</button>
        </div>
      </form>
    </Card>
  );
}

function ActivityLog({ items }: { items: Activity[] }) {
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const rows = items.filter((a) => filter === 'all' || a.type === filter);

  return (
    <Card
      title="Nhật ký hoạt động"
      action={
        <Segmented<'all' | ActivityType>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả' }, ...activityTypes.map((t) => ({ value: t, label: t }))]}
        />
      }
      bodyClassName=""
    >
      {rows.length === 0 && <p className="subtle" style={{ padding: '8px 16px 16px' }}>Chưa có hoạt động nào.</p>}
      {rows.map((a) => {
        const { icon: Icon, color, bg } = typeStyle[a.type];
        return (
          <div key={a.id} className="log-row">
            <span className="log-row__icon" style={{ color, background: bg }}><Icon size={15} /></span>
            <div style={{ flex: 1 }}>
              <div className="log-row__head">
                <span>
                  <b>{a.type}</b> · <a href="#" style={{ fontWeight: 600 }}>{a.customer}</a> <span className="muted">với {a.contact}</span>
                </span>
                <span className="muted" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{a.time} · {a.owner}</span>
              </div>
              <div>{a.content}</div>
              {a.reminder && <div className="log-row__reminder">Nhắc việc: {a.reminder}</div>}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function SideColumn() {
  const [reminders, setReminders] = useState(initialReminders);
  const toggle = (id: number) => setReminders((list) => list.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  return (
    <div className="side-col">
      <Card title="Lịch hẹn tuần này" action={<a href="#" className="link-small">Mở lịch</a>} bodyClassName="">
        {appointments.map((ap) => (
          <div key={ap.day} className="appt">
            <div className="appt__date">
              <span>{ap.weekday}</span>
              <b>{ap.day}</b>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{ap.title}</div>
              <div className="muted">{ap.customer}</div>
              <div className="subtle" style={{ fontSize: 11.5 }}>{ap.detail}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Khiếu nại đang mở" action={<Badge tone="red">{complaints.length}</Badge>} bodyClassName="">
        {complaints.map((k) => (
          <div key={k.code} className="complaint">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: 10.5 }}>{k.code}</span>
              <span style={{ color: toneColor[k.slaTone], fontWeight: 600, fontSize: 11.5 }}>{k.sla}</span>
            </div>
            <div style={{ fontWeight: 600 }}>{k.title}</div>
            <div className="muted" style={{ fontSize: 11.5 }}>{k.ref}</div>
          </div>
        ))}
      </Card>

      <Card title="Nhắc việc của tôi" bodyClassName="">
        {reminders.map((r) => (
          <label key={r.id} className={`reminder ${r.done ? 'is-done' : ''}`}>
            <input type="checkbox" checked={r.done} onChange={() => toggle(r.id)} />
            <div>
              <div className="reminder__text">{r.text}</div>
              <div style={{ fontSize: 11.5, color: r.urgent && !r.done ? 'var(--red)' : 'var(--text-3)' }}>{r.due}</div>
            </div>
          </label>
        ))}
      </Card>
    </div>
  );
}

export default function ActivitiesPage() {
  const [items, setItems] = useState(initialActivities);

  return (
    <>
      <PageHeader
        icon={<MessageSquare size={18} />}
        section="Khách hàng"
        title="Hoạt động chăm sóc"
        description="Nhật ký trao đổi, lịch hẹn, nhắc việc và khiếu nại, gắn vào hồ sơ từng khách."
      />
      <div className="activities-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ActivityForm onSave={(a) => setItems((list) => [a, ...list])} />
          <ActivityLog items={items} />
        </div>
        <SideColumn />
      </div>
    </>
  );
}
