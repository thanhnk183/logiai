import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { CloudUpload, Inbox, Mail, ShieldCheck, Smartphone, Upload } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import { jobs } from '../../jobs/data';
import { recentUploads, uploadChannels } from '../data';
import { FileIcon } from '../shared';
import type { UploadItem, UploadState } from '../types';
import '../documents.css';

const stateTone: Record<UploadState, Tone> = { 'Đang OCR': 'blue', 'Chờ duyệt': 'amber', 'Đã lưu': 'green', 'Không nhận diện': 'red' };

const openJobs = jobs.filter((j) => j.status !== 'Hoàn tất');

/** Đoán loại chứng từ từ tên file, mô phỏng bước phân loại của AI */
function guessType(name: string): string | undefined {
  const n = name.toLowerCase();
  const rules: [RegExp, string][] = [
    [/invoice|inv[_-]/, 'Commercial Invoice'],
    [/packing|pl[_-]/, 'Packing List'],
    [/eir/, 'EIR'],
    [/pod|bien_ban/, 'POD'],
    [/vgm/, 'VGM'],
    [/b\/?l|bill|bol/, 'Bill of Lading'],
    [/c\/?o|origin/, 'Certificate of Origin'],
    [/to_?khai|declaration/, 'Tờ khai hải quan'],
    [/booking/, 'Booking Confirmation'],
  ];
  return rules.find(([re]) => re.test(n))?.[1];
}

/** Tìm mã job, booking hoặc B/L trong tên file */
function guessJob(name: string): string | undefined {
  const n = name.toUpperCase();
  return jobs.find((j) => [j.code.slice(-4), j.booking, j.bl].some((k) => k && n.includes(k.toUpperCase())))?.code;
}

const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>(recentUploads);
  const [targetJob, setTargetJob] = useState('');
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = (files: FileList | null) => {
    if (!files?.length) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const added: UploadItem[] = Array.from(files).map((f, i) => ({
      id: `UP-NEW-${Date.now()}-${i}`,
      file: f.name,
      size: fmtSize(f.size),
      channel: 'Tải lên tay',
      time,
      by: 'Lan Anh',
      state: 'Đang OCR',
    }));
    setItems((cur) => [...added, ...cur]);
    // Mô phỏng OCR xong sau 1,5 giây: phân loại và gắn job
    timers.current.push(
      window.setTimeout(() => {
        setItems((cur) =>
          cur.map((it) => {
            if (!added.some((a) => a.id === it.id)) return it;
            const type = guessType(it.file);
            const job = targetJob || guessJob(it.file);
            return { ...it, type, job, state: type ? 'Chờ duyệt' : 'Không nhận diện' };
          }),
        );
      }, 1500),
    );
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    add(e.dataTransfer.files);
  };

  const count = (s: UploadState) => items.filter((i) => i.state === s).length;
  const totalToday = uploadChannels.reduce((s, c) => s + c.today, 0);

  return (
    <>
      <PageHeader
        icon={<Upload size={18} />}
        section="Chứng từ"
        title="Tải lên"
        description="Kéo thả file hoặc nhận tự động qua email, portal khách và Driver App. AI phân loại chứng từ, đọc số liệu và gắn vào job theo số booking hoặc B/L."
      />
      <StatGrid
        items={[
          { label: 'Nhận hôm nay', value: String(totalToday), note: 'Từ 4 kênh', module: 'DMS' },
          { label: 'Đang OCR', value: String(count('Đang OCR')), note: 'Thường xong dưới 30 giây' },
          { label: 'Chờ người duyệt', value: String(count('Chờ duyệt')), note: 'Trong các file mới nhất bên dưới', valueTone: 'amber', noteTone: 'amber' },
          { label: 'Không nhận diện được', value: String(count('Không nhận diện')), note: 'Cần chọn loại và job bằng tay', valueTone: count('Không nhận diện') ? 'red' : undefined },
        ]}
      />

      <div className="split" style={{ gridTemplateColumns: 'minmax(0, 1fr) 330px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Card>
            <div
              className={`dropzone ${over ? 'is-over' : ''}`}
              onClick={() => input.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            >
              <div className="dropzone__icon"><CloudUpload size={22} /></div>
              <div style={{ fontWeight: 600 }}>Kéo thả file vào đây hoặc bấm để chọn</div>
              <div className="muted" style={{ fontSize: 12 }}>PDF, ảnh JPG/PNG, Excel · tối đa 25 MB mỗi file · một file có nhiều chứng từ sẽ được tách</div>
              <input ref={input} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.xml" onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 12.5 }}>
              <label htmlFor="target-job" className="muted" style={{ whiteSpace: 'nowrap' }}>Gắn vào job</label>
              <select id="target-job" className="select" style={{ maxWidth: 360 }} value={targetJob} onChange={(e) => setTargetJob(e.target.value)}>
                <option value="">Để AI tự nhận theo số booking / B/L trong file</option>
                {openJobs.map((j) => <option key={j.code} value={j.code}>{j.code} · {j.customer}</option>)}
              </select>
            </div>
          </Card>

          <Card title="Tải lên gần đây" subtitle={`${items.length} file mới nhất, mọi kênh`} action={<Link to="/duyet-ocr" className="link-small">Mở hàng chờ duyệt OCR</Link>} bodyClassName="table-wrap">
            <table className="table">
              <thead>
                <tr><th>File</th><th>Kênh</th><th>Lúc</th><th>Loại AI nhận diện</th><th>Job</th><th>Tình trạng</th></tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td style={{ maxWidth: 280 }}>
                      <div className="doc-name"><FileIcon name={it.file} /><span className="doc-name__text" title={it.file}>{it.file}</span></div>
                      <div className="subtle" style={{ fontSize: 11.5, marginLeft: 24 }}>{it.size} · {it.by}</div>
                    </td>
                    <td className="muted">{it.channel}</td>
                    <td className="mono">{it.time}</td>
                    <td>{it.type ?? <span className="subtle">{it.state === 'Đang OCR' ? 'Đang phân loại…' : 'Chưa rõ'}</span>}</td>
                    <td>{it.job ? <JobLink code={it.job} /> : <span className="subtle">—</span>}</td>
                    <td>
                      <Badge tone={stateTone[it.state]}>{it.state}</Badge>
                      {it.state === 'Không nhận diện' && <div><button className="link-small" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>Phân loại tay</button></div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card title="Kênh nhận chứng từ" subtitle="Số file nhận hôm nay">
          {uploadChannels.map((c, i) => {
            const Icon = [Mail, Inbox, Smartphone, ShieldCheck][i];
            return (
              <div key={c.name} className="channel">
                <Icon size={16} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{c.note}</div>
                </div>
                <b>{c.today}</b>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}
