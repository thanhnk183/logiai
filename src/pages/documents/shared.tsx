import type { ReactNode } from 'react';
import { FileImage, FileSpreadsheet, FileText, FileCode2 } from 'lucide-react';
import type { Tone } from '../../types';
import type { Urgency } from './types';

export { docStatusTone } from '../jobs/shared';

/** Biểu tượng theo đuôi file */
export function FileIcon({ name, size = 16 }: { name: string; size?: number }) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'png') return <FileImage size={size} className="file-ico file-ico--img" />;
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return <FileSpreadsheet size={size} className="file-ico file-ico--xls" />;
  if (ext === 'xml') return <FileCode2 size={size} className="file-ico" />;
  return <FileText size={size} className="file-ico file-ico--pdf" />;
}

/** Màu theo độ tin cậy OCR so với ngưỡng tự duyệt */
export const confidenceTone = (c: number): Tone => (c >= 95 ? 'green' : c >= 80 ? 'amber' : 'red');

export const urgencyLabel: Record<Urgency, string> = {
  overdue: 'Quá hạn',
  today: 'Hạn hôm nay',
  soon: 'Hạn ngày mai',
  later: 'Còn thời gian',
};

export const urgencyTone: Record<Urgency, Tone> = { overdue: 'red', today: 'amber', soon: 'blue', later: 'gray' };

/** Bỏ dấu tiếng Việt, đưa về chữ thường để so khớp tìm kiếm */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

/** Tô sáng các đoạn khớp từ khóa (không phân biệt dấu) */
export function highlight(text: string, query: string): ReactNode {
  const q = fold(query.trim());
  if (!q) return text;
  const f = fold(text);
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  for (let at = f.indexOf(q); at !== -1; at = f.indexOf(q, i)) {
    if (at > i) out.push(text.slice(i, at));
    out.push(<mark key={k++}>{text.slice(at, at + q.length)}</mark>);
    i = at + q.length;
  }
  out.push(text.slice(i));
  return out;
}

/** dd/mm (năm 2026) → yyyy-mm-dd để so sánh với ô chọn ngày */
export const isoDate = (ddmm: string) => {
  const [d, m] = ddmm.split('/');
  return `2026-${m}-${d}`;
};
