import { useState } from 'react';
import { Eye, EyeOff, Plug, RefreshCw, Stethoscope } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { formatNumber } from '../../../utils/format';
import { integrations as initial } from '../data';
import { integrationTone } from '../shared';
import type { Integration } from '../types';
import '../admin.css';

function IntegrationDetail({ it, onChange }: { it: Integration; onChange: (i: Integration) => void }) {
  const [reveal, setReveal] = useState(false);
  const [result, setResult] = useState<{ tone: Tone; text: string } | null>(null);

  const addLog = (text: string, tone: Tone) => onChange({ ...it, log: [{ time: '08:15', text, tone }, ...it.log] });
  const test = () => {
    if (it.state === 'Lỗi') {
      setResult({ tone: 'red', text: 'Kết nối thất bại: host key không khớp. Cần cập nhật khóa máy chủ mới của hãng.' });
      addLog('Kiểm tra kết nối thất bại', 'red');
    } else if (it.state === 'Tắt') {
      setResult({ tone: 'amber', text: 'Tích hợp đang tắt. Hoàn tất cấu hình rồi bật để kiểm tra.' });
    } else {
      setResult({ tone: 'green', text: `Kết nối tốt, phản hồi trong ${it.method === 'EDI' ? 820 : 240} ms.` });
      addLog('Kiểm tra kết nối thành công', 'green');
    }
  };

  return (
    <section className="card">
      <DetailHeader
        code={<>{it.id} · {it.group}</>}
        badge={<Badge tone={integrationTone[it.state]}>{it.state}</Badge>}
        title={it.name}
        subtitle={it.purpose}
        actions={
          <>
            <button className="btn btn--sm" onClick={test}><Stethoscope size={14} /> Kiểm tra kết nối</button>
            {it.state !== 'Tắt' && <button className="btn btn--sm" onClick={() => { addLog('Đồng bộ lại thủ công bởi Lan Anh', 'blue'); setResult({ tone: 'blue', text: 'Đã đưa yêu cầu đồng bộ vào hàng đợi.' }); }}><RefreshCw size={14} /> Đồng bộ lại</button>}
            <button className="btn btn--sm" onClick={() => onChange({ ...it, state: it.state === 'Tắt' ? 'Đang chạy' : 'Tắt' })}>{it.state === 'Tắt' ? 'Bật' : 'Tắt'}</button>
          </>
        }
      />
      {(it.issue || result) && (
        <div className="detail__section" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {it.issue && <Alert tone={it.state === 'Lỗi' ? 'red' : 'amber'}>{it.issue}</Alert>}
          {result && <Alert tone={result.tone}>{result.text}</Alert>}
        </div>
      )}
      <div className="detail__section kv-grid kv-grid--3">
        <Field label="Phương thức">{it.method}</Field>
        <Field label="Đồng bộ gần nhất">{it.lastSync}</Field>
        <Field label="Lượt gọi hôm nay">{formatNumber(it.callsToday)} · lỗi {formatNumber(it.errorRate, 1)}%</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">
          Cấu hình
          {it.config.some((c) => c.secret) && (
            <button className="link-small" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={() => setReveal((v) => !v)}>
              {reveal ? <><EyeOff size={12} /> Ẩn khóa</> : <><Eye size={12} /> Hiện một phần khóa</>}
            </button>
          )}
        </div>
        <div className="kv-grid">
          {it.config.map((c) => (
            <Field key={c.label} label={c.label}>
              <span className="mono">{c.secret && !reveal ? '••••••••••••' : c.value}</span>
            </Field>
          ))}
        </div>
      </div>
      <div className="detail__section">
        <div className="section-title">Nhật ký đồng bộ <small>hôm nay</small></div>
        {it.log.length ? (
          <ul className="int-log">
            {it.log.map((l, i) => (
              <li key={i}>
                <span className="int-log__dot" style={{ background: toneColor[l.tone] }} />
                <span className="mono subtle">{l.time}</span>
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        ) : <div className="subtle" style={{ fontSize: 12.5 }}>Chưa có hoạt động.</div>}
      </div>
    </section>
  );
}

export default function IntegrationsPage() {
  const [list, setList] = useState(initial);
  const [selected, setSelected] = useState('INT-EDI');
  const current = list.find((i) => i.id === selected)!;
  const groups = [...new Set(list.map((i) => i.group))];
  const count = (s: Integration['state']) => list.filter((i) => i.state === s).length;

  return (
    <>
      <PageHeader
        icon={<Plug size={18} />}
        section="Quản trị"
        title="Cấu hình tích hợp"
        description="Kết nối với hải quan điện tử, hóa đơn điện tử, ngân hàng, hãng tàu, Driver App và hộp thư chứng từ. Theo dõi trạng thái, kiểm tra kết nối và đồng bộ lại khi lỗi."
      />
      <StatGrid
        items={[
          { label: 'Đang chạy', value: String(count('Đang chạy')), note: `Trên ${list.length} tích hợp`, noteTone: 'green' },
          { label: 'Lỗi', value: String(count('Lỗi')), note: count('Lỗi') ? list.filter((i) => i.state === 'Lỗi').map((i) => i.name).join(', ') : 'Không có', valueTone: count('Lỗi') ? 'red' : undefined, noteTone: count('Lỗi') ? 'red' : undefined },
          { label: 'Cảnh báo', value: String(count('Cảnh báo')), note: 'Sắp hết hạn token, chứng chỉ', valueTone: count('Cảnh báo') ? 'amber' : undefined },
          { label: 'Lượt gọi hôm nay', value: formatNumber(list.reduce((s, i) => s + i.callsToday, 0)), note: 'Phần lớn từ GPS Driver App' },
        ]}
      />
      <div className="split" style={{ gridTemplateColumns: 'minmax(0, 1fr) 420px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {groups.map((g) => (
            <div key={g}>
              <div className="section-title" style={{ marginBottom: 6 }}>{g}</div>
              <div className="int-grid">
                {list.filter((i) => i.group === g).map((i) => (
                  <button key={i.id} className={`card int-card ${i.id === current.id ? 'is-active' : ''}`} onClick={() => setSelected(i.id)}>
                    <div className="md-item__row">
                      <OutlineBadge>{i.method}</OutlineBadge>
                      <Badge tone={integrationTone[i.state]}>{i.state}</Badge>
                    </div>
                    <div style={{ fontWeight: 600, marginTop: 8 }}>{i.name}</div>
                    <div className="subtle" style={{ fontSize: 11.5, marginTop: 2 }}>Đồng bộ {i.lastSync} · {formatNumber(i.callsToday)} lượt</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <IntegrationDetail key={current.id} it={current} onChange={(i) => setList((l) => l.map((x) => (x.id === i.id ? i : x)))} />
      </div>
    </>
  );
}
