import type { Tone } from '../../types';
import type { DocStatus } from '../jobs/types';

/** Một chứng từ đang lưu trong DMS (file đã có, không tính chứng từ còn thiếu) */
export interface DmsDoc {
  id: string;
  name: string;
  type: string;
  source: string;
  status: Exclude<DocStatus, 'Thiếu'>;
  version: string;
  /** dd/mm, năm 2026 */
  updated: string;
  job?: string;
  customer: string;
  note?: string;
  size: string;
  pages: number;
  /** Nội dung chữ đã OCR, dùng cho tìm kiếm toàn văn */
  text: string;
  uploadedBy: string;
}

export interface OcrField {
  label: string;
  value: string;
  /** Độ tin cậy 0–100 */
  confidence: number;
  /** Giá trị đối chiếu từ dữ liệu khác trong hệ thống */
  ref?: { source: string; value: string; match: boolean };
}

export interface OcrItem {
  id: string;
  file: string;
  job: string;
  customer: string;
  source: string;
  receivedAt: string;
  predictedType: string;
  typeConfidence: number;
  /** Lý do cần người duyệt */
  reason: string;
  /** Nếu duyệt thì chứng từ nào trong job được bổ sung / thay thế */
  resolves?: string;
  fields: OcrField[];
  preview: { title: string; lines: string[] };
  insight?: { tone: Tone; text: string };
}

export type AlertKind = 'Thiếu' | 'Lệch';
export type Urgency = 'overdue' | 'today' | 'soon' | 'later';

export interface DocAlert {
  id: string;
  job: string;
  customer: string;
  doc: string;
  type: string;
  kind: AlertKind;
  detail: string;
  /** Bước trong lô hàng đang bị chặn nếu chưa có chứng từ */
  blocks: string;
  deadline: string;
  urgency: Urgency;
  /** Bên phải cung cấp hoặc sửa */
  party: string;
  action: string;
}

export type UploadState = 'Đang OCR' | 'Chờ duyệt' | 'Đã lưu' | 'Không nhận diện';

export interface UploadItem {
  id: string;
  file: string;
  size: string;
  channel: string;
  time: string;
  by: string;
  type?: string;
  job?: string;
  state: UploadState;
}
