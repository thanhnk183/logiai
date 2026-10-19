import { ocrQueue } from '../documents/data';
import { apBills } from '../finance/data';
import { hsCodes, locations, partners, tariff } from '../master-data/data';
import { quotations } from '../quotation-booking/quotations/data';
import { counts } from '../warehouse/data';
import type { AuditEvent, Integration, PermAction, PermArea, Role, User, Workflow } from './types';

// ---------- Vai trò ----------
export const roles: Role[] = [
  { key: 'admin', name: 'Quản trị hệ thống', desc: 'Cấu hình, người dùng, phân quyền, tích hợp', scope: 'Toàn công ty', system: true },
  { key: 'director', name: 'Giám đốc', desc: 'Xem mọi số liệu, duyệt cấp cuối', scope: 'Toàn công ty' },
  { key: 'sales-head', name: 'Trưởng phòng kinh doanh', desc: 'Duyệt báo giá, biểu phí, đối tác mới', scope: 'Toàn công ty' },
  { key: 'sales', name: 'Sales', desc: 'Khách hàng, RFQ, báo giá', scope: 'Của mình' },
  { key: 'cs', name: 'CS / Ops', desc: 'Job, booking, chứng từ, theo dõi lô hàng', scope: 'Chi nhánh' },
  { key: 'dispatch', name: 'Điều phối', desc: 'Lệnh vận chuyển, điều xe, POD', scope: 'Chi nhánh' },
  { key: 'customs', name: 'Hải quan', desc: 'Tờ khai, hồ sơ, giấy phép', scope: 'Chi nhánh' },
  { key: 'warehouse', name: 'Kho', desc: 'Nhập, xuất, kiểm kê', scope: 'Chi nhánh' },
  { key: 'accountant', name: 'Kế toán', desc: 'Công nợ, hóa đơn, ngân hàng', scope: 'Toàn công ty' },
  { key: 'chief-accountant', name: 'Kế toán trưởng', desc: 'Duyệt thanh toán, chốt đối soát', scope: 'Toàn công ty' },
];

// ---------- Người dùng (khớp người đang xuất hiện trong dữ liệu các module) ----------
export const users: User[] = [
  { id: 'U-001', name: 'Lan Anh', email: 'lananh@logiai.vn', title: 'Chuyên viên CS / Sales', branch: 'TP.HCM', roles: ['cs', 'sales'], status: 'Hoạt động', lastLogin: 'Hôm nay 07:52', mfa: true },
  { id: 'U-002', name: 'Quốc Bảo', email: 'quocbao@logiai.vn', title: 'Sales', branch: 'Hải Phòng', roles: ['sales'], status: 'Hoạt động', lastLogin: 'Hôm nay 08:05', mfa: true },
  { id: 'U-003', name: 'Thu Trang', email: 'thutrang@logiai.vn', title: 'Sales', branch: 'Hải Phòng', roles: ['sales'], status: 'Hoạt động', lastLogin: 'Hôm qua 17:40', mfa: false },
  { id: 'U-004', name: 'Hoàng Nam', email: 'hoangnam@logiai.vn', title: 'Sales', branch: 'TP.HCM', roles: ['sales'], status: 'Hoạt động', lastLogin: 'Hôm nay 07:31', mfa: true },
  { id: 'U-005', name: 'Hoàng Minh', email: 'hoangminh@logiai.vn', title: 'Trưởng phòng kinh doanh', branch: 'Toàn công ty', roles: ['sales-head'], status: 'Hoạt động', lastLogin: 'Hôm nay 08:10', mfa: true },
  { id: 'U-006', name: 'Thanh Tùng', email: 'thanhtung@logiai.vn', title: 'Điều phối vận tải', branch: 'TP.HCM', roles: ['dispatch'], status: 'Hoạt động', lastLogin: 'Hôm nay 06:45', mfa: true },
  { id: 'U-007', name: 'Mỹ Linh', email: 'mylinh@logiai.vn', title: 'Kế toán công nợ', branch: 'Toàn công ty', roles: ['accountant'], status: 'Hoạt động', lastLogin: 'Hôm nay 08:01', mfa: true },
  { id: 'U-008', name: 'Phạm Đức Anh', email: 'ducanh@logiai.vn', title: 'Kế toán trưởng', branch: 'Toàn công ty', roles: ['chief-accountant', 'accountant'], status: 'Hoạt động', lastLogin: 'Hôm qua 18:12', mfa: true },
  { id: 'U-009', name: 'Quang Minh', email: 'quangminh@logiai.vn', title: 'Trưởng kho', branch: 'Kho Tân Uyên', roles: ['warehouse'], status: 'Hoạt động', lastLogin: 'Hôm nay 07:02', mfa: false },
  { id: 'U-010', name: 'Văn Hậu', email: 'vanhau@logiai.vn', title: 'Nhân viên kho', branch: 'Kho Tân Uyên', roles: ['warehouse'], status: 'Hoạt động', lastLogin: 'Hôm nay 06:58', mfa: false },
  { id: 'U-011', name: 'Ngọc Hân', email: 'ngochan@logiai.vn', title: 'Nhân viên khai hải quan', branch: 'TP.HCM', roles: ['customs'], status: 'Đã mời', lastLogin: 'Chưa đăng nhập', mfa: false },
  { id: 'U-012', name: 'Nguyễn Văn Hải', email: 'hai.nv@logiai.vn', title: 'Giám đốc', branch: 'Toàn công ty', roles: ['director'], status: 'Hoạt động', lastLogin: 'Hôm qua 21:05', mfa: true },
  { id: 'U-013', name: 'Trần Minh Quân', email: 'quan.it@logiai.vn', title: 'Quản trị hệ thống', branch: 'Toàn công ty', roles: ['admin'], status: 'Hoạt động', lastLogin: 'Hôm nay 08:12', mfa: true },
  { id: 'U-014', name: 'Vũ Thành', email: 'vuthanh@logiai.vn', title: 'Sales (đã nghỉ)', branch: 'Hải Phòng', roles: ['sales'], status: 'Bị khóa', lastLogin: '30/09', mfa: false },
];

