import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FileWarning } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { docAlerts } from '../data';
import { urgencyLabel, urgencyTone } from '../shared';
import type { AlertKind, DocAlert, Urgency } from '../types';
import '../documents.css';

type KindFilter = 'all' | AlertKind;
const order: Urgency[] = ['overdue', 'today', 'soon', 'later'];

/** Thao tác dẫn sang màn khác thay vì chỉ ghi nhận đã nhắc */
const actionLink: Record<string, string> = {
  'Duyệt VGM vừa nhận': '/duyet-ocr',
  'Duyệt file vừa nhận': '/duyet-ocr',
  'Mở tờ khai': '/to-khai',
  'Sửa B/L': '/van-don',
  'Sửa SI': '/shipping-instruction',
  'Tạo debit note': '/cong-no-phai-thu',
};

function countBy(rows: DocAlert[], key: (a: DocAlert) => string) {
  return Object.entries(rows.reduce<Record<string, number>>((acc, a) => ({ ...acc, [key(a)]: (acc[key(a)] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
}

export default function DocAlertsPage() {
  const [kind, setKind] = useState<KindFilter>('all');
  const [handled, setHandled] = useState<Record<string, string>>({});

  const rows = docAlerts.filter((a) => kind === 'all' || a.kind === kind);
  const missing = docAlerts.filter((a) => a.kind === 'Thiếu');
  const urgent = docAlerts.filter((a) => a.urgency === 'overdue' || a.urgency === 'today');
  const affectedJobs = new Set(docAlerts.map((a) => a.job)).size;

  const handle = (a: DocAlert) => setHandled((h) => ({ ...h, [a.id]: `${a.action === 'Nhắc khách' || a.action === 'Nhắc tài xế' ? 'Đã nhắc' : 'Đã gửi'} 08:15` }));

  return (
    <>
      <PageHeader
        icon={<FileWarning size={18} />}
        section="Chứng từ"
        title="Cảnh báo thiếu hoặc lệch"
        description="Chứng từ bắt buộc chưa có, hoặc có nhưng số liệu khác chứng từ khác cùng job. Sắp theo hạn của bước đang bị chặn."
        actions={<button className="btn">Gửi nhắc tất cả cho khách</button>}
      />
      <StatGrid
        items={[
          { label: 'Cảnh báo đang mở', value: String(docAlerts.length), note: `Trên ${affectedJobs} job`, module: 'DMS' },
          { label: 'Quá hạn hoặc hạn hôm nay', value: String(urgent.length), note: 'Đang chặn bước tiếp theo của lô hàng', valueTone: 'red', noteTone: 'red' },
          { label: 'Thiếu chứng từ', value: String(missing.length), note: `${missing.filter((a) => a.party === 'Khách hàng').length} cần khách hàng cung cấp`, valueTone: 'amber' },
          { label: 'Lệch số liệu', value: String(docAlerts.length - missing.length), note: 'Trọng lượng, số lượng, tên người nhận' },
        ]}
      />

      <div className="split">
        <Card
          title="Danh sách cảnh báo"
          action={
            <Segmented<KindFilter>
              value={kind}
              onChange={setKind}
              options={[
                { value: 'all', label: 'Tất cả', count: docAlerts.length },
                { value: 'Thiếu', label: 'Thiếu', count: missing.length },
                { value: 'Lệch', label: 'Lệch', count: docAlerts.length - missing.length },
              ]}
            />
          }
          bodyClassName="table-wrap"
        >
          <table className="table">
            <thead>
              <tr><th>Chứng từ</th><th>Job</th><th>Đang chặn</th><th>Hạn</th><th>Bên xử lý</th><th /></tr>
            </thead>
            <tbody>
              {order.map((u) => {
                const group = rows.filter((a) => a.urgency === u);
                if (!group.length) return null;
                return (
                  <Fragment key={u}>
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div className="alert-group"><Badge tone={urgencyTone[u]}>{urgencyLabel[u]}</Badge> {group.length} chứng từ</div>
                      </td>
                    </tr>
                    {group.map((a) => (
                      <tr key={a.id}>
                        <td style={{ maxWidth: 280 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <Badge tone={a.kind === 'Lệch' ? 'red' : 'amber'}>{a.kind}</Badge>
                            <span style={{ fontWeight: 600 }}>{a.type}</span>
                          </div>
                          <div style={{ fontSize: 11.5, marginTop: 2, color: a.kind === 'Lệch' ? 'var(--red)' : 'var(--text-2)' }}>{a.detail}</div>
                        </td>
                        <td>
                          <JobLink code={a.job} />
                          <div className="subtle" style={{ fontSize: 11.5 }}>{a.customer}</div>
                        </td>
                        <td>{a.blocks}</td>
                        <td style={{ whiteSpace: 'nowrap', fontWeight: 600, color: u === 'overdue' ? 'var(--red)' : u === 'today' ? 'var(--amber)' : undefined }}>{a.deadline}</td>
                        <td className="muted">{a.party}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {handled[a.id] ? (
                            <span className="matched" style={{ color: 'var(--green)', fontSize: 12 }}><Check size={13} /> {handled[a.id]}</span>
                          ) : actionLink[a.action] ? (
                            <Link to={actionLink[a.action]} className="btn btn--sm">{a.action}</Link>
                          ) : (
                            <button className="btn btn--sm" onClick={() => handle(a)}>{a.action}</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Theo bên cần xử lý">
            {countBy(docAlerts, (a) => a.party).map(([p, n]) => (
              <div key={p} className="party-row"><span>{p}</span><b>{n}</b></div>
            ))}
          </Card>
          <Card title="Theo loại chứng từ">
            {countBy(docAlerts, (a) => a.type).map(([t, n]) => (
              <div key={t} className="party-row"><span>{t}</span><b>{n}</b></div>
            ))}
          </Card>
          <Card title="Quy tắc kiểm tra">
            <ul className="checks muted" style={{ fontSize: 12 }}>
              <li>Hàng xuất đường biển cần Invoice, Packing List, VGM, tờ khai trước cut-off hạ bãi.</li>
              <li>Trọng lượng Packing List, SI, VGM được so với nhau, lệch quá 0,5% thì cảnh báo.</li>
              <li>Chuyến nội địa chỉ xuất hóa đơn khi có POD có chữ ký.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
