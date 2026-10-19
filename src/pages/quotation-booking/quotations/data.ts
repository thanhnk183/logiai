import type { StatItem } from '../../../types';
import type { Quotation, QuoteLine } from '../types';

export const quotationStats: StatItem[] = [
  { label: 'Báo giá đang mở', value: '24', note: '5 chờ duyệt, 11 chờ khách phản hồi' },
  { label: 'Giá trị chờ khách chốt', value: '68.900 USD', note: 'Trong 11 báo giá đã gửi' },
  { label: 'Lãi gộp trung bình · 30 ngày', value: '14,6%', note: 'Ngưỡng tối thiểu 8%', noteTone: 'green' },
  { label: 'Thời gian lập báo giá', value: '3,4 giờ', note: 'Từ lúc nhận RFQ đến khi gửi khách' },
];

/** Người duyệt báo giá cấp trưởng phòng */
export const approver = 'Hoàng Minh · Trưởng phòng kinh doanh';

/** Lãi gộp dưới mức này cần Giám đốc duyệt thêm */
export const MIN_MARGIN = 8;

const l = (item: string, basis: string, qty: number, cost: number, sell: number): QuoteLine => ({ item, basis, qty, cost, sell });

const seaLocal = (port: string, n: number, thcCost: number, thcSell: number): QuoteLine[] => [
  l(`THC ${port}`, 'cont', n, thcCost, thcSell),
  l('Seal', 'cont', n, 8, 10),
  l('Phí chứng từ (B/L)', 'bộ', 1, 35, 40),
  l('Telex release', 'bộ', 1, 40, 45),
];

