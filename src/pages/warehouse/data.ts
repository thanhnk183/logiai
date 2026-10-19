import type { InboundOrder, OutboundOrder, Sku, StockCount, StockLine, Zone } from './types';

export const WAREHOUSE = 'Kho Tân Uyên';

export const zones: Zone[] = [
  { code: 'A', name: 'Khu A · hàng khô', temp: 'Thường', customer: 'Bán lẻ Delta', racks: 6, bays: 8 },
  { code: 'B', name: 'Khu B · dệt may', temp: 'Thường', customer: 'Dệt Minh Phát', racks: 4, bays: 8 },
  { code: 'C', name: 'Khu C · kho đông', temp: 'Đông −18°C', customer: 'Thực phẩm Sao Việt', racks: 3, bays: 6 },
  { code: 'D', name: 'Khu D · kho mát', temp: 'Mát 2–8°C', customer: 'Dược An Khang', racks: 2, bays: 6 },
];

export const skus: Sku[] = [
  { code: 'DL-DET-0412', name: 'Nước giặt 3,8 L', customer: 'Bán lẻ Delta', uom: 'thùng', packing: '4 can / thùng', temp: 'Thường', minStock: 200 },
  { code: 'DL-DAU-1180', name: 'Dầu ăn 1 L', customer: 'Bán lẻ Delta', uom: 'thùng', packing: '12 chai / thùng', temp: 'Thường', minStock: 150 },
  { code: 'DL-GIA-0210', name: 'Giấy vệ sinh 10 cuộn', customer: 'Bán lẻ Delta', uom: 'thùng', packing: '6 bịch / thùng', temp: 'Thường', minStock: 100 },
  { code: 'DL-SUA-0330', name: 'Sữa tươi 1 L', customer: 'Bán lẻ Delta', uom: 'thùng', packing: '12 hộp / thùng', temp: 'Thường', minStock: 120 },
  { code: 'DL-MI-0075', name: 'Mì gói', customer: 'Bán lẻ Delta', uom: 'thùng', packing: '30 gói / thùng', temp: 'Thường', minStock: 200 },
  { code: 'MP-VAI-2201', name: 'Vải cotton khổ 1,6 m', customer: 'Dệt Minh Phát', uom: 'cuộn', packing: '≈ 50 m / cuộn', temp: 'Thường', minStock: 60 },
  { code: 'MP-VAI-2214', name: 'Vải polyester khổ 1,5 m', customer: 'Dệt Minh Phát', uom: 'cuộn', packing: '≈ 60 m / cuộn', temp: 'Thường', minStock: 40 },
  { code: 'SV-TOM-0510', name: 'Tôm đông lạnh 2 kg', customer: 'Thực phẩm Sao Việt', uom: 'thùng', packing: '10 túi / thùng', temp: 'Đông −18°C', minStock: 80 },
  { code: 'SV-CA-0702', name: 'Cá basa phi lê', customer: 'Thực phẩm Sao Việt', uom: 'thùng', packing: '10 kg / thùng', temp: 'Đông −18°C', minStock: 100 },
  { code: 'AK-VAC-0101', name: 'Vắc xin cúm (hộp 10 liều)', customer: 'Dược An Khang', uom: 'hộp', packing: '10 liều / hộp', temp: 'Mát 2–8°C', minStock: 50 },
  { code: 'AK-INS-0204', name: 'Insulin bút tiêm', customer: 'Dược An Khang', uom: 'hộp', packing: '5 bút / hộp', temp: 'Mát 2–8°C', minStock: 40 },
];

export const findSku = (code: string) => skus.find((s) => s.code === code)!;