/** Tài khoản ngoài nhân viên văn phòng */
export const externalAccounts = [
  { label: 'Tài xế dùng Driver App', value: 46, note: '10 xe nội bộ, 36 xe nhà thầu' },
  { label: 'Khách hàng dùng Portal', value: 23, note: 'Tải chứng từ, xem tracking, công nợ' },
];

// ---------- Ma trận quyền ----------
export const permAreas: PermArea[] = [
  { key: 'crm', label: 'Khách hàng (CRM)' },
  { key: 'fms', label: 'Báo giá, booking', module: 'FMS' },
  { key: 'job', label: 'Job / lô hàng', module: 'FMS' },
  { key: 'tms', label: 'Vận tải', module: 'TMS' },
  { key: 'wms', label: 'Kho', module: 'WMS' },
  { key: 'cus', label: 'Hải quan', module: 'CUS' },
  { key: 'fin', label: 'Tài chính', module: 'FIN' },
  { key: 'dms', label: 'Chứng từ', module: 'DMS' },
  { key: 'data', label: 'Báo cáo' },
  { key: 'master', label: 'Danh mục' },
  { key: 'admin', label: 'Quản trị' },
];

export const permActions: { key: PermAction; label: string }[] = [
  { key: 'view', label: 'Xem' },
  { key: 'edit', label: 'Tạo, sửa' },
  { key: 'approve', label: 'Duyệt' },
  { key: 'export', label: 'Xuất' },
];

/** Chuỗi viết tắt: v = xem, e = sửa, a = duyệt, x = xuất */
const P: Record<string, Record<string, string>> = {
  admin: { crm: 'v', fms: 'v', job: 'v', tms: 'v', wms: 'v', cus: 'v', fin: 'v', dms: 'v', data: 'vx', master: 'vea', admin: 'veax' },
  director: { crm: 'vax', fms: 'vax', job: 'vx', tms: 'vx', wms: 'vx', cus: 'vx', fin: 'vax', dms: 'vx', data: 'vx', master: 'va', admin: 'v' },
  'sales-head': { crm: 'veax', fms: 'veax', job: 'vx', tms: 'v', wms: 'v', cus: 'v', fin: 'v', dms: 'v', data: 'vx', master: 'vea', admin: '' },
  sales: { crm: 've', fms: 've', job: 'v', tms: '', wms: '', cus: '', fin: 'v', dms: 'v', data: 'v', master: 'v', admin: '' },
  cs: { crm: 'v', fms: 've', job: 've', tms: 'v', wms: 'v', cus: 've', fin: 'v', dms: 'vea', data: 'v', master: 've', admin: '' },
  dispatch: { crm: '', fms: 'v', job: 'v', tms: 'veax', wms: 'v', cus: '', fin: '', dms: 've', data: 'v', master: 'v', admin: '' },
  customs: { crm: '', fms: 'v', job: 'v', tms: '', wms: '', cus: 'vex', fin: '', dms: 've', data: 'v', master: 've', admin: '' },
  warehouse: { crm: '', fms: '', job: 'v', tms: 'v', wms: 'veax', cus: '', fin: '', dms: 've', data: 'v', master: 'v', admin: '' },
  accountant: { crm: 'v', fms: 'v', job: 'v', tms: 'v', wms: 'v', cus: 'v', fin: 'vex', dms: 'v', data: 'vx', master: 've', admin: '' },
  'chief-accountant': { crm: 'v', fms: 'v', job: 'v', tms: 'v', wms: 'v', cus: 'v', fin: 'veax', dms: 'v', data: 'vx', master: 'vea', admin: '' },
};
const code: Record<PermAction, string> = { view: 'v', edit: 'e', approve: 'a', export: 'x' };

