import type { Tone } from '../../types';

// ---------- Danh sách khách hàng ----------
export type CustomerStatus = 'Đang giao dịch' | 'Tiềm năng' | 'Tạm ngừng';

export interface Contact {
  initials: string;
  name: string;
  title: string;
  phone: string;
}

export interface TxnHistory {
  job: string;
  date: string;
  desc: string;
  amount: string;
}

export interface Customer {
  code: string;
  name: string;
  shortName: string;
  taxCode: string;
  status: CustomerStatus;
  sales: string;
  debt: number; // triệu ₫
  limit: number | null; // triệu ₫
  overdue: number; // triệu ₫
  jobs90: number;
  lastContact: string;
  industry: string;
  paymentTerm: string;
  address: string;
  contract: string;
  routes: string;
  contacts: Contact[];
  history: TxnHistory[];
}

// ---------- RFQ ----------
export type RfqStage = 'new' | 'quoting' | 'sent' | 'negotiating' | 'won';
export type RfqSource = 'Portal' | 'Email' | 'Form' | 'Sales nhập';

export interface Rfq {
  code: string;
  source: RfqSource;
  customer: string;
  route: string;
  cargo: string;
  value: number;
  deadline: string;
  deadlineTone?: Tone;
  sales: string;
  salesInitials: string;
  stage: RfqStage;
  receivedAt: string;
  incoterm: string;
  readyDate: string;
  request: string;
  attachments: string[];
}

// ---------- Contracts ----------
export type ContractStatus = 'Hiệu lực' | 'Sắp hết hạn' | 'Hết hạn' | 'Nháp chờ duyệt';

export interface SlaMetric {
  name: string;
  actual: string;
  target: string;
  percent: number; // 0..100 fill
  marker: number; // 0..100 target marker position
}

export interface Contract {
  code: string;
  customer: string;
  scope: string;
  type: string;
  from: string;
  to: string;
  remaining: string;
  remainingTone?: Tone;
  sla: number | null;
  status: ContractStatus;
  reminder: string;
  paymentTerm: string;
  creditLimit: string;
  slaMetrics: SlaMetric[];
  documents: { name: string; version: string }[];
}

// ---------- Activities ----------
export type ActivityType = 'Cuộc gọi' | 'Email' | 'Gặp mặt' | 'Ghi chú' | 'Khiếu nại';

export interface Activity {
  id: number;
  type: ActivityType;
  customer: string;
  contact: string;
  time: string;
  owner: string;
  content: string;
  reminder?: string;
}

export interface Appointment {
  weekday: string;
  day: number;
  title: string;
  customer: string;
  detail: string;
}

export interface Complaint {
  code: string;
  sla: string;
  slaTone: Tone;
  title: string;
  ref: string;
}

export interface Reminder {
  id: number;
  text: string;
  due: string;
  urgent?: boolean;
  done: boolean;
}
