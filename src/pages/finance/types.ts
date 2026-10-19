export type ArStatus = 'Chờ xuất' | 'Chưa đến hạn' | 'Sắp đến hạn' | 'Quá hạn' | 'Đã thu';

export interface ArInvoice {
  number?: string;
  kind: 'Hóa đơn' | 'Debit Note' | 'Credit Note';
  customer: string;
  job?: string;
  description: string;
  issued?: string;
  due?: string;
  /** VND */
  amount: number;
  status: ArStatus;
  daysOverdue?: number;
  /** Lý do chưa xuất được (ví dụ chờ POD) */
  blocked?: string;
  note?: string;
}

/** Tuổi nợ theo khách, triệu ₫: trong hạn, 1–30, 31–60, 61–90, trên 90 ngày */
export type Aging = [number, number, number, number, number];

export type ApStatus = 'Chờ HĐ NCC' | 'Chờ duyệt' | 'Đã duyệt' | 'Đã thanh toán';

export interface ApBill {
  code: string;
  vendor: string;
  kind: string;
  job?: string;
  description: string;
  vendorInvoice?: string;
  due: string;
  amount: number;
  status: ApStatus;
  match: { ok: boolean; text: string };
  note?: string;
}

export interface BankAccount {
  code: string;
  bank: string;
  number: string;
  currency: 'VND' | 'USD';
  balance: number;
}

export interface BankTxn {
  id: string;
  account: string;
  time: string;
  description: string;
  amount: number;
  /** Chứng từ đã ghép (hóa đơn AR / khoản AP) */
  matched?: string;
  /** Gợi ý ghép tự động */
  suggestion?: { ref: string; reason: string };
}

export interface VatInvoice {
  number: string;
  direction: 'Đầu ra' | 'Đầu vào';
  party: string;
  date: string;
  /** Tiền trước thuế, VND */
  net: number;
  rate: number;
  status: 'Đã cấp mã' | 'Chờ cấp mã' | 'Sai thông tin' | 'Hợp lệ';
  note?: string;
}

export type ReconStatus = 'Chưa gửi' | 'Đã gửi' | 'Có chênh lệch' | 'Đã xác nhận';

export interface Reconciliation {
  id: string;
  party: string;
  side: 'Khách hàng' | 'Nhà cung cấp';
  period: string;
  /** Số dư theo sổ của LogiAI và theo bên kia, triệu ₫ */
  ours: number;
  theirs?: number;
  status: ReconStatus;
  sentAt?: string;
  items: { text: string; amount: number }[];
}
