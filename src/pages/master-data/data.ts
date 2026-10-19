import { customers } from '../customers/list/data';
import { contractors } from '../transport/data';
import type { Carrier, HsCode, Location, Partner, TariffItem, Uom } from './types';

// ---------- Khách hàng, nhà cung cấp ----------
/** Khách hàng lấy từ CRM, giữ nguyên mã KH */
const fromCrm: Partner[] = customers.map((c) => ({
  code: c.code,
  name: c.name,
  shortName: c.shortName,
  kind: 'Khách hàng',
  group: c.industry,
  taxCode: c.taxCode,
  address: c.address,
  paymentTerm: c.paymentTerm,
  bankAccount: c.status === 'Tiềm năng' ? '' : `Vietcombank · ${c.taxCode.slice(0, 4)} ${c.taxCode.slice(4, 8)} ${c.code.slice(-3)}`,
  contact: `${c.contacts[0].name} · ${c.contacts[0].phone}`,
  source: 'CRM',
  status: c.status === 'Tạm ngừng' ? 'Ngừng dùng' : 'Đang dùng',
  updated: '12/10',
  updatedBy: c.sales,
}));

/** Nhà thầu vận tải lấy từ TMS */
const fromTms: Partner[] = contractors.map((c, i) => ({
  code: c.code,
  name: `Công ty TNHH ${c.name}`,
  shortName: c.name,
  kind: 'Nhà cung cấp',
  group: 'Nhà thầu vận tải',
  taxCode: ['0201487365', '0313672045', '0201933418', '3702455190', '0314028876'][i] ?? '',
  address: c.region,
  paymentTerm: 'Thanh toán 30 ngày sau đối soát',
  bankAccount: i === 3 ? '' : `BIDV · 1251 0000 ${4410 + i * 37}`,
  contact: c.contact,
  source: 'TMS',
  status: c.status === 'Tạm dừng' ? 'Ngừng dùng' : c.status === 'Đang thẩm định' ? 'Chờ duyệt' : 'Đang dùng',
  updated: '17/10',
  updatedBy: 'Thanh Tùng',
}));

const others: Partner[] = [
  {
    code: 'KH-00419', name: 'Công ty CP Bán lẻ Delta', shortName: 'Bán lẻ Delta', kind: 'Khách hàng', group: 'Bán lẻ, hàng tiêu dùng',
    taxCode: '0315582941', address: 'Lô C2, KCN Nam Tân Uyên, Bình Dương', paymentTerm: 'Công nợ 30 ngày', bankAccount: 'ACB · 2183 4456 01',
    contact: 'Vũ Thị Lan · 0907 113 486', source: 'CRM', status: 'Đang dùng', updated: '16/10', updatedBy: 'Hoàng Nam',
  },
  {
    code: 'KH-00431', name: 'Cty TNHH Dệt Minh Phát - Chi nhánh Hà Nội', shortName: 'Dệt Minh Phát HN', kind: 'Khách hàng', group: 'Xuất khẩu dệt may',
    taxCode: '0312456789', address: 'KCN Quang Minh, Mê Linh, Hà Nội', paymentTerm: 'Công nợ 30 ngày', bankAccount: '',
    contact: 'Trần Thu Hà · 0903 412 588', source: 'Nhập tay', status: 'Chờ duyệt', updated: '18/10', updatedBy: 'Hoàng Nam',
  },
  {
    code: 'NCC-HT-004', name: 'Evergreen Shipping Agency (Vietnam)', shortName: 'Evergreen VN', kind: 'Nhà cung cấp', group: 'Đại lý hãng tàu',
    taxCode: '0302113587', address: 'Q.1, TP.HCM', paymentTerm: 'Trả trước khi lấy B/L', bankAccount: 'HSBC · 001 172 553 041',
    contact: 'Booking desk · 028 3821 6688', source: 'Kế toán', status: 'Đang dùng', updated: '02/10', updatedBy: 'Mỹ Linh',
  },
  {
    code: 'NCC-HT-009', name: 'CMA CGM Vietnam', shortName: 'CMA CGM VN', kind: 'Nhà cung cấp', group: 'Đại lý hãng tàu',
    taxCode: '0304822198', address: 'Q.Bình Thạnh, TP.HCM', paymentTerm: 'Công nợ 15 ngày', bankAccount: 'Citibank · 0 250 330 117',
    contact: 'Customer service · 028 3910 6006', source: 'Kế toán', status: 'Đang dùng', updated: '09/10', updatedBy: 'Mỹ Linh',
  },
  {
    code: 'NCC-KT-002', name: 'Công ty Khử trùng Hải Phòng', shortName: 'Khử trùng Hải Phòng', kind: 'Nhà cung cấp', group: 'Khử trùng, giám định',
    taxCode: '0200417762', address: 'Ngô Quyền, Hải Phòng', paymentTerm: 'Thanh toán khi nhận chứng thư', bankAccount: 'Vietinbank · 1020 1000 2245',
    contact: 'Phòng nghiệp vụ · 0225 3765 112', source: 'Kế toán', status: 'Đang dùng', updated: '20/09', updatedBy: 'Mỹ Linh',
  },
  {
    code: 'NCC-CG-001', name: 'Tổng Công ty Tân Cảng Sài Gòn', shortName: 'Tân Cảng Sài Gòn', kind: 'Nhà cung cấp', group: 'Cảng, bãi',
    taxCode: '0300514849', address: 'TP. Thủ Đức, TP.HCM', paymentTerm: 'Trả qua ePort', bankAccount: 'Vietcombank · 0071 0001 6680',
    contact: 'ePort · 1900 6466', source: 'Kế toán', status: 'Đang dùng', updated: '01/09', updatedBy: 'Mỹ Linh',
  },
];

