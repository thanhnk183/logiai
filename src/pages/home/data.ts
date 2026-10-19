import type { StatItem } from '../../types';
import type { Approval, Notice, Role, TaskItem, WatchedJob } from './types';

export const roles: Role[] = ['CS / Ops', 'Điều phối', 'Kế toán', 'Quản lý'];

export const homeStats: StatItem[] = [
  { label: 'Job đang mở', value: '128', note: '+6 so với hôm qua', module: 'FMS' },
  { label: 'Cut-off trong 48 giờ', value: '9', note: '3 job chưa gửi SI', noteTone: 'amber', module: 'FMS' },
  { label: 'Chứng từ thiếu hoặc lệch', value: '14', note: '5 job sắp ETD', noteTone: 'red', module: 'DMS' },
  { label: 'Giao đúng hạn · 30 ngày', value: '94,2%', note: 'Mục tiêu 95%', module: 'TMS' },
];

export const weeks = ['T35', 'T36', 'T37', 'T38', 'T39', 'T40', 'T41', 'T42'];
export const weeklyJobs = [95, 103, 98, 110, 106, 119, 116, 128];
export const onTimeRate = [93.2, 94.0, 92.4, 95.4, 95.0, 93.6, 95.6, 94.2];

export const jobsByType = [
  { label: 'Sea FCL', count: 52, pct: 41 },
  { label: 'Air', count: 27, pct: 21 },
  { label: 'Trucking', count: 21, pct: 16 },
  { label: 'Sea LCL', count: 18, pct: 14 },
  { label: 'Kho', count: 10, pct: 8 },
];

export const tasks: TaskItem[] = [
  { job: 'HPH-SEA-2610-0142', module: 'FMS', task: 'Gửi Shipping Instruction cho hãng tàu trước cut-off', customer: 'Dệt Minh Phát', due: '11:00 hôm nay', dueTone: 'amber', status: 'Sắp hạn', statusTone: 'amber', bucket: 'today' },
  { job: 'HCM-AIR-2610-0087', module: 'DMS', task: 'Đối chiếu Packing List với Invoice, OCR lệch 2 dòng', customer: 'Dược An Khang', due: '14:00 hôm nay', status: 'Cần xử lý', statusTone: 'blue', bucket: 'today' },
  { job: 'HPH-SEA-2610-0131', module: 'CUS', task: 'Hoàn thiện bộ hồ sơ khai hải quan xuất', customer: 'Nội thất Hòa Bình', due: '16:30 hôm nay', status: 'Đang làm', statusTone: 'gray', bucket: 'today' },
  { job: 'HCM-TRK-2610-0210', module: 'TMS', task: 'Xác nhận lệnh lấy container rỗng, gán xe', customer: 'Thực phẩm Sao Việt', due: '17:00 hôm nay', status: 'Cần xử lý', statusTone: 'blue', bucket: 'today' },
  { job: 'HCM-WH-2610-0055', module: 'WMS', task: 'Đặt lịch hẹn nhập kho 2 container 40HC', customer: 'Bán lẻ Delta', due: 'Mai, 09:00', status: 'Kế hoạch', statusTone: 'gray', bucket: 'week' },
  { job: 'HCM-TRK-2610-0198', module: 'TMS', task: 'Thu hồi POD để xuất hóa đơn', customer: 'Thực phẩm Sao Việt', due: '16/10', dueTone: 'red', status: 'Quá hạn', statusTone: 'red', bucket: 'overdue' },
  { job: 'HPH-SEA-2610-0118', module: 'DMS', task: 'Duyệt B/L draft với khách hàng', customer: 'Gỗ Lâm Phát', due: '17/10', dueTone: 'red', status: 'Quá hạn', statusTone: 'red', bucket: 'overdue' },
  { job: 'HCM-SEA-2610-0120', module: 'FIN', task: 'Gửi debit note local charge', customer: 'Nội thất Hòa Bình', due: '17/10', dueTone: 'red', status: 'Quá hạn', statusTone: 'red', bucket: 'overdue' },
];


export const watchedJobs: WatchedJob[] = [
  { job: 'HPH-SEA-2610-0142', mode: 'FCL', route: 'Hải Phòng → Los Angeles', detail: '2 × 40HC · ETD 21/10', steps: ['done', 'done', 'late', 'todo', 'todo', 'todo', 'todo'], alert: 'Thiếu SI, cut-off 12:00', alertTone: 'red', note: 'Phụ trách: Lan Anh' },
  { job: 'HCM-AIR-2610-0087', mode: 'AIR', route: 'Tân Sơn Nhất → Frankfurt', detail: '1.240 kg · 18 kiện', steps: ['done', 'done', 'doing', 'todo', 'todo', 'todo', 'todo'], alert: 'Chờ đối chiếu chứng từ', alertTone: 'amber', note: 'Bay 20/10, 23:45' },
  { job: 'HPH-SEA-2610-0118', mode: 'FCL', route: 'Hải Phòng → Busan', detail: '1 × 20GP · đã lên tàu', steps: ['done', 'done', 'done', 'done', 'doing', 'todo', 'todo'], alert: 'B/L draft chưa duyệt', alertTone: 'amber', note: 'ETA 22/10' },
  { job: 'HCM-TRK-2610-0198', mode: 'FTL', route: 'Cát Lái → KCN Mỹ Phước', detail: 'Xe 51C-482.17 · 1 × 40HC', steps: ['done', 'done', 'done', 'done', 'done', 'late', 'todo'], alert: 'POD trễ 2 ngày', alertTone: 'red', note: 'Chặn xuất hóa đơn' },
];

export const approvals: Approval[] = [
  { module: 'FMS', kind: 'Báo giá', title: 'BG-2610-0331 · HCM → Hamburg, 4 × 40HC', meta: 'Sales: Quốc Bảo · lãi gộp 11,2%', amount: '9.860 USD' },
  { module: 'FIN', kind: 'Chi phí NCC', title: 'Cước kéo container tháng 10 · Vận tải Đông Á', meta: 'Điều phối: Thanh Tùng · 38 chuyến', amount: '186,4 tr ₫' },
  { module: 'FIN', kind: 'Đề nghị thanh toán', title: 'Local charge hãng tàu · HPH-SEA-2610-0131', meta: 'Kế toán: Mỹ Linh · hạn 20/10', amount: '42,7 tr ₫' },
  { module: 'WMS', kind: 'Điều chỉnh tồn', title: 'Kiểm kê khu A3 · lệch −14 thùng', meta: 'Kho: Văn Hậu · kho Tân Uyên', amount: '−14 thùng' },
];

export const notices: Notice[] = [
  { time: '08:02', category: 'Cut-off', tone: 'red', text: 'Cut-off SI tàu ORIENT STAR V.112E lúc 12:00 hôm nay, còn 1 job chưa gửi.' },
  { time: '07:45', category: 'Lưu container', tone: 'amber', text: 'Container LGPU 482193-0 còn 1 ngày miễn phí lưu bãi tại Cát Lái.' },
  { time: '07:30', category: 'Chứng từ', tone: 'red', text: '18 chứng từ mới từ email đang chờ duyệt kết quả OCR.' },
  { time: 'Hôm qua', category: 'Giấy phép', tone: 'amber', text: 'Giấy phép nhập khẩu PL-2026-0331 hết hiệu lực sau 5 ngày.' },
  { time: 'Hôm qua', category: 'Hợp đồng', tone: 'green', text: 'Hợp đồng dịch vụ với Dược An Khang cần gia hạn trước 31/10.' },
];
