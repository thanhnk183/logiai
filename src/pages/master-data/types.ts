export type RecordStatus = 'Đang dùng' | 'Ngừng dùng' | 'Chờ duyệt';

/** Thông tin chung của mọi bản ghi danh mục */
export interface MasterMeta {
  status: RecordStatus;
  updated: string;
  updatedBy: string;
}

export type PartnerKind = 'Khách hàng' | 'Nhà cung cấp';

export interface Partner extends MasterMeta {
  code: string;
  name: string;
  shortName: string;
  kind: PartnerKind;
  group: string;
  taxCode: string;
  address: string;
  paymentTerm: string;
  bankAccount: string;
  contact: string;
  /** Mã ở hệ thống khác (CRM, kế toán) */
  source: string;
}

export type CarrierKind = 'Hãng tàu' | 'Hãng bay' | 'Co-loader';

export interface Carrier extends MasterMeta {
  code: string;
  name: string;
  kind: CarrierKind;
  /** SCAC cho hãng tàu, mã IATA cho hãng bay */
  scac: string;
  /** Tiền tố số AWB (hãng bay) */
  prefix?: string;
  connection: 'API' | 'EDI' | 'Email' | 'Portal';
  bookingContact: string;
  /** Độ tin cậy lịch tàu / chuyến bay 90 ngày, % */
  reliability: number;
}

export type LocationKind = 'Cảng biển' | 'Sân bay' | 'Depot / ICD' | 'Kho' | 'Chi cục hải quan' | 'Điểm giao nhận';

export interface Location extends MasterMeta {
  code: string;
  name: string;
  kind: LocationKind;
  country: string;
  city: string;
  /** Tên dùng trong job (pol/pod) để đếm số job */
  aliases: string[];
  note?: string;
}

export interface HsCode extends MasterMeta {
  code: string;
  desc: string;
  /** Thuế nhập khẩu ưu đãi (MFN) */
  mfn: string;
  /** Thuế ưu đãi đặc biệt hay dùng */
  special?: string;
  vat: string;
  /** Chính sách quản lý: giấy phép, kiểm tra chuyên ngành… */
  policy?: string;
}

export interface Uom extends MasterMeta {
  code: string;
  name: string;
  kind: 'Đếm' | 'Khối lượng' | 'Thể tích' | 'Container';
  /** Mã đơn vị trên VNACCS */
  customsCode: string;
  convert?: string;
}

export interface TariffItem extends MasterMeta {
  code: string;
  name: string;
  group: string;
  unit: string;
  currency: 'USD' | 'VND';
  price: number;
  /** Giá bán thấp nhất không cần duyệt */
  floor: number;
  vat: string;
  modes: string;
  /** Đề xuất đổi giá đang chờ duyệt */
  proposal?: { price: number; from: string; by: string; reason: string };
}