export const partners: Partner[] = [...fromCrm, others[0], others[1], ...fromTms, ...others.slice(2)];

// ---------- Hãng tàu, hãng bay ----------
export const carriers: Carrier[] = [
  { code: 'EVG', name: 'Evergreen', kind: 'Hãng tàu', scac: 'EGLV', connection: 'API', bookingContact: 'Evergreen VN · booking@evergreen-line.vn', reliability: 71, status: 'Đang dùng', updated: '02/10', updatedBy: 'Quốc Bảo' },
  { code: 'YML', name: 'Yang Ming', kind: 'Hãng tàu', scac: 'YMLU', connection: 'EDI', bookingContact: 'Yang Ming VN · 028 3822 5600', reliability: 64, status: 'Đang dùng', updated: '09/10', updatedBy: 'Quốc Bảo' },
  { code: 'HMM', name: 'HMM', kind: 'Hãng tàu', scac: 'HDMU', connection: 'Portal', bookingContact: 'HMM VN · hmm21.com', reliability: 58, status: 'Đang dùng', updated: '06/10', updatedBy: 'Thu Trang' },
  { code: 'CMA', name: 'CMA CGM', kind: 'Hãng tàu', scac: 'CMDU', connection: 'API', bookingContact: 'CMA CGM VN · eBusiness', reliability: 66, status: 'Đang dùng', updated: '07/10', updatedBy: 'Quốc Bảo' },
  { code: 'COS', name: 'COSCO', kind: 'Hãng tàu', scac: 'COSU', connection: 'EDI', bookingContact: 'COSCO VN · cs@cosco.com.vn', reliability: 62, status: 'Đang dùng', updated: '28/09', updatedBy: 'Quốc Bảo' },
  { code: 'MSC', name: 'MSC', kind: 'Hãng tàu', scac: 'MSCU', connection: 'Portal', bookingContact: 'MSC VN · myMSC', reliability: 55, status: 'Đang dùng', updated: '15/10', updatedBy: 'Thu Trang' },
  { code: 'ONE', name: 'ONE', kind: 'Hãng tàu', scac: 'ONEY', connection: 'API', bookingContact: 'ONE VN · one-line.com', reliability: 69, status: 'Đang dùng', updated: '01/10', updatedBy: 'Quốc Bảo' },
  { code: 'MSK', name: 'Maersk', kind: 'Hãng tàu', scac: 'MAEU', connection: 'API', bookingContact: 'Maersk VN · maersk.com', reliability: 74, status: 'Đang dùng', updated: '10/10', updatedBy: 'Thu Trang' },
  { code: 'SKR', name: 'Sinokor', kind: 'Hãng tàu', scac: 'SKLU', connection: 'Email', bookingContact: 'Sinokor HPH · booking.hph@sinokor.vn', reliability: 61, status: 'Đang dùng', updated: '11/09', updatedBy: 'Thu Trang' },
  { code: 'LHC', name: 'Lufthansa Cargo', kind: 'Hãng bay', scac: 'LH', prefix: '020', connection: 'API', bookingContact: 'LH Cargo SGN · eBooking', reliability: 92, status: 'Đang dùng', updated: '14/10', updatedBy: 'Lan Anh' },
  { code: 'KLM', name: 'KLM Cargo', kind: 'Hãng bay', scac: 'KL', prefix: '074', connection: 'Portal', bookingContact: 'AF-KLM Cargo · myCargo', reliability: 89, status: 'Đang dùng', updated: '03/10', updatedBy: 'Lan Anh' },
  { code: 'MUC', name: 'China Eastern', kind: 'Hãng bay', scac: 'MU', prefix: '112', connection: 'Email', bookingContact: 'MU Cargo HAN · 024 3827 1513', reliability: 84, status: 'Đang dùng', updated: '22/09', updatedBy: 'Lan Anh' },
  { code: 'LXC', name: 'Swiss WorldCargo', kind: 'Hãng bay', scac: 'LX', prefix: '724', connection: 'Portal', bookingContact: 'Qua GSA Vietnam · 028 3848 7700', reliability: 90, status: 'Đang dùng', updated: '30/09', updatedBy: 'Lan Anh' },
  { code: 'CFS-SGN', name: 'CFS Sài Gòn (co-loader)', kind: 'Co-loader', scac: '—', connection: 'Email', bookingContact: 'lcl@cfssaigon.vn', reliability: 80, status: 'Đang dùng', updated: '25/09', updatedBy: 'Quốc Bảo' },
  { code: 'CFS-HPH', name: 'CFS Hải Phòng (co-loader)', kind: 'Co-loader', scac: '—', connection: 'Email', bookingContact: 'lcl@cfshaiphong.vn', reliability: 77, status: 'Ngừng dùng', updated: '15/08', updatedBy: 'Thu Trang' },
];

