import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchCheck } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { dmsDocs } from '../data';
import { FileIcon, docStatusTone, fold, highlight, isoDate } from '../shared';
import type { DmsDoc } from '../types';
import '../documents.css';

const types = [...new Set(dmsDocs.map((d) => d.type))].sort();
const partners = [...new Set(dmsDocs.map((d) => d.customer))].sort();
const sources = [...new Set(dmsDocs.map((d) => d.source))].sort();
const jobCodes = [...new Set(dmsDocs.map((d) => d.job).filter(Boolean) as string[])].sort();
const hints = ['EITU1482036', 'HANSOL', '18.420 kg', 'Blue Harbor', 'luồng xanh', '2-8°C'];

interface Filters {
  type: string;
  partner: string;
  job: string;
  source: string;
  status: string;
  from: string;
  to: string;
  inContent: boolean;
}
const empty: Filters = { type: '', partner: '', job: '', source: '', status: '', from: '2026-01-01', to: '2026-10-19', inContent: true };

type Sort = 'relevance' | 'newest';

/** Đoạn văn quanh vị trí khớp đầu tiên trong nội dung OCR */
function snippet(text: string, q: string) {
  const at = fold(text).indexOf(fold(q));
  if (at < 0) return text.length > 140 ? `${text.slice(0, 140)}…` : text;
  // Cắt ở ranh giới từ để đoạn trích không bắt đầu giữa chữ
  const sp = text.indexOf(' ', Math.max(0, at - 50));
  const start = at > 50 && sp !== -1 && sp < at ? sp + 1 : 0;
  const ep = text.lastIndexOf(' ', at + q.length + 70);
  const end = at + q.length + 70 >= text.length || ep <= at ? text.length : ep;
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export default function AdvancedSearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [draft, setDraft] = useState(query);
  const [f, setF] = useState<Filters>(empty);
  const [sort, setSort] = useState<Sort>('relevance');
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((cur) => ({ ...cur, [k]: v }));

  const results = useMemo(() => {
    const q = fold(query.trim());
    const scored = dmsDocs
      .filter((d) => (!f.type || d.type === f.type) && (!f.partner || d.customer === f.partner) && (!f.job || d.job === f.job))
      .filter((d) => (!f.source || d.source === f.source) && (!f.status || d.status === f.status))
      .filter((d) => isoDate(d.updated) >= f.from && isoDate(d.updated) <= f.to)
      .map((d) => {
        if (!q) return { d, score: 1, inText: false };
        const inMeta = fold(`${d.name} ${d.type} ${d.job ?? ''} ${d.customer}`).includes(q);
        const inText = f.inContent && fold(d.text).includes(q);
        return { d, score: (inMeta ? 2 : 0) + (inText ? 1 : 0), inText };
      })
      .filter((r) => r.score > 0);
    const date = (d: DmsDoc) => isoDate(d.updated);
    return scored.sort((a, b) => (sort === 'relevance' && b.score !== a.score ? b.score - a.score : date(b.d).localeCompare(date(a.d))));
  }, [query, f, sort]);

  const run = (q: string) => {
    setDraft(q);
    setParams(q ? { q } : {});
  };
  const active = Object.entries(f).filter(([k, v]) => v !== empty[k as keyof Filters]).length;

  return (
    <>
      <PageHeader
        icon={<SearchCheck size={18} />}
        section="Chứng từ"
        title="Tìm kiếm nâng cao"
        description="Tìm theo nội dung bên trong chứng từ (số container, tên người nhận, trọng lượng…), không chỉ theo tên file. Không phân biệt dấu tiếng Việt."
      />
      <form
        className="toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          run(draft.trim());
        }}
      >
        <label className="search-box" style={{ flex: 1, maxWidth: 640 }}>
          <SearchCheck size={14} />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ví dụ: EITU1482036, HANSOL, 18.420 kg" autoFocus />
        </label>
        <button type="submit" className="btn btn--primary">Tìm</button>
        <div className="hint-chips">
          {hints.map((h) => (
            <button type="button" key={h} className={`pill ${h === query ? 'active' : ''}`} onClick={() => run(h)}>{h}</button>
          ))}
        </div>
      </form>

      <div className="search-grid">
        <Card title="Bộ lọc" action={active > 0 ? <button className="link-small" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={() => setF(empty)}>Xóa {active} bộ lọc</button> : undefined}>
          <div className="search-form">
            <label className="checkbox-row" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5 }}>
              <input type="checkbox" checked={f.inContent} onChange={(e) => set('inContent', e.target.checked)} />
              Tìm cả trong nội dung đã OCR
            </label>
            {([
              ['type', 'Loại chứng từ', types],
              ['partner', 'Khách hàng / đối tác', partners],
              ['job', 'Job', jobCodes],
              ['source', 'Nguồn', sources],
              ['status', 'Trạng thái', ['Đã duyệt', 'Chờ duyệt OCR', 'Lệch', 'Nháp']],
            ] as const).map(([k, label, opts]) => (
              <div key={k}>
                <label className="field-label" htmlFor={`flt-${k}`}>{label}</label>
                <select id={`flt-${k}`} className="select" value={f[k]} onChange={(e) => set(k, e.target.value)}>
                  <option value="">Tất cả</option>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <span className="field-label">Ngày cập nhật</span>
              <div className="date-pair">
                <input type="date" className="input" aria-label="Từ ngày" value={f.from} max={f.to} onChange={(e) => set('from', e.target.value)} />
                <input type="date" className="input" aria-label="Đến ngày" value={f.to} min={f.from} onChange={(e) => set('to', e.target.value)} />
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={query ? <>Kết quả cho “{query}”</> : 'Tất cả chứng từ'}
          subtitle={`${results.length} chứng từ`}
          action={<Segmented<Sort> value={sort} onChange={setSort} options={[{ value: 'relevance', label: 'Liên quan nhất' }, { value: 'newest', label: 'Mới nhất' }]} />}
          bodyClassName=""
        >
          {results.map(({ d, inText }) => (
            <div key={d.id} className="result">
              <FileIcon name={d.name} size={20} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/chung-tu?doc=${d.id}`} style={{ fontWeight: 600, wordBreak: 'break-all' }}>{highlight(d.name, query)}</Link>
                  <Badge tone={docStatusTone[d.status]}>{d.status}</Badge>
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {highlight(d.type, query)} · {highlight(d.customer, query)} · {d.source} · {d.version} · {d.updated}/2026
                  {d.job && <> · <JobLink code={d.job} /></>}
                </div>
                {d.text && (query ? inText : true) && <div className="result__snippet">{highlight(snippet(d.text, query), query)}</div>}
              </div>
            </div>
          ))}
          {!results.length && <div className="md-empty">Không tìm thấy chứng từ nào. Thử bỏ bớt bộ lọc hoặc bật tìm trong nội dung OCR.</div>}
        </Card>
      </div>
    </>
  );
}
