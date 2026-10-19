import type { StatItem } from '../../../types';
import type { Rfq, RfqStage } from '../types';

export const rfqStats: StatItem[] = [
  { label: 'Giá trị pipeline', value: '186.400 USD', note: '7 cơ hội đang mở' },
  { label: 'RFQ mới trong tuần', value: '17', note: '9 từ Portal, 6 email, 2 form' },
  { label: 'Tỷ lệ chốt báo giá · 90 ngày', value: '32%', note: '+4 điểm so với quý trước', noteTone: 'green' },
  { label: 'Phản hồi RFQ trung bình', value: '5,2 giờ', note: 'SLA nội bộ 4 giờ', noteTone: 'amber' },
];

export const stages: { key: RfqStage; title: string; desc: string; color: string }[] = [
  { key: 'new', title: 'RFQ mới', desc: 'Mới nhận, cần kiểm tra thông tin', color: '#1e7a3e' },
  { key: 'quoting', title: 'Đang báo giá', desc: 'Đã chuyển sang FMS lập giá', color: '#1f5fbf' },
  { key: 'sent', title: 'Đã gửi báo giá', desc: 'Chờ khách phản hồi', color: '#2b8fd6' },
  { key: 'negotiating', title: 'Thương lượng', desc: 'Khách yêu cầu điều chỉnh', color: '#c27c0e' },
  { key: 'won', title: 'Chốt', desc: 'Báo giá được chấp nhận, mở booking', color: '#0b1f33' },
];

const req = 'Cần giá cước và phí địa phương 2 đầu. Gửi kèm lịch tàu/chuyến bay phù hợp.';

export const rfqs: Rfq[] = [
  {
    code: 'RFQ-2610-0217', source: 'Portal', customer: 'Cà phê Tây Nguyên', route: 'HCM → Hamburg', cargo: 'FCL 4×40HC · cà phê nhân',
    value: 9860, deadline: 'Còn 2 giờ', deadlineTone: 'red', sales: 'Thu Trang', salesInitials: 'TT', stage: 'new',
    receivedAt: 'nhận 08:05 hôm nay qua Portal', incoterm: 'FOB Cát Lái', readyDate: '05/11/2026',
    request: 'Cần giá cước biển và phí địa phương 2 đầu, tàu đi trước 10/11. Hỏi thêm phương án qua Singapore nếu rẻ hơn.',
    attachments: ['RFQ_RFQ-2610-0217.pdf', 'Packing_list_du_kien.xlsx'],
  },
  {
    code: 'RFQ-2610-0215', source: 'Email', customer: 'Dệt Minh Phát', route: 'HPH → Savannah', cargo: 'FCL 2×40HC · vải cuộn',
    value: 7100, deadline: 'Còn 6 giờ', sales: 'Quốc Bảo', salesInitials: 'QB', stage: 'new',
    receivedAt: 'nhận 17:40 hôm qua qua Email', incoterm: 'FOB Hải Phòng', readyDate: '28/10/2026',
    request: 'Hàng đi hàng tháng 2×40HC, cần giá cố định 3 tháng.', attachments: ['Email_RFQ_Savannah.eml'],
  },
  {
    code: 'RFQ-2610-0211', source: 'Form', customer: 'Điện tử Kim Hưng', route: 'Thượng Hải → Hà Nội', cargo: 'Air 380 kg · linh kiện',
    value: 2450, deadline: 'Mai 10:00', sales: 'Quốc Bảo', salesInitials: 'QB', stage: 'quoting',
    receivedAt: 'nhận 15:12 ngày 17/10 qua Form', incoterm: 'EXW Thượng Hải', readyDate: '24/10/2026',
    request: req, attachments: ['Invoice_KH.pdf'],
  },
  {
    code: 'RFQ-2610-0208', source: 'Portal', customer: 'Dược An Khang', route: 'SGN → Amsterdam', cargo: 'Air 650 kg · hàng lạnh 2–8°C',
    value: 5820, deadline: 'Hôm nay 16:00', deadlineTone: 'red', sales: 'Lan Anh', salesInitials: 'LA', stage: 'quoting',
    receivedAt: 'nhận 10:20 ngày 17/10 qua Portal', incoterm: 'FCA Tân Sơn Nhất', readyDate: '22/10/2026',
    request: 'Hàng lạnh 2–8°C, cần container Envirotainer, theo dõi nhiệt độ suốt hành trình.', attachments: ['Spec_hang_lanh.pdf'],
  },
  {
    code: 'RFQ-2610-0199', source: 'Email', customer: 'Nội thất Hòa Bình', route: 'HCM → Melbourne', cargo: 'FCL 3×40HC · bàn ghế gỗ',
    value: 8400, deadline: 'Nhắc lại 20/10', sales: 'Quốc Bảo', salesInitials: 'QB', stage: 'sent',
    receivedAt: 'nhận 09:00 ngày 14/10 qua Email', incoterm: 'FOB Cát Lái', readyDate: '01/11/2026',
    request: 'Cần free time 14 ngày tại cảng đích.', attachments: ['Bao_gia_BG-2610-0298.pdf'],
  },
  {
    code: 'RFQ-2610-0194', source: 'Sales nhập', customer: 'Thực phẩm Sao Việt', route: 'Long An → Cát Lái', cargo: 'Trucking 6×40RF / tháng',
    value: 3900, deadline: 'Nhắc lại 21/10', sales: 'Lan Anh', salesInitials: 'LA', stage: 'sent',
    receivedAt: 'nhập 14:30 ngày 12/10', incoterm: '—', readyDate: 'Hàng tháng',
    request: 'Xe lạnh 40RF, 6 chuyến/tháng, giữ nhiệt −18°C.', attachments: [],
  },
  {
    code: 'RFQ-2610-0186', source: 'Portal', customer: 'Gỗ Lâm Phát', route: 'HPH → Incheon', cargo: 'FCL 2×20GP · gỗ ván',
    value: 2380, deadline: 'Khách hẹn 19/10', sales: 'Thu Trang', salesInitials: 'TT', stage: 'negotiating',
    receivedAt: 'nhận 11:05 ngày 09/10 qua Portal', incoterm: 'FOB Hải Phòng', readyDate: '25/10/2026',
    request: 'Khách đề nghị giảm 5% cước biển.', attachments: ['Bao_gia_BG-2610-0277.pdf'],
  },
  {
    code: 'RFQ-2609-0172', source: 'Email', customer: 'Dệt Minh Phát', route: 'HPH → Los Angeles', cargo: 'FCL 2×40HC · quần áo',
    value: 7420, deadline: 'Đã mở booking', sales: 'Quốc Bảo', salesInitials: 'QB', stage: 'won',
    receivedAt: 'nhận 08:30 ngày 28/09 qua Email', incoterm: 'FOB Hải Phòng', readyDate: '18/10/2026',
    request: 'Đã chốt, mở job HPH-SEA-2610-0142.', attachments: ['Bao_gia_BG-2609-0240.pdf'],
  },
];

export const salesPerformance = [
  { name: 'Quốc Bảo', revenue: 61200, winRate: 36 },
  { name: 'Lan Anh', revenue: 48750, winRate: 33 },
  { name: 'Thu Trang', revenue: 29300, winRate: 27 },
  { name: 'Hoàng Nam', revenue: 18900, winRate: 24 },
];
