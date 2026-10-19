import type { Tone } from '../../types';

export type TempZone = 'Thường' | 'Mát 2–8°C' | 'Đông −18°C';

export interface Zone {
  code: string;
  name: string;
  temp: TempZone;
  customer: string;
  racks: number;
  bays: number;
}

export interface Sku {
  code: string;
  name: string;
  customer: string;
  uom: string;
  packing: string;
  temp: TempZone;
  minStock: number;
}

// ---------- Tồn kho ----------
export type StockStatus = 'Sẵn sàng' | 'Giữ hàng' | 'Cận hạn' | 'Đang kiểm kê';

export interface StockLine {
  sku: string;
  location: string;
  lot: string;
  received: string;
  expiry?: string;
  qty: number;
  reserved: number;
  status: StockStatus;
}

// ---------- Nhập kho ----------
export type InboundStatus = 'Chờ lịch hẹn' | 'Đã hẹn' | 'Đang nhận hàng' | 'Chờ cất hàng' | 'Hoàn tất';

export interface InboundLine {
  sku: string;
  expected: number;
  received: number;
  damaged: number;
  location: string;
  putaway: boolean;
}

export interface InboundOrder {
  code: string;
  customer: string;
  job?: string;
  source: string;
  appointment: string;
  dock: string;
  status: InboundStatus;
  lines: InboundLine[];
  note?: string;
  photos: number;
}

// ---------- Xuất kho ----------
export type OutboundStatus = 'Mới' | 'Đang soạn hàng' | 'Đã đóng gói' | 'Đã xuất';

export interface OutboundLine {
  sku: string;
  qty: number;
  picked: number;
  location: string;
}

export interface OutboundOrder {
  code: string;
  customer: string;
  destination: string;
  transportOrder?: string;
  shipAt: string;
  picker?: string;
  status: OutboundStatus;
  lines: OutboundLine[];
  note?: string;
}

// ---------- Kiểm kê ----------
export type CountStatus = 'Đang đếm' | 'Chờ duyệt điều chỉnh' | 'Đã điều chỉnh';

export interface CountLine {
  location: string;
  sku: string;
  system: number;
  counted?: number;
  reason?: string;
}

export interface StockCount {
  code: string;
  zone: string;
  kind: 'Định kỳ' | 'Đột xuất';
  counter: string;
  date: string;
  status: CountStatus;
  lines: CountLine[];
  note?: string;
}

/** Ô ghi chú có màu (dùng cho cảnh báo nhỏ trong danh sách) */
export interface ToneNote {
  text: string;
  tone: Tone;
}
