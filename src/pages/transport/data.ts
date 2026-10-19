import type { ContainerRec, Contractor, Pod, TransportOrder, Trip, Vehicle } from './types';

/** Hôm nay theo dữ liệu mẫu (19/10/2026, 08:15) */
export const TODAY = '19/10';
export const NOW_HOUR = 8.25;

export const vehicles: Vehicle[] = [
  { plate: '15C-218.46', type: 'Đầu kéo', owner: 'Nội bộ', driver: 'Phạm Văn Hùng', phone: '0912 448 201', status: 'Sẵn sàng', location: 'Bãi xe Đình Vũ', region: 'Hải Phòng' },
  { plate: '15C-302.19', type: 'Đầu kéo', owner: 'Nội bộ', driver: 'Trần Quốc Toản', phone: '0904 772 615', status: 'Đang chạy', location: 'QL5, Cẩm Giàng, Hải Dương', region: 'Hải Phòng' },
  { plate: '15C-410.07', type: 'Đầu kéo', owner: 'Vận tải Đông Á', driver: 'Nguyễn Văn Bình', phone: '0983 210 447', status: 'Sẵn sàng', location: 'Đình Vũ', region: 'Hải Phòng' },
  { plate: '15C-118.20', type: 'Đầu kéo', owner: 'Hải Phòng Logistics Xanh', driver: 'Lương Văn Sáng', phone: '0915 600 382', status: 'Sẵn sàng', location: 'Cảng Lạch Huyện', region: 'Hải Phòng' },
  { plate: '51C-390.44', type: 'Đầu kéo', owner: 'Nội bộ', driver: 'Võ Văn Lực', phone: '0908 315 772', status: 'Đang chạy', location: 'QL1A, Bến Lức, Long An', region: 'TP.HCM' },
  { plate: '51C-482.17', type: 'Đầu kéo', owner: 'Vận tải Đông Á', driver: 'Đỗ Minh Tâm', phone: '0937 118 064', status: 'Sẵn sàng', location: 'Depot Phước Long', region: 'TP.HCM' },
  { plate: '51D-118.92', type: 'Xe tải lạnh', owner: 'Nội bộ', driver: 'Lê Hoàng Phúc', phone: '0918 227 490', status: 'Sẵn sàng', location: 'Bãi xe Tân Bình', region: 'TP.HCM' },
  { plate: '51D-207.33', type: 'Xe tải lạnh', owner: 'Sài Gòn Lạnh', driver: 'Ngô Thanh Hải', phone: '0909 560 128', status: 'Sẵn sàng', location: 'Bình Chánh', region: 'TP.HCM' },
  { plate: '51C-615.08', type: 'Xe tải', owner: 'Nội bộ', driver: 'Huỳnh Văn Khoa', phone: '0933 802 115', status: 'Bảo dưỡng', location: 'Xưởng Thủ Đức', region: 'TP.HCM' },
  { plate: '61C-224.18', type: 'Xe tải', owner: 'Bình Dương Trans', driver: 'Trịnh Văn Đức', phone: '0976 441 230', status: 'Sẵn sàng', location: 'Tân Uyên', region: 'TP.HCM' },
];

export const findVehicle = (plate?: string) => vehicles.find((v) => v.plate === plate);

const SV_CONTRACT = 'HĐ-2025-093';