export const stock: StockLine[] = [
  { sku: 'DL-DET-0412', location: 'A2-01', lot: 'L2610-03', received: '03/10', expiry: '09/2028', qty: 420, reserved: 30, status: 'Sẵn sàng' },
  { sku: 'DL-DET-0412', location: 'A3-04', lot: 'L2609-11', received: '12/09', expiry: '09/2028', qty: 180, reserved: 0, status: 'Đang kiểm kê' },
  { sku: 'DL-DAU-1180', location: 'A2-03', lot: 'L2610-04', received: '04/10', expiry: '04/2027', qty: 310, reserved: 24, status: 'Sẵn sàng' },
  { sku: 'DL-DAU-1180', location: 'A3-05', lot: 'L2609-14', received: '14/09', expiry: '03/2027', qty: 96, reserved: 0, status: 'Đang kiểm kê' },
  { sku: 'DL-GIA-0210', location: 'A5-01', lot: 'L2610-05', received: '05/10', qty: 150, reserved: 28, status: 'Sẵn sàng' },
  { sku: 'DL-GIA-0210', location: 'A3-07', lot: 'L2609-15', received: '15/09', qty: 40, reserved: 0, status: 'Đang kiểm kê' },
  { sku: 'DL-SUA-0330', location: 'A4-06', lot: 'L2609-20', received: '20/09', expiry: '28/10/2026', qty: 64, reserved: 30, status: 'Cận hạn' },
  { sku: 'DL-MI-0075', location: 'A4-02', lot: 'L2610-01', received: '01/10', expiry: '04/2027', qty: 260, reserved: 18, status: 'Sẵn sàng' },
  { sku: 'MP-VAI-2201', location: 'B1-03', lot: 'L-MP-0918', received: '18/09', qty: 220, reserved: 0, status: 'Sẵn sàng' },
  { sku: 'MP-VAI-2214', location: 'B2-05', lot: 'L-MP-0925', received: '25/09', qty: 85, reserved: 0, status: 'Giữ hàng' },
  { sku: 'SV-TOM-0510', location: 'C1-02', lot: 'L-SV-1012', received: '12/10', expiry: '10/2027', qty: 340, reserved: 0, status: 'Sẵn sàng' },
  { sku: 'SV-CA-0702', location: 'C2-04', lot: 'L-SV-1015', received: '15/10', expiry: '10/2027', qty: 410, reserved: 0, status: 'Sẵn sàng' },
  { sku: 'AK-VAC-0101', location: 'D1-01', lot: 'L-AK-2608', received: '16/10', expiry: '15/12/2026', qty: 120, reserved: 40, status: 'Cận hạn' },
  { sku: 'AK-INS-0204', location: 'D1-03', lot: 'L-AK-2609', received: '16/10', expiry: '06/2027', qty: 36, reserved: 0, status: 'Sẵn sàng' },
];

export const inbounds: InboundOrder[] = [
  {
    code: 'IB-2610-0128', customer: 'Bán lẻ Delta', job: 'HCM-WH-2610-0055', source: '2 × 40HC LGPU 482193-0, LGPU 482201-7 từ Cát Lái',
    appointment: 'Chưa đặt · dự kiến 20/10 09:00', dock: '—', status: 'Chờ lịch hẹn', photos: 0,
    note: 'Container còn 1 ngày miễn phí lưu bãi tại Cát Lái, cần đặt lịch trong hôm nay.',
    lines: [
      { sku: 'DL-DET-0412', expected: 620, received: 0, damaged: 0, location: 'A6-01', putaway: false },
      { sku: 'DL-DAU-1180', expected: 540, received: 0, damaged: 0, location: 'A6-03', putaway: false },
      { sku: 'DL-GIA-0210', expected: 260, received: 0, damaged: 0, location: 'A5-02', putaway: false },
    ],
  },
  {
    code: 'IB-2610-0125', customer: 'Dệt Minh Phát', source: 'Xe khách hàng 51C-207.81', appointment: '19/10 · 07:30', dock: 'Cửa 2',
    status: 'Đang nhận hàng', photos: 3, note: '2 cuộn vải cotton bị ướt khi dỡ hàng, đã chụp ảnh và báo khách.',
    lines: [
      { sku: 'MP-VAI-2201', expected: 120, received: 118, damaged: 2, location: 'B1-04', putaway: false },
      { sku: 'MP-VAI-2214', expected: 60, received: 34, damaged: 0, location: 'B2-06', putaway: false },
    ],
  },
  {
    code: 'IB-2610-0127', customer: 'Thực phẩm Sao Việt', source: 'Xe lạnh 51D-207.33 · Sài Gòn Lạnh', appointment: '18/10 · 21:00', dock: 'Cửa lạnh 5',
    status: 'Chờ cất hàng', photos: 2,
    lines: [
      { sku: 'SV-TOM-0510', expected: 200, received: 200, damaged: 0, location: 'C1-03', putaway: false },
      { sku: 'SV-CA-0702', expected: 150, received: 150, damaged: 0, location: 'C2-05', putaway: true },
    ],
  },
  {
    code: 'IB-2610-0130', customer: 'Bán lẻ Delta', source: 'Xe nhà cung cấp', appointment: '21/10 · 08:00', dock: 'Cửa 1', status: 'Đã hẹn', photos: 0,
    lines: [
      { sku: 'DL-SUA-0330', expected: 300, received: 0, damaged: 0, location: 'A4-07', putaway: false },
      { sku: 'DL-MI-0075', expected: 400, received: 0, damaged: 0, location: 'A4-03', putaway: false },
    ],
  },
  {
    code: 'IB-2610-0122', customer: 'Dược An Khang', source: 'Xe lạnh 51D-118.92', appointment: '16/10 · 10:00', dock: 'Cửa lạnh 6', status: 'Hoàn tất', photos: 2,
    lines: [
      { sku: 'AK-VAC-0101', expected: 120, received: 120, damaged: 0, location: 'D1-01', putaway: true },
      { sku: 'AK-INS-0204', expected: 40, received: 40, damaged: 0, location: 'D1-03', putaway: true },
    ],
  },
];

