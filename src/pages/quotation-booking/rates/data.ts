import type { StatItem } from '../../../types';
import type { Charge, FreightMode, FreightRate } from '../types';

export const rateStats: StatItem[] = [
  { label: 'Giá đang hiệu lực', value: '342', note: 'FCL 214 · LCL 46 · Air 82' },
  { label: 'Sắp hết hiệu lực · 14 ngày', value: '18', note: 'Cần lấy giá mới từ hãng', valueTone: 'amber', noteTone: 'amber' },
  { label: 'Tuyến có giá', value: '64', note: '12 hãng tàu, 6 hãng bay' },
  { label: 'Cập nhật tuần này', value: '27', note: 'Gần nhất: MSC Cát Lái → Hamburg' },
];

/** Tiêu đề các cột giá theo loại hình, khớp thứ tự với `FreightRate.prices` */
export const rateColumns: Record<FreightMode, string[]> = {
  FCL: ['20GP', '40GP', '40HC'],
  LCL: ['W/M', 'Tối thiểu'],
  AIR: ['+45 kg', '+100 kg', '+300 kg', '+500 kg'],
};

export const rateUnit: Record<FreightMode, string> = {
  FCL: 'USD/cont',
  LCL: 'USD/CBM',
  AIR: 'USD/kg',
};

const fclSurcharges: Charge[] = [
  { name: 'BAF / LSS – phụ phí nhiên liệu', basis: "USD · 20'/40'", amount: '120 / 240' },
  { name: 'EBS – phụ phí khẩn cấp', basis: "USD · 20'/40'", amount: '50 / 100' },
  { name: 'PSS – phụ phí mùa cao điểm', basis: "USD · 20'/40'", amount: 'Từ 01/11: 200 / 400' },
];

const fclLocal: Charge[] = [
  { name: 'THC – xếp dỡ tại cảng đi', basis: "USD · 20'/40'", amount: '130 / 195' },
  { name: 'Seal', basis: 'USD/cont', amount: '10' },
  { name: 'Phí chứng từ (B/L)', basis: 'USD/bộ', amount: '40' },
  { name: 'Telex release', basis: 'USD/bộ', amount: '45' },
];

const lclSurcharges: Charge[] = [
  { name: 'CFS tại kho gom hàng', basis: 'USD/CBM', amount: '12' },
  { name: 'LSS – phụ phí nhiên liệu', basis: 'USD/CBM', amount: '8' },
];

const lclLocal: Charge[] = [
  { name: 'THC LCL', basis: 'USD/CBM', amount: '9' },
  { name: 'Phí chứng từ (B/L)', basis: 'USD/bộ', amount: '35' },
  { name: 'Lưu kho CFS sau 5 ngày', basis: 'USD/CBM/ngày', amount: '1,5' },
];

const airSurcharges: Charge[] = [
  { name: 'FSC – phụ phí nhiên liệu', basis: 'USD/kg', amount: '1,05' },
  { name: 'SSC – phụ phí an ninh', basis: 'USD/kg', amount: '0,15' },
];

const airLocal: Charge[] = [
  { name: 'Soi chiếu (X-ray)', basis: 'USD/kg', amount: '0,05 · tối thiểu 15' },
  { name: 'Phí AWB', basis: 'USD/bộ', amount: '25' },
  { name: 'Xử lý hàng tại TCS', basis: 'USD/kg', amount: '0,08' },
];

const fcl = (r: Omit<FreightRate, 'mode' | 'surcharges' | 'localCharges'>): FreightRate => ({
  ...r, mode: 'FCL', surcharges: fclSurcharges, localCharges: fclLocal,
});
const lcl = (r: Omit<FreightRate, 'mode' | 'surcharges' | 'localCharges'>): FreightRate => ({
  ...r, mode: 'LCL', surcharges: lclSurcharges, localCharges: lclLocal,
});
const air = (r: Omit<FreightRate, 'mode' | 'surcharges' | 'localCharges'>): FreightRate => ({
  ...r, mode: 'AIR', surcharges: airSurcharges, localCharges: airLocal,
});

