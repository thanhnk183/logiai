import { useState } from 'react';
import { Check, CheckCircle2, ScanText, Undo2, XCircle } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, toneColor } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import { OCR_THRESHOLD, autoApprovedToday, ocrQueue } from '../data';
import { FileIcon, confidenceTone } from '../shared';
import type { OcrField, OcrItem } from '../types';
import '../documents.css';

/** Trường cần người kiểm tra: độ tin cậy thấp hoặc lệch với dữ liệu hệ thống */
const needsCheck = (f: OcrField) => f.confidence < 80 || f.ref?.match === false;

interface Review {
  values: Record<string, string>;
  confirmed: Record<string, boolean>;
}

function OcrDetail({ item, review, onChange, onApprove, onReject }: {
  item: OcrItem;
  review: Review;
  onChange: (r: Review) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const pending = item.fields.filter((f) => needsCheck(f) && !review.confirmed[f.label]);
  const low = item.fields.filter((f) => f.confidence < OCR_THRESHOLD).length;

  return (
    <section className="card">
      <DetailHeader
        code={<>{item.id} · <JobLink code={item.job} /></>}
        badge={<Badge tone="blue">{item.predictedType} · {item.typeConfidence}%</Badge>}
        title={<span className="doc-name"><FileIcon name={item.file} size={18} /><span style={{ wordBreak: 'break-all' }}>{item.file}</span></span>}
        subtitle={`${item.customer} · ${item.source} · nhận ${item.receivedAt}`}
        actions={
          <>
            <button className="btn btn--primary btn--sm" disabled={pending.length > 0} onClick={onApprove} title={pending.length ? 'Kiểm tra hết các trường được đánh dấu trước' : undefined}>
              <CheckCircle2 size={14} /> Duyệt và lưu vào job
            </button>
            <button className="btn btn--sm" onClick={onReject}><XCircle size={14} /> Trả lại người gửi</button>
            <select className="select" style={{ width: 'auto', height: 28, padding: '0 6px', fontSize: 12 }} defaultValue="" aria-label="Đổi loại chứng từ">
              <option value="" disabled>Đổi loại chứng từ</option>
              {['Commercial Invoice', 'Packing List', 'VGM', 'EIR', 'POD', 'Bill of Lading', 'Certificate of Origin'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </>
        }
      />
      <div className="detail__section">
        {pending.length > 0 ? (
          <Alert tone="amber">
            {item.reason}. Còn <b>{pending.length}</b> trường cần kiểm tra trước khi duyệt. Sửa giá trị hoặc bấm <b>Đúng</b> để xác nhận.
          </Alert>
        ) : (
          <Alert tone="green">Đã kiểm tra đủ. Khi duyệt, hệ thống sẽ cập nhật: {item.resolves}.</Alert>
        )}
      </div>
      <div className="detail__section ocr-grid">
        <div>
          <div className="section-title">File gốc <small>trang 1</small></div>
          <div className="paper">
            <div className="paper__title">{item.preview.title}</div>
            {item.preview.lines.map((l) => <div key={l} className="paper__line">{l}</div>)}
            {[70, 85, 40].map((w) => <div key={w} className="paper__skeleton" style={{ width: `${w}%` }} />)}
          </div>
          {item.insight && <div style={{ marginTop: 12 }}><Alert tone={item.insight.tone}>{item.insight.text}</Alert></div>}
        </div>
        <div>
          <div className="section-title">Số liệu AI đọc được <small>{low} trường dưới ngưỡng tự duyệt {OCR_THRESHOLD}%</small></div>
          {item.fields.map((f) => {
            const value = review.values[f.label] ?? f.value;
            const edited = value !== f.value;
            const check = needsCheck(f);
            const ok = review.confirmed[f.label];
            const tone = confidenceTone(f.confidence);
            return (
              <div key={f.label} className={`ocr-field ${check && !ok ? 'is-low' : ''} ${edited ? 'is-edited' : ''}`}>
                <label className="ocr-field__label" htmlFor={`f-${item.id}-${f.label}`}>{f.label}</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    id={`f-${item.id}-${f.label}`}
                    className="input mono"
                    value={value}
                    onChange={(e) => onChange({ values: { ...review.values, [f.label]: e.target.value }, confirmed: { ...review.confirmed, [f.label]: true } })}
                  />
                  {check && !ok && (
                    <button className="btn btn--sm" onClick={() => onChange({ ...review, confirmed: { ...review.confirmed, [f.label]: true } })}>
                      <Check size={13} /> Đúng
                    </button>
                  )}
                  {edited && (
                    <button className="btn btn--sm" aria-label="Hoàn tác" title="Về giá trị AI đọc" onClick={() => {
                      const { [f.label]: _drop, ...rest } = review.values;
                      onChange({ values: rest, confirmed: { ...review.confirmed, [f.label]: false } });
                    }}>
                      <Undo2 size={13} />
                    </button>
                  )}
                </div>
                <div className="conf" style={{ color: toneColor[tone] }}>
                  {f.confidence}%
                  <div className="progress"><div className="progress__bar" style={{ width: `${f.confidence}%`, background: toneColor[tone] }} /></div>
                </div>
                {f.ref && (
                  <div className="ocr-field__ref" style={{ color: f.ref.match ? 'var(--green)' : 'var(--red)' }}>
                    {f.ref.match ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{f.ref.match ? 'Khớp' : 'Khác'} {f.ref.source}{f.ref.match ? '' : `: ${f.ref.value}`}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function OcrQueuePage() {
  const [queue, setQueue] = useState(ocrQueue);
  const [selected, setSelected] = useState(ocrQueue[0].id);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [done, setDone] = useState<{ file: string; job: string; approved: boolean }[]>([]);

  const current = queue.find((q) => q.id === selected) ?? queue[0];
  const finish = (item: OcrItem, approved: boolean) => {
    const rest = queue.filter((q) => q.id !== item.id);
    setQueue(rest);
    setDone((d) => [{ file: item.file, job: item.job, approved }, ...d]);
    if (rest.length) setSelected(rest[0].id);
  };

  // receivedAt dạng "dd/mm · hh:mm"
  const sortKey = (q: OcrItem) => `${q.receivedAt.slice(3, 5)}${q.receivedAt.slice(0, 2)}${q.receivedAt.slice(-5)}`;
  const oldest = [...queue].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))[0];
  const fieldsToCheck = queue.reduce((s, q) => s + q.fields.filter(needsCheck).length, 0);

  return (
    <>
      <PageHeader
        icon={<ScanText size={18} />}
        section="Chứng từ"
        title="Hàng chờ duyệt OCR"
        description={`Chứng từ có trường đọc được dưới ${OCR_THRESHOLD}% độ tin cậy hoặc lệch với dữ liệu job. Đối chiếu với file gốc, sửa nếu cần rồi duyệt để lưu vào job.`}
      />
      <StatGrid
        items={[
          { label: 'Đang chờ duyệt', value: String(queue.length), note: oldest ? `Cũ nhất nhận ${oldest.receivedAt}` : 'Đã xử lý hết', module: 'DMS' },
          { label: 'Trường cần kiểm tra', value: String(fieldsToCheck), note: 'Độ tin cậy dưới 80% hoặc lệch dữ liệu', valueTone: fieldsToCheck ? 'amber' : undefined, noteTone: 'amber' },
          { label: 'Tự duyệt hôm nay', value: String(autoApprovedToday), note: `Mọi trường đạt ${OCR_THRESHOLD}% trở lên`, noteTone: 'green' },
          { label: 'Đã xử lý trong phiên', value: String(done.length), note: done.length ? `${done.filter((d) => d.approved).length} duyệt · ${done.filter((d) => !d.approved).length} trả lại` : 'Chưa có' },
        ]}
      />

      {done[0] && (
        <div style={{ marginBottom: 12 }}>
          <Alert tone={done[0].approved ? 'green' : 'amber'}>
            {done[0].approved ? 'Đã lưu' : 'Đã trả lại người gửi'} <b>{done[0].file}</b> · job <JobLink code={done[0].job} />.
          </Alert>
        </div>
      )}

      {queue.length ? (
        <div className="master-detail">
          <div className="card md-list">
            {queue.map((q) => {
              const n = q.fields.filter((f) => needsCheck(f) && !reviews[q.id]?.confirmed[f.label]).length;
              return (
                <button key={q.id} className={`md-item ${q.id === current.id ? 'is-active' : ''}`} onClick={() => setSelected(q.id)}>
                  <div className="md-item__row">
                    <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{q.job}</span>
                    {n ? <Badge tone="amber">{n} trường</Badge> : <Badge tone="green">Sẵn sàng</Badge>}
                  </div>
                  <div className="doc-name" style={{ margin: '3px 0' }}><FileIcon name={q.file} size={14} /><span className="doc-name__text">{q.file}</span></div>
                  <div className="subtle" style={{ fontSize: 11 }}>{q.predictedType} · {q.source} · {q.receivedAt}</div>
                </button>
              );
            })}
          </div>
          <OcrDetail
            key={current.id}
            item={current}
            review={reviews[current.id] ?? { values: {}, confirmed: {} }}
            onChange={(r) => setReviews((all) => ({ ...all, [current.id]: r }))}
            onApprove={() => finish(current, true)}
            onReject={() => finish(current, false)}
          />
        </div>
      ) : (
        <div className="card md-empty">Không còn chứng từ nào chờ duyệt.</div>
      )}
    </>
  );
}