export const outbounds: OutboundOrder[] = [
  {
    code: 'OB-2610-0215', customer: 'Bán lẻ Delta', destination: 'Siêu thị Delta Quận 7', transportOrder: 'TO-2610-0359', shipAt: '19/10 · 09:00',
    picker: 'Văn Hậu', status: 'Đang soạn hàng', note: 'Lệnh TO-2610-0359 chưa có xe, cần Điều phối gán xe nhà thầu.',
    lines: [
      { sku: 'DL-DET-0412', qty: 30, picked: 30, location: 'A2-01' },
      { sku: 'DL-DAU-1180', qty: 24, picked: 12, location: 'A2-03' },
      { sku: 'DL-MI-0075', qty: 18, picked: 0, location: 'A4-02' },
    ],
  },
  {
    code: 'OB-2610-0213', customer: 'Dược An Khang', destination: 'Nhà phân phối Dược Phương Nam', shipAt: '19/10 · 10:30', picker: 'Thu Hà',
    status: 'Đã đóng gói', note: 'Đóng thùng giữ lạnh 2–8°C, kèm data logger.',
    lines: [{ sku: 'AK-VAC-0101', qty: 40, picked: 40, location: 'D1-01' }],
  },
  {
    code: 'OB-2610-0216', customer: 'Bán lẻ Delta', destination: 'Cửa hàng Delta Thủ Đức', transportOrder: 'TO-2610-0364', shipAt: '19/10 · 14:00',
    status: 'Mới',
    lines: [
      { sku: 'DL-SUA-0330', qty: 30, picked: 0, location: 'A4-06' },
      { sku: 'DL-GIA-0210', qty: 28, picked: 0, location: 'A5-01' },
    ],
  },
  {
    code: 'OB-2610-0208', customer: 'Bán lẻ Delta', destination: 'Siêu thị Delta Quận 7', transportOrder: 'TO-2610-0349', shipAt: '18/10 · 09:00',
    picker: 'Văn Hậu', status: 'Đã xuất', note: 'Cửa hàng báo nhận 84/86 thùng (xem POD-2610-0349).',
    lines: [
      { sku: 'DL-DET-0412', qty: 40, picked: 40, location: 'A3-04' },
      { sku: 'DL-DAU-1180', qty: 30, picked: 30, location: 'A3-05' },
      { sku: 'DL-GIA-0210', qty: 16, picked: 16, location: 'A3-07' },
    ],
  },
  {
    code: 'OB-2610-0209', customer: 'Bán lẻ Delta', destination: 'Cửa hàng Delta Thủ Đức', transportOrder: 'TO-2610-0350', shipAt: '18/10 · 13:00',
    picker: 'Văn Hậu', status: 'Đã xuất',
    lines: [
      { sku: 'DL-SUA-0330', qty: 34, picked: 34, location: 'A4-06' },
      { sku: 'DL-MI-0075', qty: 30, picked: 30, location: 'A4-02' },
    ],
  },
];

