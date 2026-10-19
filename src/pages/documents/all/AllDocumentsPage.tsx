import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, FolderOpen, History, Share2, X } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { dmsDocs } from '../data';
import { FileIcon, docStatusTone, fold } from '../shared';
import type { DmsDoc } from '../types';
import '../documents.css';

type StatusFilter = 'all' | DmsDoc['status'];
const statuses: DmsDoc['status'][] = ['Đã duyệt', 'Chờ duyệt OCR', 'Lệch', 'Nháp'];

const types = [...new Set(dmsDocs.map((d) => d.type))].sort();
const customers = [...new Set(dmsDocs.map((d) => d.customer))].sort();

/** Mới cập nhật lên đầu */
const byDate = (d: DmsDoc) => {
  const [dd, mm] = d.updated.split('/');
  return Number(mm) * 100 + Number(dd);
};

function DocPreview({ doc }: { doc: DmsDoc }) {
  const words = doc.text.split(' ');
  const lines = Array.from({ length: Math.min(6, Math.ceil(words.length / 5)) }, (_, i) => words.slice(i * 5, i * 5 + 5).join(' '));
  return (
    <div className="paper paper--thumb">
      <span className="paper__badge">{doc.pages} trang</span>
      <div className="paper__title">{doc.type.toUpperCase()}</div>
      {lines.length ? lines.map((l) => <div key={l} className="paper__line">{l}</div>) : [80, 60, 90, 45].map((w) => <div key={w} className="paper__skeleton" style={{ width: `${w}%` }} />)}
    </div>
  );
}