/** Quyền dạng tập "role|area|action" */
export const initialPerms = new Set(
  Object.entries(P).flatMap(([role, areas]) =>
    Object.entries(areas).flatMap(([area, s]) => (Object.keys(code) as PermAction[]).filter((a) => s.includes(code[a])).map((a) => `${role}|${area}|${a}`)),
  ),
);

// ---------- Quy trình duyệt (số chờ đếm từ dữ liệu các phân hệ) ----------
const masterPending = [...partners, ...locations, ...hsCodes].filter((r) => r.status === 'Chờ duyệt').length;

export const workflows: Workflow[] = [
  {
    id: 'WF-01', name: 'Duyệt báo giá', area: 'Báo giá', module: 'FMS', trigger: 'Sales gửi báo giá cho khách',
    steps: [
      { approver: 'Trưởng phòng kinh doanh', slaHours: 2 },
      { approver: 'Giám đốc', when: 'Lãi gộp dưới 8% hoặc giá trị trên 20.000 USD', slaHours: 4 },
    ],
    escalation: 'Quá 2 giờ nhắc lại, quá 4 giờ chuyển Giám đốc', enabled: true,
    pending: quotations.filter((q) => q.status === 'Chờ duyệt').length, pendingLink: '/bao-gia', avgHours: 1.4,
  },
  {
    id: 'WF-02', name: 'Duyệt thanh toán nhà cung cấp', area: 'Công nợ phải trả', module: 'FIN', trigger: 'Kế toán lập đề nghị thanh toán',
    steps: [
      { approver: 'Kế toán trưởng', slaHours: 8 },
      { approver: 'Giám đốc', when: 'Số tiền trên 100 triệu ₫', slaHours: 24 },
    ],
    escalation: 'Nhắc trước hạn thanh toán 1 ngày', enabled: true,
    pending: apBills.filter((b) => b.status === 'Chờ duyệt').length, pendingLink: '/cong-no-phai-tra', avgHours: 6.5,
  },
  {
    id: 'WF-03', name: 'Duyệt đổi giá biểu phí chuẩn', area: 'Biểu phí chuẩn', trigger: 'Đề xuất giá mới trong Danh mục',
    steps: [{ approver: 'Trưởng phòng kinh doanh', slaHours: 24 }, { approver: 'Giám đốc', when: 'Tăng hoặc giảm trên 10%', slaHours: 48 }],
    escalation: 'Không tự chuyển cấp', enabled: true,
    pending: tariff.filter((t) => t.proposal).length, pendingLink: '/bieu-phi-chuan', avgHours: 20,
  },
  {
    id: 'WF-04', name: 'Duyệt bản ghi danh mục mới', area: 'Danh mục', trigger: 'Tạo đối tác, địa điểm, mã HS mới',
    steps: [{ approver: 'Trưởng phòng kinh doanh', when: 'Đối tác', slaHours: 24 }, { approver: 'Kế toán trưởng', when: 'Đối tác có công nợ', slaHours: 24 }],
    escalation: 'Nhắc hằng ngày lúc 09:00', enabled: true,
    pending: masterPending, pendingLink: '/doi-tac', avgHours: 15,
  },
  {
    id: 'WF-05', name: 'Duyệt điều chỉnh tồn kho', area: 'Kiểm kê', module: 'WMS', trigger: 'Kết quả kiểm kê lệch số sổ sách',
    steps: [{ approver: 'Trưởng kho', slaHours: 4 }, { approver: 'Kế toán trưởng', when: 'Giá trị lệch trên 5 triệu ₫', slaHours: 24 }],
    escalation: 'Quá 4 giờ nhắc Giám đốc vận hành', enabled: true,
    pending: counts.filter((c) => c.status === 'Chờ duyệt điều chỉnh').length, pendingLink: '/kiem-ke', avgHours: 3.2,
  },
  {
    id: 'WF-06', name: 'Duyệt kết quả OCR', area: 'Chứng từ', module: 'DMS', trigger: 'Trường OCR dưới 95% độ tin cậy',
    steps: [{ approver: 'CS phụ trách job', slaHours: 2 }],
    escalation: 'Quá 2 giờ báo Trưởng nhóm CS', enabled: true,
    pending: ocrQueue.length, pendingLink: '/duyet-ocr', avgHours: 0.8,
  },
  {
    id: 'WF-07', name: 'Xuất hóa đơn khi chưa đủ chứng từ', area: 'Công nợ phải thu', module: 'FIN', trigger: 'Xuất hóa đơn khi thiếu POD hoặc tàu chưa chạy',
    steps: [{ approver: 'Kế toán trưởng', slaHours: 8 }],
    escalation: 'Không tự chuyển cấp', enabled: false,
    pending: 0, avgHours: 0,
  },
];

