import { useState } from 'react';
import { Badge, ModuleTag, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { tasks } from '../data';
import type { Tone } from '../../../types';
import type { TaskItem } from '../types';

type Bucket = TaskItem['bucket'];

const tabs: { key: Bucket; label: string; count: number; tone: Tone }[] = [
  { key: 'today', label: 'Hôm nay', count: 12, tone: 'blue' },
  { key: 'overdue', label: 'Quá hạn', count: 3, tone: 'red' },
  { key: 'week', label: 'Tuần này', count: 27, tone: 'gray' },
];

export function TaskTable() {
  const [bucket, setBucket] = useState<Bucket>('today');
  // "Tuần này" bao gồm cả việc hôm nay
  const rows = tasks.filter((t) => (bucket === 'week' ? t.bucket !== 'overdue' : t.bucket === bucket));

  return (
    <Card title="Việc cần làm của tôi" action={<a href="#" className="link-small">Xem tất cả</a>} bodyClassName="">
      <div className="underline-tabs">
        {tabs.map((t) => (
          <button key={t.key} className={bucket === t.key ? 'active' : undefined} onClick={() => setBucket(t.key)}>
            {t.label} <Badge tone={t.tone}>{t.count}</Badge>
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Việc</th>
              <th>Khách hàng</th>
              <th>Hạn</th>
              <th style={{ textAlign: 'right' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.job + t.task}>
                <td><JobLink code={t.job} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', maxWidth: 220 }}>
                    <ModuleTag module={t.module} />
                    <span>{t.task}</span>
                  </div>
                </td>
                <td className="muted">{t.customer}</td>
                <td style={{ color: t.dueTone && toneColor[t.dueTone], fontWeight: t.dueTone ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {t.due}
                </td>
                <td style={{ textAlign: 'right' }}><Badge tone={t.statusTone}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