// ---------- Cảng, kho, địa điểm ----------
export const locations: Location[] = [
  { code: 'VNHPH', name: 'Cảng Hải Phòng', kind: 'Cảng biển', country: 'Việt Nam', city: 'Hải Phòng', aliases: ['Hải Phòng'], note: 'Gồm Tân Vũ, Lạch Huyện, Đình Vũ', status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'VNCLI', name: 'Cảng Cát Lái', kind: 'Cảng biển', country: 'Việt Nam', city: 'TP.HCM', aliases: ['Cát Lái'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'USLAX', name: 'Los Angeles', kind: 'Cảng biển', country: 'Hoa Kỳ', city: 'Los Angeles, CA', aliases: ['Los Angeles'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'USLGB', name: 'Long Beach', kind: 'Cảng biển', country: 'Hoa Kỳ', city: 'Long Beach, CA', aliases: ['Long Beach'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'DEHAM', name: 'Hamburg', kind: 'Cảng biển', country: 'Đức', city: 'Hamburg', aliases: ['Hamburg'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'KRPUS', name: 'Busan', kind: 'Cảng biển', country: 'Hàn Quốc', city: 'Busan', aliases: ['Busan'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'AUSYD', name: 'Sydney', kind: 'Cảng biển', country: 'Úc', city: 'Sydney, NSW', aliases: ['Sydney'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'NLRTM', name: 'Rotterdam', kind: 'Cảng biển', country: 'Hà Lan', city: 'Rotterdam', aliases: ['Rotterdam'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'TWKHH', name: 'Kaohsiung', kind: 'Cảng biển', country: 'Đài Loan', city: 'Kaohsiung', aliases: ['Kaohsiung'], note: 'Cảng chuyển tải', status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'VNSGN', name: 'Sân bay Tân Sơn Nhất', kind: 'Sân bay', country: 'Việt Nam', city: 'TP.HCM', aliases: ['Tân Sơn Nhất'], note: 'Kho hàng TCS, SCSC', status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'DEFRA', name: 'Frankfurt', kind: 'Sân bay', country: 'Đức', city: 'Frankfurt am Main', aliases: ['Frankfurt'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'VNHAN', name: 'Sân bay Nội Bài', kind: 'Sân bay', country: 'Việt Nam', city: 'Hà Nội', aliases: ['Nội Bài'], status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'DEP-DVU', name: 'Depot Đình Vũ', kind: 'Depot / ICD', country: 'Việt Nam', city: 'Hải Phòng', aliases: [], note: 'Cấp rỗng Evergreen, HMM', status: 'Đang dùng', updated: '17/10', updatedBy: 'Thanh Tùng' },
  { code: 'DEP-PLG', name: 'Depot Phước Long', kind: 'Depot / ICD', country: 'Việt Nam', city: 'TP.HCM', aliases: [], note: 'Trả rỗng hàng nhập Cát Lái', status: 'Đang dùng', updated: '15/10', updatedBy: 'Thanh Tùng' },
  { code: 'WH-TUY', name: 'Kho Tân Uyên', kind: 'Kho', country: 'Việt Nam', city: 'Bình Dương', aliases: [], note: '4 khu A–D, có kho lạnh và kho đông', status: 'Đang dùng', updated: '10/10', updatedBy: 'Quang Minh' },
  { code: 'HQ-02CI', name: 'Chi cục HQ CK cảng Sài Gòn KV I', kind: 'Chi cục hải quan', country: 'Việt Nam', city: 'TP.HCM', aliases: [], note: 'Mã VNACCS 02CI · Cát Lái', status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'HQ-03CC', name: 'Chi cục HQ CK cảng Hải Phòng KV III', kind: 'Chi cục hải quan', country: 'Việt Nam', city: 'Hải Phòng', aliases: [], note: 'Mã VNACCS 03CC', status: 'Đang dùng', updated: '01/03', updatedBy: 'Hệ thống' },
  { code: 'PT-DMP-TT', name: 'Nhà máy Dệt Minh Phát · KCN Tân Tạo', kind: 'Điểm giao nhận', country: 'Việt Nam', city: 'TP.HCM', aliases: [], note: 'Giờ nhận hàng 07:00–16:00', status: 'Đang dùng', updated: '02/10', updatedBy: 'Lan Anh' },
  { code: 'PT-SV-MP', name: 'Kho Sao Việt · KCN Mỹ Phước', kind: 'Điểm giao nhận', country: 'Việt Nam', city: 'Bình Dương', aliases: [], note: 'Cần xe lạnh, dock 3–4', status: 'Đang dùng', updated: '13/10', updatedBy: 'Lan Anh' },
  { code: 'PT-HB-NTU', name: 'Xưởng Hòa Bình · Nam Tân Uyên', kind: 'Điểm giao nhận', country: 'Việt Nam', city: 'Bình Dương', aliases: [], status: 'Chờ duyệt', updated: '18/10', updatedBy: 'Lan Anh', note: 'Chưa có toạ độ GPS' },
];

// ---------- Mã HS, đơn vị tính ----------
export const hsCodes: HsCode[] = [
  { code: '6205.20', desc: 'Áo sơ mi nam, 100% cotton', mfn: '20%', special: 'CPTPP 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '6109.10', desc: 'Áo thun dệt kim, cotton', mfn: '20%', special: 'EVFTA 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '3004.90', desc: 'Thuốc thành phẩm, bảo quản 2–8°C', mfn: '0–5%', vat: '5%', policy: 'Giấy phép Cục Quản lý Dược', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '4412.33', desc: 'Gỗ dán, lõi bạch đàn, dày 18 mm', mfn: '8%', special: 'AKFTA 0%', vat: '10%', policy: 'Hồ sơ lâm sản hợp pháp', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '9403.60', desc: 'Bàn ghế ăn bằng gỗ cao su', mfn: '25%', special: 'AANZFTA 0%', vat: '10%', policy: 'Kiểm dịch thực vật, hun trùng', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '3402.50', desc: 'Nước giặt dạng lỏng 3,8 L', mfn: '22%', special: 'ATIGA 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '1517.90', desc: 'Dầu ăn thực vật 1 L', mfn: '25%', special: 'ATIGA 0%', vat: '10%', policy: 'Kiểm tra an toàn thực phẩm', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '4818.10', desc: 'Giấy vệ sinh cuộn', mfn: '25%', special: 'ATIGA 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '8302.10', desc: 'Bản lề bằng thép', mfn: '10%', special: 'ACFTA 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '8302.42', desc: 'Ray trượt ngăn kéo', mfn: '10%', special: 'ACFTA 0%', vat: '10%', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '0901.11', desc: 'Cà phê nhân chưa rang', mfn: '0%', vat: 'Không chịu thuế', policy: 'Kiểm dịch thực vật (xuất khẩu)', status: 'Chờ duyệt', updated: '19/10', updatedBy: 'Thu Trang' },
];

export const uoms: Uom[] = [
  { code: 'PCE', name: 'Chiếc', kind: 'Đếm', customsCode: 'PCE', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'SET', name: 'Bộ', kind: 'Đếm', customsCode: 'SET', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'CTN', name: 'Thùng carton', kind: 'Đếm', customsCode: 'CT', convert: 'Số chiếc / thùng khai theo từng mã hàng', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'PLT', name: 'Pallet', kind: 'Đếm', customsCode: 'PX', convert: 'Kho Tân Uyên: 1 pallet ≈ 1,2 m³', status: 'Đang dùng', updated: '10/10', updatedBy: 'Quang Minh' },
  { code: 'BDL', name: 'Kiện bó', kind: 'Đếm', customsCode: 'BE', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'KGM', name: 'Kilogram', kind: 'Khối lượng', customsCode: 'KGM', convert: '1 tấn = 1.000 kg', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'CW', name: 'Kg tính cước (hàng không)', kind: 'Khối lượng', customsCode: '—', convert: 'Lấy số lớn hơn giữa kg thực và m³ × 167', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'MTQ', name: 'Mét khối (CBM)', kind: 'Thể tích', customsCode: 'MTQ', convert: 'LCL: 1 CBM ≈ 1.000 kg khi tính cước', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: 'LTR', name: 'Lít', kind: 'Thể tích', customsCode: 'LTR', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '20GP', name: 'Container 20 feet', kind: 'Container', customsCode: '—', convert: '1 TEU', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '40HC', name: 'Container 40 feet cao', kind: 'Container', customsCode: '—', convert: '2 TEU', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
  { code: '40RF', name: 'Container 40 feet lạnh', kind: 'Container', customsCode: '—', convert: '2 TEU', status: 'Đang dùng', updated: '01/01', updatedBy: 'Hệ thống' },
];

// ---------- Biểu phí chuẩn (giá bán), khớp mức đang dùng trong job ----------
export const TARIFF_VERSION = { name: 'Biểu phí chuẩn 2026 · v3', from: '01/10/2026', approvedBy: 'Hoàng Minh' };

const t = (code: string, name: string, group: string, unit: string, currency: 'USD' | 'VND', price: number, floor: number, modes: string, extra: Partial<TariffItem> = {}): TariffItem => ({
  code, name, group, unit, currency, price, floor, modes, vat: currency === 'USD' ? '0%' : '8%', status: 'Đang dùng', updated: '01/10', updatedBy: 'Hoàng Minh', ...extra,
});

export const tariff: TariffItem[] = [
  t('THC-20', 'THC đầu xuất Hải Phòng · 20GP', 'Phí địa phương đường biển', 'USD/cont', 'USD', 130, 120, 'FCL'),
  t('THC-40', 'THC đầu xuất Hải Phòng · 40HC', 'Phí địa phương đường biển', 'USD/cont', 'USD', 195, 180, 'FCL', {
    proposal: { price: 205, from: '01/11/2026', by: 'Quốc Bảo', reason: 'Cảng Tân Vũ tăng phí nâng hạ từ 01/11' },
  }),
  t('SEAL', 'Seal container', 'Phí địa phương đường biển', 'USD/cont', 'USD', 10, 10, 'FCL'),
  t('BL', 'Phí chứng từ (B/L)', 'Phí địa phương đường biển', 'USD/bộ', 'USD', 40, 35, 'FCL, LCL'),
  t('TLX', 'Telex release', 'Phí địa phương đường biển', 'USD/bộ', 'USD', 45, 40, 'FCL, LCL'),
  t('DO-IMP', 'Phí D/O, CIC, THC đầu nhập · 40HC', 'Phí địa phương đường biển', 'USD/cont', 'USD', 365, 340, 'FCL nhập'),
  t('AWB', 'Phí AWB', 'Hàng không', 'USD/bộ', 'USD', 30, 25, 'Air'),
  t('LOGGER', 'Data logger nhiệt độ', 'Hàng không', 'USD/chiếc', 'USD', 50, 45, 'Air hàng lạnh'),
  t('CUS-EXP', 'Khai hải quan xuất', 'Hải quan', 'USD/tờ khai', 'USD', 50, 40, 'Mọi loại hình'),
  t('CUS-IMP', 'Khai hải quan nhập', 'Hải quan', 'USD/tờ khai', 'USD', 60, 50, 'Mọi loại hình'),
  t('TRK-CLTU', 'Kéo container Cát Lái – Tân Uyên', 'Vận tải nội địa', 'đ/cont', 'VND', 2800000, 2600000, 'FTL, Kho'),
  t('LIFT', 'Phí nâng hạ tại kho khách', 'Vận tải nội địa', 'đ/cont', 'VND', 450000, 400000, 'FTL'),
  t('WH-IN', 'Nhập kho, xếp kệ', 'Kho', 'đ/thùng', 'VND', 5000, 4500, 'Kho'),
  t('WH-STO', 'Lưu kho thường', 'Kho', 'đ/pallet/ngày', 'VND', 9000, 8000, 'Kho'),
  t('WH-COLD', 'Lưu kho lạnh 2–8°C', 'Kho', 'đ/pallet/ngày', 'VND', 28000, 25000, 'Kho', {
    proposal: { price: 30000, from: '01/11/2026', by: 'Quang Minh', reason: 'Giá điện sản xuất tăng 4,8%' },
  }),
  t('WH-LBL', 'Dán nhãn phụ', 'Kho', 'đ/chiếc', 'VND', 600, 500, 'Kho', { status: 'Ngừng dùng', updated: '30/09' }),
];
