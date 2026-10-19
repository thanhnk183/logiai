import { useState } from 'react';
import { FolderCheck, Upload } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { declarations } from '../data';
import { DocStateIcon, declarationTone, docProgress } from '../shared';
import type { Declaration, DocState } from '../types';
import '../customs.css';

const stateLabel: Record<DocState, string> = { ok: 'Đủ', missing: 'Thiếu', mismatch: 'Lệch' };

/** Hồ sơ chưa thông quan lên đầu, hồ sơ có vấn đề trước */
const ordered = [...declarations].sort((a, b) => {
  const done = (d: Declaration) => (d.status === 'Đã thông quan' ? 1 : 0);
  return done(a) - done(b) || docProgress(b).issues - docProgress(a).issues;
});

function DossierDetail({ d }: { d: Declaration }) {
  const p = docProgress(d);
  return (
    <section className="card">
      <DetailHeader
        code={<><JobLink code={d.job} /> · {d.typeCode} {d.direction}</>}
        badge={<Badge tone={declarationTone[d.status]}>{d.status}</Badge>}
        title={d.customer}
        subtitle={`${p.ok}/${p.total} chứng từ đủ · lưu ở DMS`}
        actions={
          <>
            {p.issues > 0 && <button className="btn btn--primary btn--sm">Yêu cầu khách bổ sung</button>}
            <button className="btn btn--sm"><Upload size={14} /> Tải chứng từ</button>
          </>
        }
      />
      {p.issues > 0 ? (
        <div className="detail__section"><Alert tone="amber">Còn {p.issues} điểm cần xử lý trước khi truyền tờ khai.</Alert></div>
      ) : (
        <div className="detail__section"><Alert tone="green">Hồ sơ đủ bộ và khớp số liệu giữa các chứng từ.</Alert></div>
      )}
      <div className="detail__section">
        <div className="section-title">Bộ chứng từ</div>
        <table className="table table--compact">
          <thead><tr><th>Chứng từ</th><th>Nguồn</th><th>Tình trạng</th></tr></thead>
          <tbody>
            {d.docs.map((doc) => (
              <tr key={doc.name}>
                <td>
                  <div style={{ fontWeight: 600 }}>{doc.name}</div>
                  {doc.note && <div style={{ fontSize: 11.5, color: doc.state === 'mismatch' ? 'var(--red)' : 'var(--amber)' }}>{doc.note}</div>}
                </td>
                <td className="muted">{doc.source}</td>
                <td><span className="doc-state"><DocStateIcon state={doc.state} /> {stateLabel[doc.state]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="detail__section">
        <div className="section-title">Đối chiếu chéo giữa chứng từ <small>tự động sau khi OCR</small></div>
        <ul className="checks">
          {d.crossChecks.map((c) => (
            <li key={c.label}>
              <DocStateIcon state={c.state} />
              <div>
                <div>{c.label}</div>
                {c.detail && <div className="checks__detail" style={{ color: c.state === 'ok' ? 'var(--text-3)' : 'var(--red)' }}>{c.detail}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function DossiersPage() {
  const [selected, setSelected] = useState(ordered[0].job);
  const current = ordered.find((d) => d.job === selected)!;
  const open = ordered.filter((d) => d.status !== 'Đã thông quan');

  return (
    <>
      <PageHeader
        icon={<FolderCheck size={18} />}
        section="Hải quan"
        title="Hồ sơ khai"
        description="Bộ chứng từ của từng tờ khai: Invoice, Packing List, B/L, C/O, giấy phép. Hệ thống đối chiếu số kiện, trọng lượng, trị giá giữa các chứng từ."
      />
      <StatGrid
        items={[
          { label: 'Hồ sơ đang chuẩn bị', value: String(open.length), note: 'Chưa thông quan', module: 'CUS' },
          { label: 'Hồ sơ còn thiếu chứng từ', value: String(open.filter((d) => d.docs.some((x) => x.state === 'missing')).length), note: 'Chủ yếu C/O và chứng thư hun trùng', valueTone: 'amber', noteTone: 'amber' },
          { label: 'Hồ sơ có số liệu lệch', value: String(open.filter((d) => d.docs.some((x) => x.state === 'mismatch')).length), note: 'Trọng lượng, số lượng giữa Invoice và Packing List', valueTone: 'red', noteTone: 'red' },
          { label: 'Hạn hoàn thiện gần nhất', value: '16:30', note: 'Hôm nay · HPH-SEA-2610-0131' },
        ]}
      />
      <div className="master-detail">
        <div className="card md-list">
          {ordered.map((d) => {
            const p = docProgress(d);
            return (
              <button key={d.job} className={`md-item ${d.job === current.job ? 'is-active' : ''}`} onClick={() => setSelected(d.job)}>
                <div className="md-item__row">
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{d.job}</span>
                  {p.issues > 0 ? <Badge tone="red">{p.issues} vấn đề</Badge> : <Badge tone="green">Đủ bộ</Badge>}
                </div>
                <div style={{ fontWeight: 600 }}>{d.customer}</div>
                <div className="progress" style={{ marginTop: 6 }}>
                  <div className="progress__bar" style={{ width: `${(p.ok / p.total) * 100}%`, background: p.issues ? 'var(--amber)' : 'var(--green)' }} />
                </div>
                <div className="subtle" style={{ fontSize: 11 }}>{p.ok}/{p.total} chứng từ · {d.status}</div>
              </button>
            );
          })}
        </div>
        <DossierDetail d={current} />
      </div>
    </>
  );
}