// ---------- Tích hợp ----------
export const integrations: Integration[] = [
  {
    id: 'INT-VNACCS', name: 'Hải quan điện tử VNACCS', group: 'Cơ quan nhà nước', method: 'API', state: 'Đang chạy', lastSync: '08:14', callsToday: 38, errorRate: 0,
    purpose: 'Truyền tờ khai, nhận phân luồng và kết quả thông quan',
    config: [{ label: 'Mã doanh nghiệp khai', value: '0316998201' }, { label: 'Chữ ký số', value: 'Viettel-CA · hết hạn 03/2027' }, { label: 'Khóa API', value: 'vnaccs_live_8f2c…', secret: true }],
    log: [{ time: '08:14', text: 'Nhận kết quả phân luồng tờ khai 10584601873 (Đỏ)', tone: 'red' }, { time: '06:40', text: 'Đồng bộ 4 tờ khai đang mở', tone: 'green' }],
  },
  {
    id: 'INT-EINV', name: 'Hóa đơn điện tử', group: 'Tài chính', method: 'API', state: 'Đang chạy', lastSync: '08:02', callsToday: 6, errorRate: 0,
    purpose: 'Phát hành, xin mã cơ quan thuế cho hóa đơn và debit note',
    config: [{ label: 'Nhà cung cấp', value: 'VNPT Invoice' }, { label: 'Ký hiệu hóa đơn', value: '1C26TLG' }, { label: 'Mật khẩu dịch vụ', value: '••••••••', secret: true }],
    log: [{ time: '08:02', text: 'Đồng bộ trạng thái 6 hóa đơn đã phát hành', tone: 'green' }],
  },
  {
    id: 'INT-VCB', name: 'Ngân hàng Vietcombank', group: 'Tài chính', method: 'API', state: 'Cảnh báo', lastSync: '08:10', callsToday: 24, errorRate: 0,
    purpose: 'Lấy sao kê theo thời gian thực để ghép giao dịch với hóa đơn',
    issue: 'Token truy cập hết hạn sau 5 ngày (24/10). Kế toán trưởng cần xác thực lại trên VCB DigiBiz.',
    config: [{ label: 'Tài khoản', value: '0071 0012 34567, 0071 3712 34568' }, { label: 'Client ID', value: 'vcb-logiai-prod' }, { label: 'Token', value: 'eyJhbGciOi…', secret: true }],
    log: [{ time: '07:58', text: 'Nhận giao dịch 268.500.000 ₫ từ Dệt Minh Phát', tone: 'green' }, { time: '08:00', text: 'Token còn 5 ngày hiệu lực', tone: 'amber' }],
  },
  {
    id: 'INT-EVG', name: 'Evergreen, CMA CGM, ONE, Maersk', group: 'Hãng tàu', method: 'API', state: 'Đang chạy', lastSync: '08:12', callsToday: 412, errorRate: 0.5,
    purpose: 'Lịch tàu, xác nhận booking, tracking container',
    config: [{ label: 'Kết nối', value: '4 hãng qua API' }, { label: 'Tần suất tracking', value: '30 phút' }],
    log: [{ time: '08:12', text: 'Cập nhật vị trí 6 container', tone: 'green' }, { time: '05:30', text: 'ONE trả lỗi 503, thử lại thành công', tone: 'amber' }],
  },
  {
    id: 'INT-EDI', name: 'EDI Yang Ming, COSCO', group: 'Hãng tàu', method: 'EDI', state: 'Lỗi', lastSync: 'Hôm qua 22:00', callsToday: 3, errorRate: 100,
    purpose: 'Nhận xác nhận booking (IFTMBC) và trạng thái container (IFTSTA)',
    issue: 'Chứng chỉ SFTP của Yang Ming đổi ngày 18/10, kết nối bị từ chối từ 22:00 hôm qua. Booking BK-2610-0094 chưa cập nhật.',
    config: [{ label: 'Máy chủ', value: 'sftp.yangming.com:22' }, { label: 'Thư mục nhận', value: '/out/IFTMBC' }, { label: 'Khóa SSH', value: 'ssh-rsa AAAAB3…', secret: true }],
    log: [{ time: '07:40', text: 'Từ chối kết nối: host key không khớp', tone: 'red' }, { time: '06:40', text: 'Từ chối kết nối: host key không khớp', tone: 'red' }, { time: 'Hôm qua 22:00', text: 'Lần đồng bộ thành công cuối', tone: 'green' }],
  },
  {
    id: 'INT-MAIL', name: 'Hộp thư docs@logiai.vn', group: 'Chứng từ', method: 'Email', state: 'Đang chạy', lastSync: '08:02', callsToday: 18, errorRate: 0,
    purpose: 'Nhận file đính kèm, OCR và gắn vào job',
    config: [{ label: 'Máy chủ', value: 'imap.logiai.vn' }, { label: 'Quy tắc gắn job', value: 'Số booking, B/L, mã job trong tiêu đề' }],
    log: [{ time: '08:02', text: 'Nhận VGM_EGLV142600881.pdf · gắn HPH-SEA-2610-0142', tone: 'green' }, { time: '07:48', text: 'Nhận Invoice_PL_DMP-2610-22.pdf', tone: 'green' }],
  },
  {
    id: 'INT-OCR', name: 'AI đọc chứng từ (OCR)', group: 'Chứng từ', method: 'API', state: 'Đang chạy', lastSync: '08:02', callsToday: 39, errorRate: 2.6,
    purpose: 'Phân loại chứng từ, đọc trường, đối chiếu với job',
    config: [{ label: 'Ngưỡng tự duyệt', value: '95%' }, { label: 'Mô hình', value: 'claude-sonnet-5-5' }],
    log: [{ time: '08:02', text: '14 chứng từ tự duyệt, 4 chuyển người duyệt', tone: 'green' }, { time: '07:12', text: 'Không nhận diện IMG_20261019_0712.jpg', tone: 'amber' }],
  },
  {
    id: 'INT-GPS', name: 'Driver App và GPS', group: 'Vận tải', method: 'SDK', state: 'Đang chạy', lastSync: '08:15', callsToday: 5120, errorRate: 0.1,
    purpose: 'Vị trí xe, ảnh EIR và POD, trạng thái chuyến',
    config: [{ label: 'Chu kỳ gửi vị trí', value: '60 giây' }, { label: 'Thiết bị đang online', value: '12' }],
    log: [{ time: '08:12', text: 'TR-2610-0418 · QL1A Bến Lức, 46 km/h', tone: 'green' }],
  },
  {
    id: 'INT-ZALO', name: 'Zalo OA thông báo khách', group: 'Khách hàng', method: 'Webhook', state: 'Tắt', lastSync: '—', callsToday: 0, errorRate: 0,
    purpose: 'Gửi thông báo ETD, ETA, POD cho khách qua Zalo',
    config: [{ label: 'OA ID', value: 'Chưa cấu hình' }],
    log: [],
  },
];