export const rates: FreightRate[] = [
  fcl({ id: 'R-FCL-001', carrier: 'MSC', pol: 'Cát Lái', pod: 'Hamburg', transit: '28 ngày', frequency: 'Thứ 5 hằng tuần',
    validFrom: '15/10/2026', validTo: '14/11/2026', freeTime: '14 ngày DEM/DET tại Hamburg', prices: [1520, 2500, 2520], updatedAt: '16/10 · Thu Trang' }),
  fcl({ id: 'R-FCL-002', carrier: 'ONE', pol: 'Cát Lái', pod: 'Hamburg', via: 'Singapore', transit: '32 ngày', frequency: 'Thứ 4 hằng tuần',
    validFrom: '01/10/2026', validTo: '31/10/2026', expiring: true, freeTime: '10 ngày DEM/DET tại Hamburg', prices: [1450, 2380, 2400],
    updatedAt: '01/10 · Quốc Bảo', note: 'Chuyển tải Singapore, rẻ hơn tuyến thẳng khoảng 5%.' }),
  fcl({ id: 'R-FCL-003', carrier: 'Evergreen', pol: 'Hải Phòng', pod: 'Los Angeles', via: 'Kaohsiung', transit: '22 ngày', frequency: 'Thứ 2, Thứ 5',
    validFrom: '01/10/2026', validTo: '31/10/2026', expiring: true, freeTime: '7 ngày DEM/DET tại Los Angeles', prices: [2150, 2850, 2900], updatedAt: '30/09 · Quốc Bảo' }),
  fcl({ id: 'R-FCL-004', carrier: 'Yang Ming', pol: 'Hải Phòng', pod: 'Savannah', via: 'Busan', transit: '38 ngày', frequency: 'Thứ 6 hằng tuần',
    validFrom: '15/10/2026', validTo: '15/11/2026', freeTime: '7 ngày DEM/DET tại Savannah', prices: [3100, 3950, 4000], updatedAt: '15/10 · Quốc Bảo' }),
  fcl({ id: 'R-FCL-005', carrier: 'HMM', pol: 'Hải Phòng', pod: 'Busan', transit: '5 ngày', frequency: 'Thứ 3, Thứ 6',
    validFrom: '01/10/2026', validTo: '30/11/2026', freeTime: '10 ngày DEM/DET tại Busan', prices: [280, 450, 460], updatedAt: '01/10 · Thu Trang' }),
  fcl({ id: 'R-FCL-006', carrier: 'Sinokor', pol: 'Hải Phòng', pod: 'Incheon', transit: '6 ngày', frequency: 'Thứ 2 hằng tuần',
    validFrom: '01/10/2026', validTo: '30/11/2026', freeTime: '10 ngày DEM/DET tại Incheon', prices: [300, 520, 520], updatedAt: '02/10 · Thu Trang' }),
  fcl({ id: 'R-FCL-007', carrier: 'CMA CGM', pol: 'Cát Lái', pod: 'Melbourne', transit: '16 ngày', frequency: 'Thứ 7 hằng tuần',
    validFrom: '01/10/2026', validTo: '31/12/2026', freeTime: '14 ngày DEM/DET tại Melbourne', prices: [980, 1650, 1680], updatedAt: '14/10 · Quốc Bảo' }),
  fcl({ id: 'R-FCL-008', carrier: 'ONE', pol: 'Cát Lái', pod: 'Tokyo', transit: '9 ngày', frequency: 'Thứ 3, Thứ 6',
    validFrom: '01/10/2026', validTo: '31/10/2026', expiring: true, freeTime: '7 ngày DEM/DET tại Tokyo', prices: [420, 680, 700], updatedAt: '01/10 · Quốc Bảo' }),

  lcl({ id: 'R-LCL-001', carrier: 'CFS Sài Gòn (co-loader)', pol: 'Cát Lái', pod: 'Rotterdam', via: 'Singapore', transit: '34 ngày', frequency: 'Đóng hàng Thứ 3',
    validFrom: '01/10/2026', validTo: '31/12/2026', freeTime: '5 ngày lưu kho CFS tại Rotterdam', prices: [38, 76], updatedAt: '01/10 · Lan Anh' }),
  lcl({ id: 'R-LCL-002', carrier: 'CFS Hải Phòng (co-loader)', pol: 'Hải Phòng', pod: 'Singapore', transit: '7 ngày', frequency: 'Đóng hàng Thứ 5',
    validFrom: '01/10/2026', validTo: '31/10/2026', expiring: true, freeTime: '5 ngày lưu kho CFS tại Singapore', prices: [12, 24], updatedAt: '01/10 · Lan Anh' }),
  lcl({ id: 'R-LCL-003', carrier: 'CFS Sài Gòn (co-loader)', pol: 'Cát Lái', pod: 'Los Angeles', transit: '26 ngày', frequency: 'Đóng hàng Thứ 2',
    validFrom: '15/10/2026', validTo: '15/12/2026', freeTime: '5 ngày lưu kho CFS tại Los Angeles', prices: [55, 110], updatedAt: '15/10 · Lan Anh' }),

  air({ id: 'R-AIR-001', carrier: 'Lufthansa Cargo', pol: 'Tân Sơn Nhất', pod: 'Frankfurt', transit: '1 ngày', frequency: 'Hằng ngày',
    validFrom: '01/10/2026', validTo: '31/10/2026', expiring: true, freeTime: '48 giờ lưu kho tại FRA', prices: [4.1, 3.65, 3.2, 2.95], updatedAt: '01/10 · Lan Anh' }),
  air({ id: 'R-AIR-002', carrier: 'KLM Cargo', pol: 'Tân Sơn Nhất', pod: 'Amsterdam', transit: '1 ngày', frequency: 'Thứ 2, 4, 6',
    validFrom: '01/10/2026', validTo: '30/11/2026', freeTime: '48 giờ lưu kho tại AMS', prices: [4.3, 3.8, 3.35, 3.1], updatedAt: '03/10 · Lan Anh',
    note: 'Nhận hàng lạnh 2–8°C, cần đặt trước container Envirotainer 72 giờ.' }),
  air({ id: 'R-AIR-003', carrier: 'China Eastern', pol: 'Thượng Hải', pod: 'Nội Bài', transit: '1 ngày', frequency: 'Hằng ngày',
    validFrom: '15/10/2026', validTo: '15/12/2026', freeTime: '72 giờ lưu kho tại NBA', prices: [2.4, 2.1, 1.85, 1.7], updatedAt: '15/10 · Quốc Bảo' }),
  air({ id: 'R-AIR-004', carrier: 'Swiss WorldCargo', pol: 'Tân Sơn Nhất', pod: 'Zurich', via: 'Singapore', transit: '2 ngày', frequency: 'Thứ 3, 5, 7',
    validFrom: '01/10/2026', validTo: '31/12/2026', freeTime: '48 giờ lưu kho tại ZRH', prices: [4.8, 4.25, 3.9, 3.6], updatedAt: '10/10 · Lan Anh' }),
];
