import { useState } from 'react';
import { Badge, ModuleTag, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { approvals as initialApprovals, notices } from '../data';

export function ApprovalList() {
  const [items, setItems] = useState(initialApprovals);
  const remove = (title: string) => setItems((list) => list.filter((a) => a.title !== title));

  return (
    <Card title="Cần duyệt" action={<Badge tone="blue">{items.length}</Badge>} bodyClassName="">
      {items.length === 0 && <p className="subtle" style={{ padding: '8px 16px 16px' }}>Không còn mục nào chờ duyệt.</p>}
      {items.map((a) => (
        <div key={a.title} className="approval">
          <div className="approval__top">
            <div>
              <div style={{ fontSize: 11 }}>
                <ModuleTag module={a.module} plain /> <span className="muted">· {a.kind}</span>
              </div>
              <div className="approval__title">{a.title}</div>
              <div className="subtle" style={{ fontSize: 11.5 }}>{a.meta}</div>
            </div>
            <div className="approval__amount">{a.amount}</div>
          </div>
          <div className="approval__actions">
            <button className="btn btn--primary btn--sm" onClick={() => remove(a.title)}>Duyệt</button>
            <button className="btn btn--sm" onClick={() => remove(a.title)}>Từ chối</button>
            <a href="#" className="link-small" style={{ marginLeft: 'auto' }}>Chi tiết</a>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function NoticeList() {
  return (
    <Card title="Thông báo và nhắc hạn" action={<a href="#" className="link-small">Tất cả</a>} bodyClassName="">
      {notices.map((n, i) => (
        <div key={i} className="notice">
          <span className="notice__time mono">{n.time}</span>
          <div>
            <div className="notice__cat" style={{ color: toneColor[n.tone] }}>
              <i style={{ background: toneColor[n.tone] }} /> {n.category}
            </div>
            <div>{n.text}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}