export const quotations: Quotation[] = [
  {
    code: 'BG-2610-0331', rfq: 'RFQ-2610-0217', customer: 'Cà phê Tây Nguyên', route: 'Cát Lái → Hamburg', mode: 'FCL',
    cargo: '4 × 40HC · cà phê nhân', incoterm: 'FOB Cát Lái', sales: 'Thu Trang', createdAt: '19/10 · 08:40', validTo: '31/10/2026',
    status: 'Chờ duyệt', chosenOption: 0,
    note: 'Khách hỏi thêm phương án qua Singapore nếu rẻ hơn. Tàu cần đi trước 10/11.',
    options: [
      { name: 'Phương án 1 · đi thẳng', carrier: 'MSC', routing: 'Cát Lái → Hamburg', transit: '28 ngày',
        lines: [l('Cước biển 40HC', 'cont', 4, 1972, 2180), ...seaLocal('Cát Lái', 4, 190, 195), l('Phí dịch vụ đại lý', 'lô', 1, 0, 235)] },
      { name: 'Phương án 2 · qua Singapore', carrier: 'ONE', routing: 'Cát Lái → Singapore → Hamburg', transit: '32 ngày',
        lines: [l('Cước biển 40HC', 'cont', 4, 1850, 2050), ...seaLocal('Cát Lái', 4, 190, 195), l('Phí dịch vụ đại lý', 'lô', 1, 0, 235)] },
    ],
  },
  {
    code: 'BG-2610-0329', rfq: 'RFQ-2610-0211', customer: 'Điện tử Kim Hưng', route: 'Thượng Hải → Nội Bài', mode: 'AIR',
    cargo: 'Air 380 kg · linh kiện điện tử', incoterm: 'EXW Thượng Hải', sales: 'Quốc Bảo', createdAt: '18/10 · 16:20', validTo: '25/10/2026',
    status: 'Nháp', chosenOption: 0,
    options: [
      { name: 'Phương án 1', carrier: 'China Eastern', routing: 'PVG → HAN', transit: '1 ngày',
        lines: [
          l('Cước hàng không', 'kg', 380, 1.85, 2.3),
          l('FSC – phụ phí nhiên liệu', 'kg', 380, 0.9, 1),
          l('Lấy hàng tại Thượng Hải', 'lô', 1, 180, 220),
          l('Thông quan xuất khẩu Trung Quốc', 'lô', 1, 120, 150),
          l('Phí AWB', 'bộ', 1, 25, 30),
          l('Thông quan nhập khẩu Nội Bài', 'lô', 1, 80, 120),
          l('Giao hàng nội thành Hà Nội', 'lô', 1, 60, 80),
        ] },
    ],
  },
  {
    code: 'BG-2610-0326', rfq: 'RFQ-2610-0208', customer: 'Dược An Khang', route: 'Tân Sơn Nhất → Amsterdam', mode: 'AIR',
    cargo: 'Air 650 kg · hàng lạnh 2–8°C', incoterm: 'FCA Tân Sơn Nhất', sales: 'Lan Anh', createdAt: '18/10 · 10:05', validTo: '27/10/2026',
    status: 'Nháp', chosenOption: 0, note: 'Hạn phản hồi khách 16:00 hôm nay.',
    options: [
      { name: 'Phương án 1 · bay thẳng', carrier: 'KLM Cargo', routing: 'SGN → AMS', transit: '1 ngày',
        lines: [
          l('Cước hàng không', 'kg', 650, 3.8, 4.4),
          l('FSC – phụ phí nhiên liệu', 'kg', 650, 1.05, 1.1),
          l('Thuê container lạnh Envirotainer RKN', 'cont', 1, 1450, 1650),
          l('Lưu kho lạnh tại TCS', 'lô', 1, 85, 110),
          l('Data logger nhiệt độ', 'cái', 1, 35, 50),
          l('Phí AWB', 'bộ', 1, 25, 30),
        ] },
      { name: 'Phương án 2 · qua Frankfurt', carrier: 'Lufthansa Cargo', routing: 'SGN → FRA → AMS', transit: '2 ngày',
        lines: [
          l('Cước hàng không', 'kg', 650, 3.4, 4),
          l('FSC – phụ phí nhiên liệu', 'kg', 650, 1.05, 1.1),
          l('Thuê container lạnh Envirotainer RKN', 'cont', 1, 1450, 1650),
          l('Lưu kho lạnh tại TCS', 'lô', 1, 85, 110),
          l('Data logger nhiệt độ', 'cái', 1, 35, 50),
          l('Phí AWB', 'bộ', 1, 25, 30),
        ] },
    ],
  },
  {
    code: 'BG-2610-0298', rfq: 'RFQ-2610-0199', customer: 'Nội thất Hòa Bình', route: 'Cát Lái → Melbourne', mode: 'FCL',
    cargo: '3 × 40HC · bàn ghế gỗ', incoterm: 'FOB Cát Lái', sales: 'Quốc Bảo', createdAt: '15/10 · 09:30', validTo: '31/10/2026',
    status: 'Đã gửi', chosenOption: 0, note: 'Đã gửi 15/10. Nhắc lại khách 20/10.',
    options: [
      { name: 'Phương án 1 · free time 14 ngày', carrier: 'CMA CGM', routing: 'Cát Lái → Melbourne', transit: '16 ngày',
        lines: [
          l('Cước biển 40HC', 'cont', 3, 2000, 2280),
          ...seaLocal('Cát Lái', 3, 190, 195),
          l('Gia hạn free time 14 ngày tại Melbourne', 'cont', 3, 120, 150),
          l('Phí dịch vụ đại lý', 'lô', 1, 0, 410),
        ] },
    ],
  },
  {
    code: 'BG-2610-0277', rfq: 'RFQ-2610-0186', customer: 'Gỗ Lâm Phát', route: 'Hải Phòng → Incheon', mode: 'FCL',
    cargo: '2 × 20GP · gỗ ván', incoterm: 'FOB Hải Phòng', sales: 'Thu Trang', createdAt: '10/10 · 14:10', validTo: '25/10/2026',
    status: 'Đã gửi', chosenOption: 0, note: 'Khách đề nghị giảm 5% cước biển, hẹn trả lời 19/10.',
    options: [
      { name: 'Phương án 1', carrier: 'Sinokor', routing: 'Hải Phòng → Incheon', transit: '6 ngày',
        lines: [l('Cước biển 20GP', 'cont', 2, 790, 820), ...seaLocal('Hải Phòng', 2, 120, 130), l('Phí dịch vụ đại lý', 'lô', 1, 0, 375)] },
    ],
  },
  {
    code: 'BG-2609-0240', rfq: 'RFQ-2609-0172', customer: 'Dệt Minh Phát', route: 'Hải Phòng → Los Angeles', mode: 'FCL',
    cargo: '2 × 40HC · quần áo', incoterm: 'FOB Hải Phòng', sales: 'Quốc Bảo', createdAt: '28/09 · 10:15', validTo: '15/10/2026',
    status: 'Chấp nhận', chosenOption: 0, booking: 'BK-2610-0088', note: 'Khách chấp nhận 01/10, đã mở job HPH-SEA-2610-0142.',
    options: [
      { name: 'Phương án 1', carrier: 'Evergreen', routing: 'Hải Phòng → Kaohsiung → Los Angeles', transit: '22 ngày',
        lines: [l('Cước biển 40HC', 'cont', 2, 2900, 3250), ...seaLocal('Hải Phòng', 2, 185, 195), l('Phí dịch vụ đại lý', 'lô', 1, 0, 425)] },
    ],
  },
  {
    code: 'BG-2609-0226', customer: 'Dược An Khang', route: 'Tân Sơn Nhất → Zurich', mode: 'AIR',
    cargo: 'Air 300 kg · thuốc thường', incoterm: 'FCA Tân Sơn Nhất', sales: 'Lan Anh', createdAt: '22/09 · 15:00', validTo: '06/10/2026',
    status: 'Từ chối', chosenOption: 0, note: 'Khách chọn đơn vị khác, giá thấp hơn khoảng 6%.',
    options: [
      { name: 'Phương án 1', carrier: 'Swiss WorldCargo', routing: 'SGN → SIN → ZRH', transit: '2 ngày',
        lines: [l('Cước hàng không', 'kg', 300, 3.9, 4.5), l('FSC – phụ phí nhiên liệu', 'kg', 300, 1.05, 1.1), l('Phí AWB', 'bộ', 1, 25, 30)] },
    ],
  },
  {
    code: 'BG-2609-0205', customer: 'Nội thất Hòa Bình', route: 'Cát Lái → Tokyo', mode: 'FCL',
    cargo: '2 × 40HC · tủ gỗ', incoterm: 'FOB Cát Lái', sales: 'Quốc Bảo', createdAt: '12/09 · 11:40', validTo: '30/09/2026',
    status: 'Hết hạn', chosenOption: 0, note: 'Khách hoãn đơn hàng sang quý 4.',
    options: [
      { name: 'Phương án 1', carrier: 'ONE', routing: 'Cát Lái → Tokyo', transit: '9 ngày',
        lines: [l('Cước biển 40HC', 'cont', 2, 690, 780), ...seaLocal('Cát Lái', 2, 190, 195)] },
    ],
  },
];