export const orders: TransportOrder[] = [
  // ----- Hải Phòng -----
  { code: 'TO-2610-0346', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', kind: 'Bấm seal, kiểm tra container', from: 'Văn phòng Hải Phòng', to: 'Kho Dệt Minh Phát – Hải Dương', cargo: 'Seal EMCV482932', container: 'EGHU 902117-3', needs: 'Đầu kéo', region: 'Hải Phòng', date: '19/10', start: 7.5, end: 10.5, distanceKm: 62, vehicle: '15C-302.19', trip: 'TR-2610-0419', status: 'Đang chạy' },
  { code: 'TO-2610-0340', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', kind: 'Hạ bãi container hàng', from: 'Kho Dệt Minh Phát – Hải Dương', to: 'Cảng Tân Vũ', cargo: '1 × 40HC', container: 'EITU 148203-6', needs: 'Đầu kéo', region: 'Hải Phòng', date: '20/10', start: 8, end: 10.5, distanceKm: 70, vehicle: '15C-218.46', status: 'Đã điều xe' },
  { code: 'TO-2610-0341', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', kind: 'Hạ bãi container hàng', from: 'Kho Dệt Minh Phát – Hải Dương', to: 'Cảng Tân Vũ', cargo: '1 × 40HC', container: 'EGHU 902117-3', needs: 'Đầu kéo', region: 'Hải Phòng', date: '20/10', start: 10, end: 12.5, distanceKm: 70, vehicle: '15C-302.19', status: 'Đã điều xe', note: 'Chờ đóng hàng xong' },
  { code: 'TO-2610-0355', job: 'HPH-SEA-2610-0131', customer: 'Nội thất Hòa Bình', kind: 'Hạ bãi container hàng × 3', from: 'Kho Hòa Bình – Hải Phòng', to: 'Cảng Lạch Huyện', cargo: '3 × 40HC', needs: 'Đầu kéo', region: 'Hải Phòng', date: '22/10', start: 7, end: 12, distanceKm: 35, status: 'Chờ điều xe' },
  { code: 'TO-2610-0312', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', kind: 'Lấy container rỗng', from: 'Depot Evergreen Đình Vũ', to: 'Kho Dệt Minh Phát – Hải Dương', cargo: '1 × 40HC', container: 'EGHU 902117-3', needs: 'Đầu kéo', region: 'Hải Phòng', date: '18/10', start: 8, end: 11.5, distanceKm: 68, vehicle: '15C-302.19', trip: 'TR-2610-0395', status: 'Hoàn tất' },
  { code: 'TO-2610-0311', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', kind: 'Lấy container rỗng', from: 'Depot Evergreen Đình Vũ', to: 'Kho Dệt Minh Phát – Hải Dương', cargo: '1 × 40HC', container: 'EITU 148203-6', needs: 'Đầu kéo', region: 'Hải Phòng', date: '17/10', start: 7.5, end: 11, distanceKm: 68, vehicle: '15C-218.46', trip: 'TR-2610-0390', status: 'Hoàn tất' },
  { code: 'TO-2610-0301', job: 'HPH-SEA-2610-0131', customer: 'Nội thất Hòa Bình', kind: 'Lấy container rỗng × 3', from: 'Depot CMA Đình Vũ', to: 'Kho Hòa Bình – Hải Phòng', cargo: '3 × 40HC', needs: 'Đầu kéo', region: 'Hải Phòng', date: '16/10', start: 7, end: 15, distanceKm: 42, vehicle: '15C-118.20', status: 'Hoàn tất' },
  { code: 'TO-2610-0288', job: 'HPH-SEA-2610-0118', customer: 'Gỗ Lâm Phát', kind: 'Hạ bãi container hàng', from: 'Kho Lâm Phát – Đình Vũ', to: 'Cảng Tân Vũ', cargo: '1 × 20GP', container: 'HDMU 212094-7', needs: 'Đầu kéo', region: 'Hải Phòng', date: '16/10', start: 9, end: 11, distanceKm: 12, vehicle: '15C-410.07', status: 'Hoàn tất' },

  // ----- TP.HCM -----
  { code: 'TO-2610-0357', contract: SV_CONTRACT, customer: 'Thực phẩm Sao Việt', kind: 'Chạy container lạnh', from: 'KCN Long Hậu, Long An', to: 'Cảng Cát Lái', cargo: '1 × 40RF · −18°C', needs: 'Đầu kéo', region: 'TP.HCM', date: '19/10', start: 6, end: 10, distanceKm: 38, vehicle: '51C-390.44', trip: 'TR-2610-0418', status: 'Đang chạy' },
  { code: 'TO-2610-0359', contract: 'Đơn xuất kho OB-2610-0215', customer: 'Bán lẻ Delta', kind: 'Giao hàng cửa hàng', from: 'Kho Tân Uyên', to: 'Siêu thị Delta Quận 7', cargo: '72 thùng', needs: 'Xe tải', region: 'TP.HCM', date: '19/10', start: 9, end: 12, distanceKm: 45, status: 'Chờ điều xe', note: 'Xe 51C-615.08 đang bảo dưỡng, cần xe nhà thầu' },
  { code: 'TO-2610-0358', contract: SV_CONTRACT, customer: 'Thực phẩm Sao Việt', kind: 'Chạy container lạnh', from: 'KCN Long Hậu, Long An', to: 'Cảng Cát Lái', cargo: '1 × 40RF · −18°C', needs: 'Đầu kéo', region: 'TP.HCM', date: '19/10', start: 13, end: 17, distanceKm: 38, vehicle: '51C-390.44', trip: 'TR-2610-0420', status: 'Đã điều xe' },
  { code: 'TO-2610-0364', contract: 'Đơn xuất kho OB-2610-0216', customer: 'Bán lẻ Delta', kind: 'Giao hàng cửa hàng', from: 'Kho Tân Uyên', to: 'Cửa hàng Delta Thủ Đức', cargo: '58 thùng', needs: 'Xe tải', region: 'TP.HCM', date: '19/10', start: 14, end: 17, distanceKm: 30, status: 'Chờ điều xe' },
  { code: 'TO-2610-0362', job: 'HCM-TRK-2610-0210', customer: 'Thực phẩm Sao Việt', kind: 'Lấy container lạnh rỗng', from: 'Depot Transimex', to: 'KCN Long Hậu, Long An', cargo: '1 × 40RF rỗng', needs: 'Đầu kéo', region: 'TP.HCM', date: '19/10', start: 20, end: 23, distanceKm: 35, status: 'Chờ điều xe', note: 'Hạn gán xe 17:00 hôm nay' },
  { code: 'TO-2610-0360', job: 'HCM-WH-2610-0055', customer: 'Bán lẻ Delta', kind: 'Kéo container hàng × 2', from: 'Cảng Cát Lái', to: 'Kho Tân Uyên', cargo: '2 × 40HC', container: 'LGPU 482193-0', needs: 'Đầu kéo', region: 'TP.HCM', date: '20/10', start: 8, end: 12, distanceKm: 41, status: 'Chờ điều xe', note: 'Container còn 1 ngày miễn phí lưu bãi, chờ lịch hẹn kho' },
  { code: 'TO-2610-0363', job: 'HCM-TRK-2610-0210', customer: 'Thực phẩm Sao Việt', kind: 'Hạ bãi container lạnh', from: 'KCN Long Hậu, Long An', to: 'Cảng Cát Lái', cargo: '1 × 40RF · −18°C', needs: 'Đầu kéo', region: 'TP.HCM', date: '20/10', start: 9, end: 12.5, distanceKm: 38, status: 'Chờ điều xe' },
  { code: 'TO-2610-0352', job: 'HCM-AIR-2610-0087', customer: 'Dược An Khang', kind: 'Lấy hàng lạnh', from: 'Nhà máy An Khang – KCN Hiệp Phước', to: 'Kho TCS Tân Sơn Nhất', cargo: '1.240 kg · 18 kiện · 2–8°C', needs: 'Xe tải lạnh', region: 'TP.HCM', date: '20/10', start: 13, end: 16, distanceKm: 28, vehicle: '51D-118.92', status: 'Đã điều xe' },
  { code: 'TO-2610-0349', contract: 'Đơn xuất kho OB-2610-0208', customer: 'Bán lẻ Delta', kind: 'Giao hàng cửa hàng', from: 'Kho Tân Uyên', to: 'Siêu thị Delta Quận 7', cargo: '86 thùng', needs: 'Xe tải', region: 'TP.HCM', date: '18/10', start: 9, end: 12, distanceKm: 45, vehicle: '51C-615.08', trip: 'TR-2610-0409', status: 'Chờ POD' },
  { code: 'TO-2610-0350', contract: 'Đơn xuất kho OB-2610-0209', customer: 'Bán lẻ Delta', kind: 'Giao hàng cửa hàng', from: 'Kho Tân Uyên', to: 'Cửa hàng Delta Thủ Đức', cargo: '64 thùng', needs: 'Xe tải', region: 'TP.HCM', date: '18/10', start: 13, end: 16, distanceKm: 30, vehicle: '51C-615.08', trip: 'TR-2610-0409', status: 'Chờ POD' },
  { code: 'TO-2610-0347', contract: SV_CONTRACT, customer: 'Thực phẩm Sao Việt', kind: 'Chạy container lạnh', from: 'KCN Long Hậu, Long An', to: 'Cảng Cát Lái', cargo: '1 × 40RF · −18°C', needs: 'Đầu kéo', region: 'TP.HCM', date: '18/10', start: 6, end: 10, distanceKm: 38, vehicle: '51C-390.44', trip: 'TR-2610-0408', status: 'Chờ POD' },
  { code: 'TO-2610-0270', job: 'HCM-TRK-2610-0198', customer: 'Thực phẩm Sao Việt', kind: 'Lấy container và giao hàng', from: 'Cảng Cát Lái', to: 'KCN Mỹ Phước – kho Sao Việt', cargo: '1 × 40HC', container: 'TGHU 552018-3', needs: 'Đầu kéo', region: 'TP.HCM', date: '14/10', start: 8, end: 15.5, distanceKm: 52, vehicle: '51C-482.17', trip: 'TR-2610-0402', status: 'Chờ POD', note: 'Tài xế chưa tải ảnh POD, chặn xuất hóa đơn' },
  { code: 'TO-2610-0271', job: 'HCM-TRK-2610-0198', customer: 'Thực phẩm Sao Việt', kind: 'Trả container rỗng', from: 'KCN Mỹ Phước', to: 'Depot Phước Long', cargo: '1 × 40HC rỗng', container: 'TGHU 552018-3', needs: 'Đầu kéo', region: 'TP.HCM', date: '15/10', start: 8, end: 10, distanceKm: 48, vehicle: '51C-482.17', trip: 'TR-2610-0402', status: 'Hoàn tất' },
  { code: 'TO-2610-0251', job: 'HCM-SEA-2610-0120', customer: 'Nội thất Hòa Bình', kind: 'Giao container hàng', from: 'Cảng Cát Lái', to: 'Kho Hòa Bình – Tân Uyên', cargo: '1 × 40HC', container: 'COSU 624810-3', needs: 'Đầu kéo', region: 'TP.HCM', date: '14/10', start: 7, end: 11, distanceKm: 41, vehicle: '51C-390.44', status: 'Hoàn tất' },
];

export const trips: Trip[] = [
  {
    code: 'TR-2610-0418', vehicle: '51C-390.44', driver: 'Võ Văn Lực', orders: ['TO-2610-0357'], date: '19/10', status: 'Đang chạy', distanceKm: 38,
    gps: { position: 'QL1A, Bến Lức, Long An', updated: '08:12', speed: '46 km/h' },
    stops: [
      { label: 'Nhận lệnh trên Driver App', meta: '05:30', state: 'done' },
      { label: 'Đến KCN Long Hậu', meta: '06:20', state: 'done' },
      { label: 'Đóng hàng xong, cắm điện lạnh −18°C', meta: '07:40', state: 'done' },
      { label: 'Đang chạy về Cát Lái', meta: 'Dự kiến đến 09:30', state: 'doing' },
      { label: 'Hạ bãi, chụp EIR', state: 'todo' },
    ],
    costs: [
      { item: 'Phí BOT 2 lượt', amount: 70000, receipt: true },
      { item: 'Nhiên liệu tạm tính', amount: 620000, receipt: false },
    ],
  },
  {
    code: 'TR-2610-0419', vehicle: '15C-302.19', driver: 'Trần Quốc Toản', orders: ['TO-2610-0346'], date: '19/10', status: 'Đang chạy', distanceKm: 62,
    gps: { position: 'QL5, Cẩm Giàng, Hải Dương', updated: '08:05', speed: '52 km/h' },
    stops: [
      { label: 'Nhận seal tại văn phòng Hải Phòng', meta: '07:50', state: 'done' },
      { label: 'Đang đến kho Hải Dương', meta: 'Dự kiến 08:50', state: 'doing' },
      { label: 'Bấm seal EGHU 902117-3, chụp ảnh', state: 'todo' },
    ],
    costs: [{ item: 'Phí BOT QL5', amount: 45000, receipt: true }],
  },
  {
    code: 'TR-2610-0420', vehicle: '51C-390.44', driver: 'Võ Văn Lực', orders: ['TO-2610-0358'], date: '19/10', status: 'Chưa bắt đầu', distanceKm: 38,
    stops: [
      { label: 'Đến KCN Long Hậu', meta: 'Kế hoạch 13:00', state: 'todo' },
      { label: 'Hạ bãi Cát Lái', meta: 'Kế hoạch 17:00', state: 'todo' },
    ],
    costs: [],
  },
  {
    code: 'TR-2610-0409', vehicle: '51C-615.08', driver: 'Huỳnh Văn Khoa', orders: ['TO-2610-0349', 'TO-2610-0350'], date: '18/10', status: 'Hoàn tất', distanceKm: 75,
    stops: [
      { label: 'Nhận hàng tại kho Tân Uyên', meta: '08:10', state: 'done' },
      { label: 'Giao Siêu thị Delta Quận 7', meta: '11:40 · thiếu 2 thùng', state: 'done' },
      { label: 'Giao Cửa hàng Delta Thủ Đức', meta: '15:20', state: 'done' },
      { label: 'Về bãi', meta: '16:30', state: 'done' },
    ],
    costs: [
      { item: 'Nhiên liệu', amount: 540000, receipt: true },
      { item: 'Phí gửi xe', amount: 30000, receipt: true },
    ],
  },
  {
    code: 'TR-2610-0408', vehicle: '51C-390.44', driver: 'Võ Văn Lực', orders: ['TO-2610-0347'], date: '18/10', status: 'Hoàn tất', distanceKm: 38,
    stops: [
      { label: 'Đến KCN Long Hậu', meta: '06:15', state: 'done' },
      { label: 'Hạ bãi Cát Lái, chụp EIR', meta: '09:50', state: 'done' },
    ],
    costs: [
      { item: 'Phí BOT 2 lượt', amount: 70000, receipt: true },
      { item: 'Nhiên liệu', amount: 610000, receipt: true },
    ],
  },
  {
    code: 'TR-2610-0402', vehicle: '51C-482.17', driver: 'Đỗ Minh Tâm', orders: ['TO-2610-0270', 'TO-2610-0271'], date: '14/10', status: 'Có sự cố', distanceKm: 100,
    incident: 'Giao hàng không chụp POD, chưa có chữ ký người nhận. Hóa đơn của job đang bị chặn.',
    stops: [
      { label: 'Lấy container tại Cát Lái', meta: '14/10 · 08:00', state: 'done' },
      { label: 'Giao hàng KCN Mỹ Phước', meta: '14/10 · 15:30', state: 'done' },
      { label: 'Chụp POD', meta: 'Chưa có', state: 'late' },
      { label: 'Trả rỗng depot Phước Long', meta: '15/10 · 09:20', state: 'done' },
    ],
    costs: [
      { item: 'Phí BOT', amount: 105000, receipt: true },
      { item: 'Phí nâng hạ cảng', amount: 380000, receipt: true },
      { item: 'Nhiên liệu', amount: 890000, receipt: false },
    ],
  },
  {
    code: 'TR-2610-0395', vehicle: '15C-302.19', driver: 'Trần Quốc Toản', orders: ['TO-2610-0312'], date: '18/10', status: 'Hoàn tất', distanceKm: 68,
    stops: [
      { label: 'Lấy rỗng depot Đình Vũ, chụp EIR', meta: '08:20', state: 'done' },
      { label: 'Đến kho Hải Dương', meta: '09:40', state: 'done' },
    ],
    costs: [{ item: 'Phí BOT QL5', amount: 45000, receipt: true }, { item: 'Nhiên liệu', amount: 720000, receipt: true }],
  },
  {
    code: 'TR-2610-0390', vehicle: '15C-218.46', driver: 'Phạm Văn Hùng', orders: ['TO-2610-0311'], date: '17/10', status: 'Hoàn tất', distanceKm: 68,
    stops: [
      { label: 'Lấy rỗng depot Đình Vũ, chụp EIR', meta: '07:55', state: 'done' },
      { label: 'Đến kho Hải Dương', meta: '09:15', state: 'done' },
    ],
    costs: [{ item: 'Phí BOT QL5', amount: 45000, receipt: true }, { item: 'Nhiên liệu', amount: 700000, receipt: true }],
  },
];

export const containers: ContainerRec[] = [
  {
    no: 'LGPU 482193-0', type: '40HC', job: 'HCM-WH-2610-0055', customer: 'Bán lẻ Delta', carrier: 'Logi Line', status: 'Hàng tại bãi cảng', statusTone: 'amber',
    location: 'Cảng Cát Lái · bãi B4', lastMove: '15/10 · dỡ khỏi tàu', freeTime: 'Còn 1 ngày miễn phí lưu bãi', freeTone: 'red',
    eirs: [{ kind: 'Dỡ hàng khỏi tàu', time: '15/10 · 22:40', place: 'Cảng Cát Lái', by: 'Cảng', condition: 'Tốt' }],
  },
  {
    no: 'LGPU 482201-7', type: '40HC', job: 'HCM-WH-2610-0055', customer: 'Bán lẻ Delta', carrier: 'Logi Line', status: 'Hàng tại bãi cảng', statusTone: 'amber',
    location: 'Cảng Cát Lái · bãi B4', lastMove: '15/10 · dỡ khỏi tàu', freeTime: 'Còn 1 ngày miễn phí lưu bãi', freeTone: 'red',
    eirs: [{ kind: 'Dỡ hàng khỏi tàu', time: '15/10 · 22:45', place: 'Cảng Cát Lái', by: 'Cảng', condition: 'Tốt' }],
  },
  {
    no: 'EITU 148203-6', type: '40HC', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', carrier: 'Evergreen', seal: 'EMCV482931', status: 'Đã đóng hàng tại kho', statusTone: 'blue',
    location: 'Kho Dệt Minh Phát – Hải Dương', lastMove: '17/10 · lấy rỗng', freeTime: 'Còn 6 ngày miễn phí lưu container', freeTone: 'green',
    eirs: [{ kind: 'Gate-out rỗng', time: '17/10 · 07:55', place: 'Depot Evergreen Đình Vũ', by: 'Phạm Văn Hùng · Driver App', condition: 'Tốt' }],
  },
  {
    no: 'EGHU 902117-3', type: '40HC', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', carrier: 'Evergreen', status: 'Đang đóng hàng · chưa có seal', statusTone: 'amber',
    location: 'Kho Dệt Minh Phát – Hải Dương', lastMove: '18/10 · lấy rỗng', freeTime: 'Còn 7 ngày miễn phí lưu container', freeTone: 'green',
    eirs: [{ kind: 'Gate-out rỗng', time: '18/10 · 08:20', place: 'Depot Evergreen Đình Vũ', by: 'Trần Quốc Toản · Driver App', condition: 'Tốt' }],
  },
  {
    no: 'TGHU 840273-1', type: '40HC', job: 'HPH-SEA-2610-0131', customer: 'Nội thất Hòa Bình', carrier: 'CMA CGM', status: 'Đang đóng hàng', statusTone: 'amber',
    location: 'Kho Hòa Bình – Hải Phòng', lastMove: '16/10 · lấy rỗng', freeTime: 'Còn 5 ngày miễn phí lưu container', freeTone: 'green',
    eirs: [{ kind: 'Gate-out rỗng', time: '16/10 · 10:30', place: 'Depot CMA Đình Vũ', by: 'Lương Văn Sáng · Driver App', condition: 'Có hư hỏng', note: 'Móp vách phải khoảng 10 cm, đã ghi nhận với depot' }],
  },
  {
    no: 'CMAU 731045-2', type: '40HC', job: 'HPH-SEA-2610-0131', customer: 'Nội thất Hòa Bình', carrier: 'CMA CGM', seal: 'F7712041', status: 'Đã đóng hàng tại kho', statusTone: 'blue',
    location: 'Kho Hòa Bình – Hải Phòng', lastMove: '16/10 · lấy rỗng', freeTime: 'Còn 5 ngày miễn phí lưu container', freeTone: 'green',
    eirs: [{ kind: 'Gate-out rỗng', time: '16/10 · 08:10', place: 'Depot CMA Đình Vũ', by: 'Lương Văn Sáng · Driver App', condition: 'Tốt' }],
  },
  {
    no: 'HDMU 212094-7', type: '20GP', job: 'HPH-SEA-2610-0118', customer: 'Gỗ Lâm Phát', carrier: 'HMM', seal: 'HMM3390211', status: 'Trên tàu', statusTone: 'green',
    location: 'HMM BLESSING V.045E', lastMove: '17/10 · xếp lên tàu',
    eirs: [
      { kind: 'Gate-out rỗng', time: '12/10 · 14:00', place: 'Depot HMM Đình Vũ', by: 'Nguyễn Văn Bình · Driver App', condition: 'Tốt' },
      { kind: 'Gate-in hàng', time: '16/10 · 09:45', place: 'Cảng Tân Vũ', by: 'Nguyễn Văn Bình · Driver App', condition: 'Tốt' },
    ],
  },
  {
    no: 'YMMU 650218-4', type: '40HC', job: 'HPH-SEA-2610-0150', customer: 'Dệt Minh Phát', carrier: 'Yang Ming', status: 'Chờ lấy rỗng', statusTone: 'gray',
    location: 'Depot Yang Ming Đình Vũ', lastMove: '—', eirs: [],
  },
  {
    no: 'TGHU 552018-3', type: '40HC', job: 'HCM-TRK-2610-0198', customer: 'Thực phẩm Sao Việt', carrier: 'Logi Line', status: 'Đã trả rỗng', statusTone: 'green',
    location: 'Depot Phước Long', lastMove: '15/10 · trả rỗng',
    eirs: [
      { kind: 'Gate-out hàng', time: '14/10 · 08:40', place: 'Cảng Cát Lái', by: 'Đỗ Minh Tâm · Driver App', condition: 'Tốt' },
      { kind: 'Gate-in rỗng', time: '15/10 · 09:20', place: 'Depot Phước Long', by: 'Đỗ Minh Tâm · Driver App', condition: 'Tốt' },
    ],
  },
];

export const pods: Pod[] = [
  {
    id: 'POD-2610-0270', order: 'TO-2610-0270', job: 'HCM-TRK-2610-0198', customer: 'Thực phẩm Sao Việt', driver: 'Đỗ Minh Tâm', vehicle: '51C-482.17',
    deliveredAt: '14/10 · 15:30', place: 'KCN Mỹ Phước – kho Sao Việt', photos: 0, signature: false, status: 'Thiếu POD', overdue: 'Trễ 2 ngày · chặn hóa đơn',
    checks: [
      { label: 'GPS khớp địa điểm giao', ok: true, detail: 'Xe dừng tại kho Sao Việt 14:58 – 15:40' },
      { label: 'Có ảnh hàng đã giao', ok: false },
      { label: 'Có chữ ký người nhận', ok: false },
    ],
    note: 'Đã nhắc tài xế 2 lần. Có thể xin khách xác nhận qua email thay POD.',
  },
  {
    id: 'POD-2610-0349', order: 'TO-2610-0349', customer: 'Bán lẻ Delta', driver: 'Huỳnh Văn Khoa', vehicle: '51C-615.08',
    deliveredAt: '18/10 · 11:40', place: 'Siêu thị Delta Quận 7', receiver: 'Phan Thị Hoa · thủ kho', photos: 3, signature: true, status: 'Chờ duyệt',
    checks: [
      { label: 'GPS khớp địa điểm giao', ok: true },
      { label: 'Có chữ ký người nhận', ok: true },
      { label: 'Số kiện khớp lệnh', ok: false, detail: 'Người nhận ghi: nhận 84/86 thùng, thiếu 2 thùng' },
    ],
  },
  {
    id: 'POD-2610-0350', order: 'TO-2610-0350', customer: 'Bán lẻ Delta', driver: 'Huỳnh Văn Khoa', vehicle: '51C-615.08',
    deliveredAt: '18/10 · 15:20', place: 'Cửa hàng Delta Thủ Đức', receiver: 'Lâm Quốc Vinh · cửa hàng trưởng', photos: 2, signature: true, status: 'Chờ duyệt',
    checks: [
      { label: 'GPS khớp địa điểm giao', ok: true },
      { label: 'Có chữ ký người nhận', ok: true },
      { label: 'Số kiện khớp lệnh', ok: true, detail: '64/64 thùng' },
    ],
  },
  {
    id: 'POD-2610-0347', order: 'TO-2610-0347', customer: 'Thực phẩm Sao Việt', driver: 'Võ Văn Lực', vehicle: '51C-390.44',
    deliveredAt: '18/10 · 09:50', place: 'Cảng Cát Lái', receiver: 'Phiếu EIR hạ bãi của cảng', photos: 4, signature: true, status: 'Chờ duyệt',
    checks: [
      { label: 'GPS khớp địa điểm giao', ok: true },
      { label: 'Nhiệt độ giữ −18°C suốt hành trình', ok: true, detail: 'Thấp nhất −19,2°C, cao nhất −17,6°C' },
      { label: 'Số seal khớp lệnh', ok: true },
    ],
  },
  {
    id: 'POD-2610-0251', order: 'TO-2610-0251', job: 'HCM-SEA-2610-0120', customer: 'Nội thất Hòa Bình', driver: 'Võ Văn Lực', vehicle: '51C-390.44',
    deliveredAt: '14/10 · 10:45', place: 'Kho Hòa Bình – Tân Uyên', receiver: 'Đỗ Khải', photos: 3, signature: true, status: 'Đã duyệt',
    checks: [
      { label: 'GPS khớp địa điểm giao', ok: true },
      { label: 'Có chữ ký người nhận', ok: true },
      { label: 'Số kiện khớp lệnh', ok: true },
    ],
  },
];

export const contractors: Contractor[] = [
  {
    code: 'NCC-VT-012', name: 'Vận tải Đông Á', region: 'Hải Phòng, TP.HCM', services: 'Đầu kéo container 20/40', status: 'Đang hợp tác',
    fleet: 42, tripsMonth: 38, onTime: 93, costMonth: 186.4, contract: 'HĐ-NCC-2025-012 · đến 31/12/2026', contact: 'Thanh Tùng · 0903 551 208',
    docs: [
      { name: 'Giấy phép kinh doanh vận tải', expiry: '12/2028', tone: 'green' },
      { name: 'Bảo hiểm trách nhiệm hàng hóa', expiry: '05/11/2026', tone: 'amber' },
    ],
    reconciliation: { period: 'Tháng 10', trips: 38, amount: '186,4 tr ₫', status: 'Chờ duyệt', tone: 'amber' },
    note: 'Có 1 chuyến thiếu POD (TR-2610-0402).',
  },
  {
    code: 'NCC-VT-019', name: 'Sài Gòn Lạnh', region: 'TP.HCM', services: 'Xe tải lạnh 1,5–8 tấn', status: 'Đang hợp tác',
    fleet: 15, tripsMonth: 22, onTime: 97, costMonth: 96.8, contract: 'HĐ-NCC-2026-004 · đến 30/06/2027', contact: 'Kiều Phương · 0938 702 115',
    docs: [
      { name: 'Giấy phép kinh doanh vận tải', expiry: '03/2029', tone: 'green' },
      { name: 'Kiểm định thiết bị làm lạnh', expiry: '01/2027', tone: 'green' },
    ],
    reconciliation: { period: 'Tháng 9', trips: 24, amount: '104,2 tr ₫', status: 'Đã thanh toán', tone: 'green' },
  },
  {
    code: 'NCC-VT-023', name: 'Hải Phòng Logistics Xanh', region: 'Hải Phòng', services: 'Đầu kéo container, rơ-moóc sàn', status: 'Đang hợp tác',
    fleet: 20, tripsMonth: 14, onTime: 88, costMonth: 61.2, contract: 'HĐ-NCC-2026-011 · đến 31/03/2027', contact: 'Bùi Văn Lâm · 0912 330 874',
    docs: [
      { name: 'Giấy phép kinh doanh vận tải', expiry: '08/2027', tone: 'green' },
      { name: 'Đăng kiểm xe 15C-118.20', expiry: '25/10/2026', tone: 'red' },
    ],
    reconciliation: { period: 'Tháng 10', trips: 14, amount: '61,2 tr ₫', status: 'Đang đối soát', tone: 'blue' },
    note: 'Tỷ lệ đúng giờ dưới mục tiêu 90% hai tháng liên tiếp.',
  },
  {
    code: 'NCC-VT-027', name: 'Bình Dương Trans', region: 'TP.HCM, Bình Dương', services: 'Xe tải 1–8 tấn, giao hàng cửa hàng', status: 'Đang hợp tác',
    fleet: 30, tripsMonth: 9, onTime: 95, costMonth: 18.9, contract: 'HĐ-NCC-2026-015 · đến 31/05/2027', contact: 'Trịnh Văn Đức · 0976 441 230',
    docs: [{ name: 'Giấy phép kinh doanh vận tải', expiry: '11/2028', tone: 'green' }],
    reconciliation: { period: 'Tháng 9', trips: 11, amount: '22,6 tr ₫', status: 'Đã thanh toán', tone: 'green' },
  },
  {
    code: 'NCC-VT-031', name: 'Minh Long Container', region: 'Hải Phòng', services: 'Đầu kéo container', status: 'Đang thẩm định',
    fleet: 12, tripsMonth: 0, onTime: 0, costMonth: 0, contract: 'Chưa ký', contact: 'Phan Minh Long · 0904 118 223',
    docs: [
      { name: 'Giấy phép kinh doanh vận tải', expiry: 'Đã nộp, chờ kiểm tra', tone: 'amber' },
      { name: 'Bảo hiểm trách nhiệm hàng hóa', expiry: 'Chưa nộp', tone: 'red' },
    ],
  },
];

// ---------- Báo cáo ----------
export const reportWeeks = ['T35', 'T36', 'T37', 'T38', 'T39', 'T40', 'T41', 'T42'];
export const onTimeByWeek = [93.2, 94.0, 92.4, 95.4, 95.0, 93.6, 95.6, 94.2];

/** Số chuyến 14 ngày gần nhất: xe nội bộ / xe nhà thầu */
export const tripDays = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
export const tripsInternal = [9, 11, 10, 12, 8, 4, 3, 10, 12, 11, 13, 12, 11, 6];
export const tripsContractor = [6, 7, 9, 8, 7, 2, 1, 8, 9, 7, 10, 9, 8, 3];

export const delayReasons = [
  { label: 'Chờ đóng hàng tại kho khách', count: 14 },
  { label: 'Kẹt xe, cấm tải giờ cao điểm', count: 11 },
  { label: 'Chờ lấy container tại cảng / depot', count: 8 },
  { label: 'Thiếu chứng từ, chờ D/O', count: 5 },
  { label: 'Hỏng xe', count: 2 },
];

export const routeCosts = [
  { route: 'Cát Lái → KCN Mỹ Phước', trips: 18, avgCost: 6.8, costPerKm: 26.2 },
  { route: 'KCN Long Hậu → Cát Lái', trips: 24, avgCost: 3.9, costPerKm: 25.7 },
  { route: 'Kho Tân Uyên → cửa hàng Delta', trips: 31, avgCost: 1.6, costPerKm: 21.3 },
  { route: 'Đình Vũ → Hải Dương', trips: 16, avgCost: 4.4, costPerKm: 32.4 },
  { route: 'Kho khách → Cảng Tân Vũ / Lạch Huyện', trips: 22, avgCost: 2.1, costPerKm: 30.0 },
];
