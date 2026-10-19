import type { TimelineItem } from '../../components/ui/Timeline';
import type { Tone } from '../../types';

export type Region = 'Hải Phòng' | 'TP.HCM';
export type VehicleType = 'Đầu kéo' | 'Xe tải lạnh' | 'Xe tải';

// ---------- Xe và tài xế ----------
export interface Vehicle {
  plate: string;
  type: VehicleType;
  owner: string;
  driver: string;
  phone: string;
  status: 'Sẵn sàng' | 'Đang chạy' | 'Bảo dưỡng';
  location: string;
  region: Region;
}

// ---------- Lệnh vận chuyển ----------
export type OrderStatus = 'Chờ điều xe' | 'Đã điều xe' | 'Đang chạy' | 'Chờ POD' | 'Hoàn tất';

export interface TransportOrder {
  code: string;
  job?: string;
  /** Lệnh theo hợp đồng, không gắn job (ví dụ xe lạnh hằng tháng) */
  contract?: string;
  customer: string;
  kind: string;
  from: string;
  to: string;
  cargo: string;
  container?: string;
  needs: VehicleType;
  region: Region;
  date: string;
  /** Giờ bắt đầu, kết thúc dự kiến (số thập phân, 13.5 = 13:30) */
  start: number;
  end: number;
  distanceKm: number;
  vehicle?: string;
  trip?: string;
  status: OrderStatus;
  note?: string;
}

// ---------- Chuyến ----------
export type TripStatus = 'Chưa bắt đầu' | 'Đang chạy' | 'Hoàn tất' | 'Có sự cố';

export interface Trip {
  code: string;
  vehicle: string;
  driver: string;
  orders: string[];
  date: string;
  status: TripStatus;
  distanceKm: number;
  gps?: { position: string; updated: string; speed: string };
  stops: TimelineItem[];
  costs: { item: string; amount: number; receipt: boolean }[];
  incident?: string;
}

// ---------- Container và EIR ----------
export interface Eir {
  kind: string;
  time: string;
  place: string;
  by: string;
  condition: 'Tốt' | 'Có hư hỏng';
  note?: string;
}

export interface ContainerRec {
  no: string;
  type: string;
  job?: string;
  customer: string;
  carrier: string;
  seal?: string;
  status: string;
  statusTone: Tone;
  location: string;
  lastMove: string;
  /** Thời gian miễn phí lưu bãi / lưu container còn lại */
  freeTime?: string;
  freeTone?: Tone;
  eirs: Eir[];
}

// ---------- POD ----------
export type PodStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Yêu cầu chụp lại' | 'Thiếu POD';

export interface Pod {
  id: string;
  order: string;
  job?: string;
  customer: string;
  driver: string;
  vehicle: string;
  deliveredAt: string;
  place: string;
  receiver?: string;
  photos: number;
  signature: boolean;
  status: PodStatus;
  overdue?: string;
  checks: { label: string; ok: boolean; detail?: string }[];
  note?: string;
}

// ---------- Nhà thầu ----------
export type ContractorStatus = 'Đang hợp tác' | 'Đang thẩm định' | 'Tạm dừng';

export interface Contractor {
  code: string;
  name: string;
  region: string;
  services: string;
  status: ContractorStatus;
  fleet: number;
  tripsMonth: number;
  onTime: number;
  /** Chi phí tháng 10, triệu ₫ */
  costMonth: number;
  contract: string;
  contact: string;
  docs: { name: string; expiry: string; tone: Tone }[];
  reconciliation?: { period: string; trips: number; amount: string; status: string; tone: Tone };
  note?: string;
}