// ---------- Nhật ký hệ thống: sáng 19/10 ----------
export const auditEvents: AuditEvent[] = [
  { id: 'A-9821', time: '08:15', user: 'Lan Anh', kind: 'Sửa dữ liệu', module: 'FMS', action: 'Sửa SI', target: 'SI-2610-0142', ip: '10.0.2.31', changes: [{ field: 'Gross weight', before: '18.240 kg', after: '18.420 kg' }] },
  { id: 'A-9820', time: '08:14', user: 'Hệ thống', kind: 'Tích hợp', module: 'CUS', action: 'Nhận phân luồng', target: 'Tờ khai 10584601873', ip: 'VNACCS', changes: [{ field: 'Luồng', before: '—', after: 'Đỏ' }], tone: 'red' },
  { id: 'A-9819', time: '08:12', user: 'Trần Minh Quân', kind: 'Đăng nhập', module: 'ADM', action: 'Đăng nhập', target: 'Web · Chrome', ip: '10.0.1.8' },
  { id: 'A-9818', time: '08:10', user: 'Hoàng Minh', kind: 'Đăng nhập', module: 'ADM', action: 'Đăng nhập', target: 'Mobile · iOS', ip: '113.161.72.4' },
    { id: 'A-9816', time: '08:05', user: 'Quốc Bảo', kind: 'Sửa dữ liệu', module: 'FMS', action: 'Gửi duyệt báo giá', target: 'BG-2610-0331', ip: '10.0.3.12', changes: [{ field: 'Trạng thái', before: 'Nháp', after: 'Chờ duyệt' }] },
  { id: 'A-9815', time: '08:02', user: 'Hệ thống', kind: 'Duyệt', module: 'DMS', action: 'Tự duyệt OCR', target: '14 chứng từ', ip: 'AI OCR' },
  { id: 'A-9814', time: '08:01', user: 'Mỹ Linh', kind: 'Sửa dữ liệu', module: 'FIN', action: 'Lập đề nghị thanh toán', target: 'AP-2610-0043 · CMA CGM', ip: '10.0.2.40', changes: [{ field: 'Trạng thái', before: 'Chờ HĐ NCC', after: 'Chờ duyệt' }] },
  { id: 'A-9817', time: '07:58', user: 'Hệ thống', kind: 'Tích hợp', module: 'FIN', action: 'Nhận giao dịch ngân hàng', target: 'VCB · 268.500.000 ₫ · Dệt Minh Phát', ip: 'VCB API' },
  { id: 'A-9813', time: '07:57', user: 'thutrang@logiai.vn', kind: 'Bảo mật', module: 'ADM', action: 'Đăng nhập sai mật khẩu 3 lần', target: 'Web · Edge', ip: '27.72.101.15', tone: 'red' },
  { id: 'A-9812', time: '07:40', user: 'Hệ thống', kind: 'Tích hợp', module: 'FMS', action: 'Lỗi EDI Yang Ming', target: 'sftp.yangming.com', ip: 'EDI', tone: 'red' },
  { id: 'A-9811', time: '07:30', user: 'Quang Minh', kind: 'Duyệt', module: 'WMS', action: 'Duyệt kết quả kiểm kê', target: 'Khu D · KK-2610-0018', ip: '10.0.5.3' },
  { id: 'A-9810', time: '07:12', user: 'Trần Minh Quân', kind: 'Phân quyền', module: 'ADM', action: 'Thêm vai trò', target: 'Phạm Đức Anh', ip: '10.0.1.8', changes: [{ field: 'Vai trò', before: 'Kế toán', after: 'Kế toán, Kế toán trưởng' }] },
  { id: 'A-9809', time: '07:05', user: 'Trần Minh Quân', kind: 'Phân quyền', module: 'ADM', action: 'Mời người dùng', target: 'ngochan@logiai.vn', ip: '10.0.1.8' },
  { id: 'A-9808', time: '06:58', user: 'Văn Hậu', kind: 'Đăng nhập', module: 'ADM', action: 'Đăng nhập', target: 'Máy quét kho · Android', ip: '10.0.5.21' },
  { id: 'A-9807', time: '06:45', user: 'Thanh Tùng', kind: 'Sửa dữ liệu', module: 'TMS', action: 'Điều xe', target: 'TO-2610-0357 → 51C-390.44', ip: '10.0.2.18', changes: [{ field: 'Xe', before: '—', after: '51C-390.44 · Võ Văn Lực' }] },
  { id: 'A-9806', time: '06:40', user: 'Hệ thống', kind: 'Tích hợp', module: 'CUS', action: 'Đồng bộ tờ khai', target: '4 tờ khai đang mở', ip: 'VNACCS' },
  { id: 'A-9805', time: '02:00', user: 'Hệ thống', kind: 'Bảo mật', module: 'ADM', action: 'Sao lưu dữ liệu', target: 'Bản sao lưu hằng ngày · 4,2 GB', ip: '—', tone: 'green' },
];
