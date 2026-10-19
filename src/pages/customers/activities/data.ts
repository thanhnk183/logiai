import type { Activity, ActivityType, Appointment, Complaint, Reminder } from '../types';

export const activityTypes: ActivityType[] = ['Cuộc gọi', 'Email', 'Gặp mặt', 'Ghi chú', 'Khiếu nại'];

export const contactsByCustomer: Record<string, string[]> = {
  'Dược phẩm An Khang': ['Lê Minh Châu · Giám đốc chuỗi cung ứng', 'Phạm Thảo · Kế toán công nợ'],
  'Dệt Minh Phát': ['Trần Thu Hà · Trưởng phòng XNK', 'Nguyễn Văn Vũ · Kế toán công nợ'],
  'Nội thất Hòa Bình': ['Đỗ Khải · Giám đốc mua hàng'],
  'Gỗ Lâm Phát': ['Võ Lâm · Trưởng phòng logistics'],
  'Thép Thành Công': ['Tạ Công · Giám đốc'],
  'Cà phê Tây Nguyên': ['Y Bích · Phụ trách xuất khẩu'],
};

export const activities: Activity[] = [
  { id: 1, type: 'Cuộc gọi', customer: 'Dược phẩm An Khang', contact: 'Lê Minh Châu', time: '09:40 hôm nay', owner: 'Lan Anh', content: 'Khách xác nhận sẽ gia hạn hợp đồng năm 2027, muốn thêm tuyến SGN → Zurich. Hẹn gửi phụ lục và biểu phí mới.', reminder: 'Gửi phụ lục gia hạn trước 22/10' },
  { id: 2, type: 'Khiếu nại', customer: 'Gỗ Lâm Phát', contact: 'Võ Lâm', time: '08:55 hôm nay', owner: 'Thu Trang', content: 'Phản ánh B/L draft sai tên người nhận hàng, cần sửa trước khi phát hành. Đã chuyển cho bộ phận chứng từ.', reminder: 'Phản hồi khách trước 14:00' },
  { id: 3, type: 'Email', customer: 'Dệt Minh Phát', contact: 'Trần Thu Hà', time: 'Hôm qua 17:40', owner: 'Quốc Bảo', content: 'Khách gửi RFQ tuyến HPH → Savannah, 2×40HC hàng tháng. Đã tạo RFQ-2610-0215.' },
  { id: 4, type: 'Gặp mặt', customer: 'Nội thất Hòa Bình', contact: 'Đỗ Khải', time: '15/10 · 14:00', owner: 'Quốc Bảo', content: 'Thăm nhà máy Tân Uyên. Khách dự kiến tăng 30% sản lượng đi Úc từ quý 1, quan tâm free time 14 ngày tại cảng đích.', reminder: 'Gửi báo giá phương án free time 14 ngày' },
  { id: 5, type: 'Ghi chú', customer: 'Thép Thành Công', contact: 'Tạ Công', time: '14/10 · 10:15', owner: 'Thu Trang', content: 'Tạm ngừng giao dịch do còn công nợ quá hạn 220 triệu. Chỉ nhận job mới khi thanh toán trước.' },
  { id: 6, type: 'Cuộc gọi', customer: 'Cà phê Tây Nguyên', contact: 'Y Bích', time: '13/10 · 16:30', owner: 'Thu Trang', content: 'Giới thiệu dịch vụ, khách đồng ý gửi RFQ thử tuyến đi Hamburg qua Portal.' },
];

export const appointments: Appointment[] = [
  { weekday: 'T3', day: 20, title: 'Họp gia hạn hợp đồng', customer: 'Dược phẩm An Khang', detail: '10:00 · văn phòng khách, Nhà Bè' },
  { weekday: 'T4', day: 21, title: 'Trình bày phương án tuyến Hamburg', customer: 'Cà phê Tây Nguyên', detail: '14:30 · họp trực tuyến' },
  { weekday: 'T6', day: 23, title: 'Rà soát SLA quý 3', customer: 'Dệt Minh Phát', detail: '09:00 · văn phòng LogiAI' },
];

export const complaints: Complaint[] = [
  { code: 'KN-2610-014', sla: 'Còn 4 giờ', slaTone: 'amber', title: 'B/L draft sai tên người nhận', ref: 'Gỗ Lâm Phát · HPH-SEA-2610-0118' },
  { code: 'KN-2610-011', sla: 'Quá hạn 2 giờ', slaTone: 'red', title: 'Giao hàng trễ 1 ngày so với hẹn', ref: 'Thực phẩm Sao Việt · HCM-TRK-2610-0187' },
  { code: 'KN-2610-009', sla: 'Đang xử lý', slaTone: 'gray', title: 'Phụ phí cảng chưa báo trước', ref: 'Nội thất Hòa Bình · HPH-SEA-2610-0131' },
];

export const reminders: Reminder[] = [
  { id: 1, text: 'Gửi phụ lục gia hạn HĐ-2024-117 cho An Khang', due: 'Hạn 22/10', urgent: true, done: false },
  { id: 2, text: 'Gọi lại Gỗ Lâm Phát về B/L draft', due: 'Hôm nay 14:00', urgent: true, done: false },
  { id: 3, text: 'Chuẩn bị báo giá free time 14 ngày cho Hòa Bình', due: 'Hạn 23/10', done: false },
  { id: 4, text: 'Cập nhật hồ sơ Cà phê Tây Nguyên sau RFQ', due: 'Hạn 24/10', done: false },
];
