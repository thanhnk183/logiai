import type { TimelineItem } from '../../components/ui/Timeline';
import type { Tone } from '../../types';

export type FreightMode = 'FCL' | 'LCL' | 'AIR';

// ---------- Bảng giá cước ----------
export interface Charge {
  name: string;
  basis: string;
  amount: string;
}

export interface FreightRate {
  id: string;
  mode: FreightMode;
  carrier: string;
  pol: string;
  pod: string;
  via?: string;
  transit: string;
  frequency: string;
  validFrom: string;
  validTo: string;
  /** Hết hiệu lực trong 14 ngày tới */
  expiring?: boolean;
  freeTime: string;
  /** Giá theo cột của từng loại hình (xem `rateColumns`), đơn vị USD */
  prices: number[];
  surcharges: Charge[];
  localCharges: Charge[];
  updatedAt: string;
  note?: string;
}

// ---------- Báo giá ----------
export type QuotationStatus = 'Nháp' | 'Chờ duyệt' | 'Đã gửi' | 'Chấp nhận' | 'Từ chối' | 'Hết hạn';

export interface QuoteLine {
  item: string;
  basis: string;
  qty: number;
  /** Giá mua, USD/đơn vị */
  cost: number;
  /** Giá bán, USD/đơn vị */
  sell: number;
}

export interface QuoteOption {
  name: string;
  carrier: string;
  routing: string;
  transit: string;
  lines: QuoteLine[];
}

export interface Quotation {
  code: string;
  rfq?: string;
  customer: string;
  route: string;
  mode: FreightMode;
  cargo: string;
  incoterm: string;
  sales: string;
  createdAt: string;
  validTo: string;
  status: QuotationStatus;
  options: QuoteOption[];
  /** Phương án đề xuất cho khách (hiển thị giá trị ở danh sách) */
  chosenOption: number;
  booking?: string;
  note?: string;
}

// ---------- Booking ----------
export type BookingStatus = 'Chờ hãng xác nhận' | 'Đã xác nhận' | 'Đã mở job' | 'Đã hủy';

export interface Cutoff {
  label: string;
  time: string;
  tone?: Tone;
}

export interface Booking {
  code: string;
  carrierRef?: string;
  quotation?: string;
  job?: string;
  customer: string;
  mode: FreightMode;
  carrier: string;
  /** Tàu/chuyến hoặc số hiệu chuyến bay */
  vessel: string;
  pol: string;
  pod: string;
  equipment: string;
  etd: string;
  eta: string;
  status: BookingStatus;
  requestedAt: string;
  cutoffs: Cutoff[];
  containers: { no: string; type: string; seal?: string; status: string }[];
  milestones: TimelineItem[];
  note?: string;
}

// ---------- Shipping Instruction ----------
export type SiStatus = 'Chưa gửi' | 'Đang soạn' | 'Đã gửi hãng' | 'Hãng đã nhận';
export type CheckState = 'ok' | 'error' | 'pending';

export interface SiCheck {
  label: string;
  state: CheckState;
  detail?: string;
}

export interface ShippingInstruction {
  code: string;
  job: string;
  booking: string;
  customer: string;
  carrier: string;
  vessel: string;
  pol: string;
  pod: string;
  cutoff: string;
  cutoffTone?: Tone;
  status: SiStatus;
  sentAt?: string;
  shipper: string;
  consignee: string;
  notify: string;
  cargoDesc: string;
  hsCode: string;
  packages: string;
  grossWeight: string;
  measurement: string;
  freightTerm: 'Prepaid' | 'Collect';
  blType: string;
  containers: { no: string; type: string; seal: string; packages: string; weight: string }[];
  checks: SiCheck[];
}

// ---------- Vận đơn ----------
export type BillKind = 'B/L' | 'AWB';
export type BillStatus = 'Bản nháp' | 'Chờ khách duyệt' | 'Khách yêu cầu sửa' | 'Đã phát hành';
export type BillParty = 'shipper' | 'consignee' | 'notify';

export interface Bill {
  number: string;
  kind: BillKind;
  level: 'House' | 'Master';
  job: string;
  customer: string;
  carrier: string;
  vessel: string;
  pol: string;
  pod: string;
  status: BillStatus;
  issueType: string;
  shipper: string;
  consignee: string;
  notify: string;
  marks: string;
  description: string;
  packages: string;
  weight: string;
  measure: string;
  freightTerm: 'Prepaid' | 'Collect';
  onBoard?: string;
  issuedAt?: string;
  feedback?: {
    from: string;
    time: string;
    text: string;
    /** Nội dung khách đề nghị sửa, để áp dụng một bước */
    fix?: { field: BillParty; value: string };
  };
  versions: { version: string; time: string; by: string; note: string }[];
}