export const counts: StockCount[] = [
  {
    code: 'KK-2610-0019', zone: 'Khu A · dãy A3', kind: 'Đột xuất', counter: 'Văn Hậu', date: '18/10', status: 'Chờ duyệt điều chỉnh',
    note: 'Kiểm kê đột xuất sau khi Siêu thị Delta Quận 7 báo thiếu 2 thùng ở đơn OB-2610-0208.',
    lines: [
      { location: 'A3-04', sku: 'DL-DET-0412', system: 180, counted: 172, reason: 'Chưa rõ, đang xem lại camera ngày 18/10' },
      { location: 'A3-05', sku: 'DL-DAU-1180', system: 96, counted: 90, reason: '6 thùng móp, đã chuyển khu hàng lỗi' },
      { location: 'A3-07', sku: 'DL-GIA-0210', system: 40, counted: 40 },
    ],
  },
  {
    code: 'KK-2610-0020', zone: 'Khu C · kho đông', kind: 'Định kỳ', counter: 'Minh Tuấn', date: '19/10', status: 'Đang đếm',
    lines: [
      { location: 'C1-02', sku: 'SV-TOM-0510', system: 340, counted: 340 },
      { location: 'C2-04', sku: 'SV-CA-0702', system: 410 },
    ],
  },
  {
    code: 'KK-2610-0018', zone: 'Khu D · kho mát', kind: 'Định kỳ', counter: 'Thu Hà', date: '15/10', status: 'Đã điều chỉnh',
    lines: [
      { location: 'D1-01', sku: 'AK-VAC-0101', system: 120, counted: 120 },
      { location: 'D1-03', sku: 'AK-INS-0204', system: 36, counted: 36 },
    ],
  },
];

// ---------- Sơ đồ kho ----------
/** Mã vị trí: khu + dãy + ô, ví dụ A3-04 */
export const locCode = (zone: string, rack: number, bay: number) => `${zone}${rack}-${String(bay).padStart(2, '0')}`;

/**
 * Tỷ lệ lấp đầy của một ô kệ (0–1). Ô có hàng trong dữ liệu tồn kho thì lấy theo đó,
 * các ô còn lại sinh cố định theo vị trí để sơ đồ trông như kho thật.
 */
export function bayFill(zone: string, rack: number, bay: number): number {
  const code = locCode(zone, rack, bay);
  const line = stock.find((s) => s.location === code);
  if (line) return Math.min(1, 0.55 + line.qty / 900);
  const z = zone.charCodeAt(0);
  const v = (rack * 37 + bay * 17 + z * 11) % 23;
  if (v < 5) return 0;
  return Math.min(1, v / 22);
}

export const zoneFill = (z: Zone) => {
  let sum = 0;
  for (let r = 1; r <= z.racks; r++) for (let b = 1; b <= z.bays; b++) sum += bayFill(z.code, r, b);
  return Math.round((sum / (z.racks * z.bays)) * 100);
};

// ---------- Báo cáo ----------
export const flowDays = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
export const inboundByDay = [620, 410, 0, 880, 540, 120, 0, 760, 450, 380, 160, 300, 350, 154];
export const outboundByDay = [380, 420, 210, 360, 450, 300, 120, 410, 390, 470, 420, 380, 150, 0];

export const agingBuckets = [
  { label: '0–30 ngày', value: 1870 },
  { label: '31–60 ngày', value: 412 },
  { label: '61–90 ngày', value: 96 },
  { label: 'Trên 90 ngày', value: 58 },
];

export const topMovers = [
  { sku: 'DL-DET-0412', in: 1240, out: 980, days: 14 },
  { sku: 'DL-MI-0075', in: 800, out: 760, days: 10 },
  { sku: 'DL-DAU-1180', in: 940, out: 710, days: 17 },
  { sku: 'SV-CA-0702', in: 560, out: 420, days: 22 },
  { sku: 'AK-VAC-0101', in: 240, out: 200, days: 18 },
];
