import { useState } from 'react';
import { ListChecks } from 'lucide-react';
import { Badge, ModuleTag, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { jobs } from '../data';
import type { TodoGroup } from '../types';
import '../jobs.css';

const groups: { key: TodoGroup; title: string; tone: Tone }[] = [
  { key: 'overdue', title: 'Quá hạn', tone: 'red' },
  { key: 'morning', title: 'Trước 12:00 hôm nay', tone: 'amber' },
  { key: 'afternoon', title: 'Chiều nay', tone: 'blue' },
  { key: 'tomorrow', title: 'Ngày mai trở đi', tone: 'gray' },
];

/** Gom việc của mọi job thành một danh sách, kèm thông tin job */
const initialTodos = jobs.flatMap((j) => j.todos.map((t) => ({ ...t, job: j.code, customer: j.customer })));

export default function TodayPage() {
  const [todos, setTodos] = useState(initialTodos);
  const toggle = (id: string) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const open = (g: TodoGroup) => todos.filter((t) => t.group === g && !t.done).length;
  const blocked = jobs.filter((j) => j.status === 'Có vấn đề');

  return (
    <>
      <PageHeader
        icon={<ListChecks size={18} />}
        section="Job / Lô hàng"
        title="Job cần xử lý hôm nay"
        description="Việc của mọi job bạn phụ trách, xếp theo hạn. Tick để đánh dấu xong, bấm mã job để mở chi tiết."
      />
      <StatGrid
        items={[
          { label: 'Quá hạn', value: String(open('overdue')), note: 'Cần xử lý ngay', valueTone: 'red', noteTone: 'red' },
          { label: 'Hạn trong hôm nay', value: String(open('morning') + open('afternoon')), note: `${open('morning')} việc trước 12:00`, noteTone: 'amber' },
          { label: 'Ngày mai trở đi', value: String(open('tomorrow')), note: 'Có thể chuẩn bị trước' },
          { label: 'Đã xong', value: String(todos.filter((t) => t.done).length), note: `Trên tổng ${todos.length} việc`, noteTone: 'green' },
        ]}
      />

      <div className="today-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map((g) => {
            const items = todos.filter((t) => t.group === g.key);
            if (items.length === 0) return null;
            return (
              <Card
                key={g.key}
                title={<span style={{ color: g.key === 'overdue' ? toneColor.red : undefined }}>{g.title}</span>}
                action={<Badge tone={g.tone}>{open(g.key)}</Badge>}
                bodyClassName=""
              >
                {items.map((t) => (
                  <label key={t.id} className={`job-todo ${t.done ? 'is-done' : ''}`}>
                    <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                    <ModuleTag module={t.module} />
                    <span className="job-todo__text">
                      {t.text}
                      <span className="job-todo__job">
                        <JobLink code={t.job} style={{ fontSize: 11 }} /> · {t.customer}
                      </span>
                    </span>
                    <span className="job-todo__due" style={{ color: g.key === 'overdue' && !t.done ? toneColor.red : undefined }}>{t.due}</span>
                  </label>
                ))}
              </Card>
            );
          })}
        </div>

        <Card title="Job đang có vấn đề" action={<Badge tone="red">{blocked.length}</Badge>} bodyClassName="">
          {blocked.map((j) => (
            <div key={j.code} className="blocked-job">
              <JobLink code={j.code} />
              <div style={{ fontWeight: 600 }}>{j.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}>{j.pol} → {j.pod}</div>
              {j.alert && <div style={{ fontSize: 12, color: toneColor[j.alert.tone], marginTop: 2 }}>{j.alert.text}</div>}
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
