import type { TimelineItem } from '../../components/ui/Timeline';

export type Channel = 'Xanh' | 'Vàng' | 'Đỏ';
export type DeclarationStatus = 'Đang soạn' | 'Chờ truyền' | 'Chờ phân luồng' | 'Chờ kiểm hóa' | 'Đã thông quan';
export type PayStatus = 'Không phát sinh' | 'Chưa nộp' | 'Đã nộp' | 'Đã chuyển Kế toán';
export type DocState = 'ok' | 'missing' | 'mismatch';

export interface HsLine {
  hs: string;
  desc: string;
  qty: string;
  /** Trị giá, USD */
  value: number;
  /** Thuế suất áp dụng, ví dụ "0%", "5% (form E)" */
  rate: string;
}

export interface Declaration {
  number?: string;
  job: string;
  customer: string;
  direction: 'Xuất' | 'Nhập';
  typeCode: string;
  typeName: string;
  office: string;
  declarant: string;
  registeredAt?: string;
  clearedAt?: string;
  /** Thời gian từ khi truyền đến khi thông quan, giờ */
  clearHours?: number;
  channel?: Channel;
  status: DeclarationStatus;
  lines: HsLine[];
  exchangeRate: number;
  /** Thuế và phí, VND */
  duty: number;
  vat: number;
  fees: number;
  pay: PayStatus;
  inspection?: { time: string; place: string; officer?: string };
  messages: TimelineItem[];
  docs: { name: string; source: string; state: DocState; note?: string }[];
  crossChecks: { label: string; state: DocState; detail?: string }[];
}

export type PermitStatus = 'Còn hiệu lực' | 'Sắp hết hạn' | 'Hết hạn' | 'Đang xin' | 'Đã sử dụng';

export interface Permit {
  code: string;
  kind: string;
  customer: string;
  job?: string;
  issuer: string;
  issued?: string;
  expiry: string;
  status: PermitStatus;
  usage?: string;
  note?: string;
}
