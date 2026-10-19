import type { TimelineItem } from '../../components/ui/Timeline';
import type { Module, StepState, Tone } from '../../types';

export type JobMode = 'FCL' | 'LCL' | 'AIR' | 'FTL' | 'WH';
export type JobStatus = 'Đang thực hiện' | 'Chờ chứng từ' | 'Có vấn đề' | 'Hoàn tất';
export type TodoGroup = 'overdue' | 'morning' | 'afternoon' | 'tomorrow';

export interface JobTodo {
  id: string;
  text: string;
  module: Module;
  due: string;
  group: TodoGroup;
  done: boolean;
}

export interface TransportLeg {
  order: string;
  kind: string;
  from: string;
  to: string;
  vehicle: string;
  driver: string;
  time: string;
  status: string;
  tone: Tone;
}

export interface WarehouseInfo {
  warehouse: string;
  order: string;
  kind: string;
  appointment: string;
  status: string;
  statusTone: Tone;
  items: { sku: string; desc: string; qty: string; location: string }[];
}

export interface CustomsInfo {
  declaration: string;
  type: string;
  office: string;
  channel?: 'Xanh' | 'Vàng' | 'Đỏ';
  status: string;
  statusTone: Tone;
  duty: string;
  checklist: { label: string; done: boolean }[];
}

export interface ChargeLine {
  item: string;
  party: string;
  amount: number;
  status: string;
  tone: Tone;
}

export type DocStatus = 'Đã duyệt' | 'Chờ duyệt OCR' | 'Lệch' | 'Thiếu' | 'Nháp';

export interface JobDocument {
  name: string;
  type: string;
  source: string;
  status: DocStatus;
  version?: string;
  updated?: string;
  note?: string;
}

export interface Tracking {
  /** 0–100, vị trí trên hành trình POL → POD */
  progress: number;
  position: string;
  lastUpdate: string;
  source: string;
  events: TimelineItem[];
}

export interface Job {
  code: string;
  mode: JobMode;
  direction: 'Xuất' | 'Nhập' | 'Nội địa' | 'Kho';
  customer: string;
  pol: string;
  pod: string;
  via?: string;
  cargo: string;
  equipment: string;
  incoterm: string;
  carrier?: string;
  vessel?: string;
  booking?: string;
  quotation?: string;
  bl?: string;
  etd: string;
  eta: string;
  cs: string;
  sales: string;
  openedAt: string;
  steps: StepState[];
  status: JobStatus;
  alert?: { text: string; tone: Tone };
  todos: JobTodo[];
  milestones: TimelineItem[];
  transport: TransportLeg[];
  warehouse?: WarehouseInfo;
  customs?: CustomsInfo;
  finance: { currency: 'USD' | 'VND'; revenue: ChargeLine[]; costs: ChargeLine[] };
  documents: JobDocument[];
  history: { time: string; by: string; text: string }[];
  tracking?: Tracking;
}
