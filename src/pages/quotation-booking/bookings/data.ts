import type { StatItem } from '../../../types';
import type { Booking } from '../types';

export const bookingStats: StatItem[] = [
  { label: 'Booking đang mở', value: '46', note: '12 chờ hãng xác nhận', module: 'FMS' },
  { label: 'Cut-off SI trong 48 giờ', value: '9', note: '3 job chưa gửi SI', noteTone: 'amber', module: 'FMS' },
  { label: 'Tàu / chuyến bay khởi hành tuần này', value: '14', note: '8 tàu, 6 chuyến bay' },
  { label: 'Hãng xác nhận trong 24 giờ', value: '87%', note: 'Mục tiêu 90%', noteTone: 'amber' },
];

export const bookings: Booking[] = [
  {
    code: 'BK-2610-0088', carrierRef: 'EGLV142600881', quotation: 'BG-2609-0240', job: 'HPH-SEA-2610-0142',
    customer: 'Dệt Minh Phát', mode: 'FCL', carrier: 'Evergreen', vessel: 'ORIENT STAR V.112E',
    pol: 'Hải Phòng', pod: 'Los Angeles', equipment: '2 × 40HC', etd: '21/10', eta: '12/11', status: 'Đã mở job', requestedAt: '01/10 · 09:10',
    cutoffs: [
      { label: 'Cut-off SI', time: '12:00 hôm nay', tone: 'red' },
      { label: 'Cut-off VGM', time: '17:00 hôm nay', tone: 'amber' },
      { label: 'Cut-off hạ bãi (CY)', time: '20/10 · 17:00' },
    ],
    containers: [
      { no: 'EITU 148203-6', type: '40HC', seal: 'EMCV482931', status: 'Đã đóng hàng' },
      { no: 'EGHU 902117-3', type: '40HC', status: 'Đang đóng hàng' },
    ],
    milestones: [
      { label: 'Gửi booking request', meta: '01/10 · 09:10', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '02/10 · 14:30', state: 'done' },
      { label: 'Mở job HPH-SEA-2610-0142', meta: '02/10 · 15:00', state: 'done' },
      { label: 'Lấy container rỗng', meta: '17/10', state: 'done' },
      { label: 'Gửi Shipping Instruction', meta: 'Cut-off 12:00 hôm nay', state: 'late' },
      { label: 'Khai VGM, hạ bãi', meta: 'Trước 20/10 · 17:00', state: 'todo' },
      { label: 'Tàu chạy', meta: 'ETD 21/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0094', carrierRef: 'YMLU260094551', job: 'HPH-SEA-2610-0150',
    customer: 'Dệt Minh Phát', mode: 'FCL', carrier: 'Yang Ming', vessel: 'YM WELLNESS V.087E',
    pol: 'Hải Phòng', pod: 'Long Beach', equipment: '1 × 40HC', etd: '24/10', eta: '16/11', status: 'Đã mở job', requestedAt: '08/10 · 10:40',
    cutoffs: [
      { label: 'Cut-off SI', time: '22/10 · 12:00' },
      { label: 'Cut-off VGM', time: '22/10 · 17:00' },
      { label: 'Cut-off hạ bãi (CY)', time: '23/10 · 17:00' },
    ],
    containers: [{ no: 'YMMU 650218-4', type: '40HC', status: 'Chờ lấy rỗng' }],
    milestones: [
      { label: 'Gửi booking request', meta: '08/10 · 10:40', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '09/10 · 09:15', state: 'done' },
      { label: 'Mở job HPH-SEA-2610-0150', meta: '09/10 · 09:30', state: 'done' },
      { label: 'Lấy container rỗng', meta: 'Kế hoạch 20/10', state: 'doing' },
      { label: 'Gửi Shipping Instruction', meta: 'Cut-off 22/10 · 12:00', state: 'todo' },
      { label: 'Tàu chạy', meta: 'ETD 24/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0083', carrierRef: 'CMAU2610083', job: 'HPH-SEA-2610-0131',
    customer: 'Nội thất Hòa Bình', mode: 'FCL', carrier: 'CMA CGM', vessel: 'CMA CGM TAGE V.0QJ7S',
    pol: 'Hải Phòng', pod: 'Sydney', equipment: '3 × 40HC', etd: '23/10', eta: '09/11', status: 'Đã mở job', requestedAt: '06/10 · 15:20',
    cutoffs: [
      { label: 'Cut-off SI', time: '21/10 · 12:00', tone: 'amber' },
      { label: 'Cut-off VGM', time: '21/10 · 17:00' },
      { label: 'Cut-off hạ bãi (CY)', time: '22/10 · 17:00' },
    ],
    containers: [
      { no: 'CMAU 731045-2', type: '40HC', status: 'Đã đóng hàng' },
      { no: 'CMAU 731112-9', type: '40HC', status: 'Đã đóng hàng' },
      { no: 'TGHU 840273-1', type: '40HC', status: 'Đang đóng hàng' },
    ],
    milestones: [
      { label: 'Gửi booking request', meta: '06/10 · 15:20', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '07/10 · 10:00', state: 'done' },
      { label: 'Mở job HPH-SEA-2610-0131', meta: '07/10 · 10:20', state: 'done' },
      { label: 'Lấy container rỗng', meta: '16/10', state: 'done' },
      { label: 'Khai hải quan xuất', meta: 'Đang hoàn thiện hồ sơ', state: 'doing' },
      { label: 'Gửi Shipping Instruction', meta: 'Cut-off 21/10 · 12:00', state: 'todo' },
      { label: 'Tàu chạy', meta: 'ETD 23/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0097', carrierRef: 'MAWB 020-4471 8835', job: 'HCM-AIR-2610-0087',
    customer: 'Dược An Khang', mode: 'AIR', carrier: 'Lufthansa Cargo', vessel: 'LH8405 · 20/10 23:45',
    pol: 'Tân Sơn Nhất', pod: 'Frankfurt', equipment: '1.240 kg · 18 kiện', etd: '20/10', eta: '21/10', status: 'Đã mở job', requestedAt: '14/10 · 11:00',
    cutoffs: [
      { label: 'Nộp chứng từ', time: '20/10 · 15:00', tone: 'amber' },
      { label: 'Hạ hàng tại TCS', time: '20/10 · 17:45' },
    ],
    containers: [],
    milestones: [
      { label: 'Gửi booking request', meta: '14/10 · 11:00', state: 'done' },
      { label: 'Hãng xác nhận chỗ', meta: '14/10 · 16:40', state: 'done' },
      { label: 'Mở job HCM-AIR-2610-0087', meta: '14/10 · 17:00', state: 'done' },
      { label: 'Đối chiếu Invoice và Packing List', meta: 'OCR lệch 2 dòng', state: 'doing' },
      { label: 'Hạ hàng tại TCS', meta: '20/10 · 17:45', state: 'todo' },
      { label: 'Cất cánh', meta: '20/10 · 23:45', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0079', carrierRef: 'HDMUHPHA2610079', job: 'HPH-SEA-2610-0118',
    customer: 'Gỗ Lâm Phát', mode: 'FCL', carrier: 'HMM', vessel: 'HMM BLESSING V.045E',
    pol: 'Hải Phòng', pod: 'Busan', equipment: '1 × 20GP', etd: '17/10', eta: '22/10', status: 'Đã mở job', requestedAt: '05/10 · 08:50',
    cutoffs: [{ label: 'Tàu đã chạy', time: '17/10 · 06:00' }],
    containers: [{ no: 'HDMU 212094-7', type: '20GP', seal: 'HMM3390211', status: 'Đã lên tàu' }],
    milestones: [
      { label: 'Gửi booking request', meta: '05/10 · 08:50', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '05/10 · 16:00', state: 'done' },
      { label: 'Mở job HPH-SEA-2610-0118', meta: '06/10', state: 'done' },
      { label: 'Gửi Shipping Instruction', meta: '15/10', state: 'done' },
      { label: 'Tàu chạy', meta: '17/10 · 06:00', state: 'done' },
      { label: 'Phát hành B/L', meta: 'Khách yêu cầu sửa B/L draft', state: 'late' },
      { label: 'Tàu đến', meta: 'ETA 22/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0099', carrierRef: 'MAEU263310099', customer: 'Thực phẩm Sao Việt', mode: 'FCL', carrier: 'Maersk', vessel: 'MAERSK SEMBAWANG V.243N',
    pol: 'Cát Lái', pod: 'Hong Kong', equipment: '1 × 40RF · −18°C', etd: '26/10', eta: '29/10', status: 'Đã xác nhận', requestedAt: '16/10 · 14:00',
    cutoffs: [
      { label: 'Cut-off SI', time: '24/10 · 12:00' },
      { label: 'Cut-off hạ bãi (CY)', time: '25/10 · 12:00' },
    ],
    containers: [],
    note: 'Hãng đã xác nhận, cần mở job và đặt lệnh lấy container lạnh.',
    milestones: [
      { label: 'Gửi booking request', meta: '16/10 · 14:00', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '17/10 · 10:20', state: 'done' },
      { label: 'Mở job', meta: 'Chưa mở', state: 'doing' },
      { label: 'Lấy container lạnh', state: 'todo' },
      { label: 'Tàu chạy', meta: 'ETD 26/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0103', customer: 'Nội thất Hòa Bình', mode: 'FCL', carrier: 'ONE', vessel: 'ONE CONTRIBUTION V.051N',
    pol: 'Cát Lái', pod: 'Tokyo', equipment: '2 × 40HC', etd: '30/10', eta: '08/11', status: 'Chờ hãng xác nhận', requestedAt: '18/10 · 16:45',
    cutoffs: [{ label: 'Hạn hãng phản hồi', time: '20/10 · 12:00' }],
    containers: [],
    note: 'Hãng báo tàu ngày 30/10 gần kín chỗ, có thể chuyển sang chuyến 03/11.',
    milestones: [
      { label: 'Gửi booking request', meta: '18/10 · 16:45', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: 'Chờ phản hồi', state: 'doing' },
      { label: 'Mở job', state: 'todo' },
      { label: 'Tàu chạy', meta: 'ETD 30/10', state: 'todo' },
    ],
  },
  {
    code: 'BK-2610-0086', customer: 'Gỗ Lâm Phát', mode: 'FCL', carrier: 'Sinokor', vessel: 'SINOKOR AKITA V.2611N',
    pol: 'Hải Phòng', pod: 'Incheon', equipment: '2 × 20GP', etd: '19/10', eta: '25/10', status: 'Đã hủy', requestedAt: '07/10 · 09:00',
    cutoffs: [],
    containers: [],
    note: 'Khách hoãn lô hàng chờ chốt giá mới (BG-2610-0277). Đã báo hủy với hãng 12/10, không mất phí.',
    milestones: [
      { label: 'Gửi booking request', meta: '07/10 · 09:00', state: 'done' },
      { label: 'Hãng xác nhận booking', meta: '07/10 · 15:30', state: 'done' },
      { label: 'Hủy booking', meta: '12/10 · 10:00', state: 'rejected' },
    ],
  },
];