function DocDetail({ doc, onClose }: { doc: DmsDoc; onClose: () => void }) {
  const versions = Number(doc.version.slice(1));
  return (
    <section className="card">
      <DetailHeader
        code={doc.id}
        badge={<Badge tone={docStatusTone[doc.status]}>{doc.status}</Badge>}
        title={<span style={{ wordBreak: 'break-all' }}>{doc.name}</span>}
        subtitle={`${doc.type} · ${doc.size}`}
        actions={
          <>
            <button className="btn btn--primary btn--sm"><Download size={14} /> Tải xuống</button>
            <button className="btn btn--sm"><Share2 size={14} /> Chia sẻ</button>
            <button className="btn btn--sm" onClick={onClose} aria-label="Đóng"><X size={14} /></button>
          </>
        }
      />
      <div className="detail__section"><DocPreview doc={doc} /></div>
      {doc.note && (
        <div className="detail__section">
          <Alert tone={doc.status === 'Lệch' ? 'red' : 'amber'}>{doc.note}</Alert>
        </div>
      )}
      <div className="detail__section kv-grid">
        <Field label="Job">{doc.job ? <JobLink code={doc.job} /> : <span className="muted">Không gắn job</span>}</Field>
        <Field label="Khách hàng">{doc.customer}</Field>
        <Field label="Nguồn">{doc.source}</Field>
        <Field label="Người tải lên">{doc.uploadedBy}</Field>
        <Field label="Cập nhật">{doc.updated}/2026</Field>
        <Field label="Phiên bản">{doc.version}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title"><span><History size={13} style={{ verticalAlign: -2 }} /> Lịch sử phiên bản</span></div>
        <ul className="checks">
          {Array.from({ length: versions }, (_, i) => versions - i).map((v) => (
            <li key={v}>
              <Badge tone={v === versions ? 'blue' : 'gray'}>v{v}</Badge>
              <div>
                <div>{v === versions ? `Bản hiện tại · ${doc.updated}` : `Bản cũ · thay bởi v${v + 1}`}</div>
                <div className="checks__detail subtle">{v === 1 ? `Tạo từ ${doc.source}` : 'Tải lại sau khi sửa số liệu'}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AllDocumentsPage() {
  const [params, setParams] = useSearchParams();
  const jobFilter = params.get('job') ?? '';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [type, setType] = useState('');
  const [customer, setCustomer] = useState('');
  const [selected, setSelected] = useState<string | null>(params.get('doc'));

  const base = useMemo(() => {
    const q = fold(query.trim());
    return dmsDocs
      .filter((d) => (!jobFilter || d.job === jobFilter) && (!type || d.type === type) && (!customer || d.customer === customer))
      .filter((d) => !q || fold(`${d.name} ${d.type} ${d.job ?? ''} ${d.customer}`).includes(q))
      .sort((a, b) => byDate(b) - byDate(a));
  }, [query, jobFilter, type, customer]);
  const rows = status === 'all' ? base : base.filter((d) => d.status === status);
  const current = dmsDocs.find((d) => d.id === selected);

  const count = (s: DmsDoc['status']) => dmsDocs.filter((d) => d.status === s).length;
  const today = dmsDocs.filter((d) => d.updated === '19/10' || d.updated === '18/10').length;

  return (
    <>
      <PageHeader
        icon={<FolderOpen size={18} />}
        section="Chứng từ"
        title="Tất cả chứng từ"
        description="Kho chứng từ dùng chung cho mọi phân hệ: chứng từ của job, hợp đồng, giấy phép. Mỗi file có phiên bản, nguồn và nội dung đã OCR."
      />
      <StatGrid
        items={[
          { label: 'Chứng từ đang lưu', value: String(dmsDocs.length), note: `${new Set(dmsDocs.map((d) => d.job).filter(Boolean)).size} job · ${customers.length} đối tác`, module: 'DMS' },
          { label: 'Mới trong 2 ngày', value: String(today), note: '18/10 – 19/10' },
          { label: 'Chờ duyệt OCR', value: String(count('Chờ duyệt OCR')), note: 'Xem ở Hàng chờ duyệt OCR', valueTone: 'blue', noteTone: 'blue' },
          { label: 'Đang lệch số liệu', value: String(count('Lệch')), note: 'So với chứng từ khác cùng job', valueTone: 'red', noteTone: 'red' },
        ]}
      />
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Tên file, loại, job, khách hàng" />
        <select className="select" style={{ width: 190, height: 32, padding: '0 8px' }} value={type} onChange={(e) => setType(e.target.value)} aria-label="Loại chứng từ">
          <option value="">Tất cả loại chứng từ</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="select" style={{ width: 180, height: 32, padding: '0 8px' }} value={customer} onChange={(e) => setCustomer(e.target.value)} aria-label="Đối tác">
          <option value="">Tất cả đối tác</option>
          {customers.map((c) => <option key={c}>{c}</option>)}
        </select>
        {jobFilter && (
          <button className="chip" onClick={() => setParams({})}>
            Job {jobFilter} <X size={13} style={{ marginLeft: 6 }} />
          </button>
        )}
        <div className="toolbar__right">
          <Segmented<StatusFilter>
            value={status}
            onChange={setStatus}
            options={[{ value: 'all', label: 'Tất cả', count: base.length }, ...statuses.map((s) => ({ value: s, label: s, count: base.filter((d) => d.status === s).length }))]}
          />
        </div>
      </div>

      <div className={current ? 'split' : undefined}>
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Chứng từ</th><th>Job</th><th>Đối tác</th><th>Nguồn</th><th>Bản</th><th>Cập nhật</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={`clickable ${d.id === selected ? 'selected' : ''}`} onClick={() => setSelected(d.id)}>
                  <td style={{ maxWidth: 300 }}>
                    <div className="doc-name"><FileIcon name={d.name} /><span className="doc-name__text" title={d.name}>{d.name}</span></div>
                    <div className="subtle" style={{ fontSize: 11.5, marginLeft: 24 }}>{d.type}</div>
                  </td>
                  <td>{d.job ? <JobLink code={d.job} /> : <span className="subtle">—</span>}</td>
                  <td>{d.customer}</td>
                  <td className="muted">{d.source}</td>
                  <td className="mono">{d.version}</td>
                  <td className="mono">{d.updated}</td>
                  <td><Badge tone={docStatusTone[d.status]}>{d.status}</Badge></td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={7} className="md-empty">Không có chứng từ phù hợp bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
        {current && <DocDetail doc={current} onClose={() => setSelected(null)} />}
      </div>
    </>
  );
}
