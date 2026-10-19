import type { Aging, ApBill, ArInvoice, BankAccount, BankTxn, Reconciliation, VatInvoice } from './types';

/** Tỷ giá dùng quy đổi USD → VND trong báo cáo */
export const USD_RATE = 25380;

/** Tuổi nợ theo mã khách (triệu ₫), cộng lại bằng dư nợ ở Danh sách khách hàng */
export const aging: Record<string, Aging> = {
  'KH-00128': [2420, 420, 0, 0, 0],
  'KH-00093': [960, 0, 0, 0, 0],
  'KH-00211': [1120, 0, 0, 0, 0],
  'KH-00305': [820, 0, 150, 0, 0],
  'KH-00342': [410, 0, 0, 0, 0],
  'KH-00077': [0, 0, 0, 220, 0],
};
export const agingLabels = ['Trong hạn', '1–30 ngày', '31–60 ngày', '61–90 ngày', 'Trên 90 ngày'];

export const arInvoices: ArInvoice[] = [
  // ----- Chờ xuất -----
  { kind: 'Debit Note', customer: 'Bán lẻ Delta', job: 'HCM-WH-2610-0055', description: 'Thu hộ thuế NK và VAT tờ khai 10584601873', amount: 188860000, status: 'Chờ xuất', note: 'Đã nộp thay khách ngày 17/10' },
  { kind: 'Debit Note', customer: 'Nội thất Hòa Bình', job: 'HCM-SEA-2610-0120', description: 'Local charge đầu nhập, khai hải quan, giao hàng', amount: 15354900, status: 'Chờ xuất', note: 'Quá hạn gửi từ 17/10' },
  { kind: 'Hóa đơn', customer: 'Thực phẩm Sao Việt', job: 'HCM-TRK-2610-0198', description: 'Cước vận chuyển Cát Lái – Mỹ Phước, phí nâng hạ', amount: 7250000, status: 'Chờ xuất', blocked: 'Chặn · chờ POD từ Vận tải' },
  { kind: 'Hóa đơn', customer: 'Dệt Minh Phát', job: 'HPH-SEA-2610-0142', description: 'Cước biển 2 × 40HC, local charge, phí đại lý', amount: 188319600, status: 'Chờ xuất', blocked: 'Xuất sau khi tàu chạy (ETD 21/10)' },
  // ----- Đã xuất -----
  { number: 'LGA/26E-00301', kind: 'Hóa đơn', customer: 'Dệt Minh Phát', description: 'Cước biển tháng 8 · 6 job', issued: '25/08', due: '24/09', amount: 268500000, status: 'Quá hạn', daysOverdue: 25 },
  { number: 'LGA/26E-00322', kind: 'Hóa đơn', customer: 'Dệt Minh Phát', description: 'Cước biển nửa đầu tháng 9 · 4 job', issued: '05/09', due: '05/10', amount: 151500000, status: 'Quá hạn', daysOverdue: 14 },
  { number: 'LGA/26E-00290', kind: 'Hóa đơn', customer: 'Gỗ Lâm Phát', description: 'Cước biển HPH → Incheon tháng 8', issued: '20/08', due: '04/09', amount: 150000000, status: 'Quá hạn', daysOverdue: 45 },
  { number: 'LGA/26E-00205', kind: 'Hóa đơn', customer: 'Thép Thành Công', description: 'Vận chuyển hàng nặng Bình Dương tháng 7', issued: '15/07', due: '30/07', amount: 220000000, status: 'Quá hạn', daysOverdue: 81, note: 'Khách đang tạm ngừng giao dịch' },
  { number: 'LGA/26E-00376', kind: 'Hóa đơn', customer: 'Thực phẩm Sao Việt', description: 'Xe lạnh Long An – Cát Lái tháng 9', issued: '30/09', due: '30/10', amount: 98400000, status: 'Sắp đến hạn' },
  { number: 'LGA/26E-00389', kind: 'Hóa đơn', customer: 'Nội thất Hòa Bình', description: 'Cước biển đi Úc, Nhật tháng 9', issued: '05/10', due: '04/11', amount: 186200000, status: 'Chưa đến hạn' },
  { number: 'LGA/26E-00407', kind: 'Hóa đơn', customer: 'Gỗ Lâm Phát', job: 'HPH-SEA-2610-0118', description: 'Cước biển 20GP HPH → Busan, local charge', issued: '17/10', due: '01/11', amount: 17871750, status: 'Chưa đến hạn' },
  { number: 'LGA/26E-00398', kind: 'Hóa đơn', customer: 'Dược An Khang', job: 'HCM-AIR-2610-0061', description: 'Cước hàng không SGN → AMS', issued: '11/10', due: '25/11', amount: 60379000, status: 'Đã thu' },
  { number: 'LGA/26E-00385', kind: 'Hóa đơn', customer: 'Dệt Minh Phát', job: 'HCM-SEA-2609-0377', description: 'Cước LCL HCM → Rotterdam', issued: '02/10', due: '01/11', amount: 31928400, status: 'Đã thu' },
];

export const apBills: ApBill[] = [
  {
    code: 'AP-2610-0041', vendor: 'Vận tải Đông Á', kind: 'Cước xe nhà thầu', description: 'Cước kéo container tháng 10 · 38 chuyến', due: '31/10', amount: 186400000, status: 'Chờ duyệt',
    match: { ok: false, text: 'Khớp 37/38 chuyến · TR-2610-0402 thiếu POD' }, note: 'Điều phối: Thanh Tùng. Nên tạm giữ phần của chuyến thiếu POD.',
  },
  {
    code: 'AP-2610-0043', vendor: 'CMA CGM Việt Nam', kind: 'Local charge hãng tàu', job: 'HPH-SEA-2610-0131', description: 'THC, seal, phí chứng từ 3 × 40HC', vendorInvoice: 'CMA/HPH/2610/7715', due: '20/10', amount: 42700000, status: 'Chờ duyệt',
    match: { ok: false, text: 'Có 8,6 tr phụ phí cảng ngoài biểu phí đã báo khách' }, note: 'Khách khiếu nại KN-2610-009 về khoản này. Kế toán: Mỹ Linh.',
  },
  {
    code: 'AP-2610-0045', vendor: 'Lufthansa Cargo', kind: 'Cước hàng không', job: 'HCM-AIR-2610-0087', description: 'Cước và FSC 1.240 kg SGN → FRA', due: 'Kỳ CASS 2 tháng 10', amount: 147915000, status: 'Chờ HĐ NCC',
    match: { ok: true, text: 'Khớp chi phí dự kiến của job' },
  },
  {
    code: 'AP-2610-0038', vendor: 'Evergreen Việt Nam', kind: 'Cước biển', job: 'HPH-SEA-2610-0142', description: 'Cước biển 2 × 40HC HPH → LA', due: 'Trước ETD 21/10', amount: 147204000, status: 'Chờ HĐ NCC',
    match: { ok: true, text: 'Khớp giá mua trong báo giá BG-2609-0240' },
  },
  {
    code: 'AP-2610-0036', vendor: 'Hải Phòng Logistics Xanh', kind: 'Cước xe nhà thầu', description: 'Cước kéo container tháng 10 · 14 chuyến', due: '05/11', amount: 61200000, status: 'Chờ HĐ NCC',
    match: { ok: false, text: 'Nhà thầu tính 63,0 tr, lệch 1,8 tr' }, note: 'Đang đối soát số chuyến.',
  },
  {
    code: 'AP-2610-0040', vendor: 'Envirotainer', kind: 'Thuê thiết bị lạnh', job: 'HCM-AIR-2610-0087', description: 'Thuê container lạnh RKN', vendorInvoice: 'ENV-VN-26-1192', due: '25/10', amount: 36801000, status: 'Đã duyệt',
    match: { ok: true, text: 'Khớp chi phí dự kiến của job' },
  },
  {
    code: 'AP-2610-0047', vendor: 'Kho bạc Nhà nước (thuế hải quan)', kind: 'Thuế nộp hộ khách', job: 'HCM-WH-2610-0055', description: 'Thuế NK, VAT tờ khai 10584601873', due: '17/10', amount: 188860000, status: 'Đã thanh toán',
    match: { ok: true, text: 'Khớp số thuế trên tờ khai' }, note: 'Cần xuất debit note thu hộ từ Bán lẻ Delta.',
  },
  {
    code: 'AP-2610-0029', vendor: 'Sài Gòn Lạnh', kind: 'Cước xe nhà thầu', description: 'Cước xe lạnh tháng 9 · 24 chuyến', vendorInvoice: 'SGL/26/0918', due: '10/10', amount: 104200000, status: 'Đã thanh toán',
    match: { ok: true, text: 'Khớp đối soát tháng 9' },
  },
];

export const bankAccounts: BankAccount[] = [
  { code: 'VCB-VND', bank: 'Vietcombank', number: '0071 0012 34567', currency: 'VND', balance: 4826500000 },
  { code: 'VCB-USD', bank: 'Vietcombank', number: '0071 3712 34568', currency: 'USD', balance: 186240 },
  { code: 'TCB-VND', bank: 'Techcombank', number: '1903 4567 8901', currency: 'VND', balance: 1215800000 },
];

export const bankTxns: BankTxn[] = [
  { id: 't1', account: 'VCB-VND', time: '19/10 · 07:58', description: 'CONG TY TNHH DET MINH PHAT TT HD 00301', amount: 268500000, suggestion: { ref: 'LGA/26E-00301', reason: 'Nội dung có số hóa đơn, số tiền khớp' } },
  { id: 't2', account: 'TCB-VND', time: '18/10 · 16:20', description: 'CONG TY CP DUOC PHAM AN KHANG TT LGA26E00398', amount: 60379000, matched: 'LGA/26E-00398' },
  { id: 't3', account: 'VCB-VND', time: '17/10 · 15:40', description: 'NOP THUE NK TK 10584601873', amount: -188860000, matched: 'AP-2610-0047' },
  { id: 't4', account: 'VCB-VND', time: '17/10 · 11:05', description: 'CTY TNHH NOI THAT HOA BINH CK', amount: 100000000, suggestion: { ref: 'LGA/26E-00389', reason: 'Cùng khách, thanh toán một phần (100/186,2 tr)' } },
  { id: 't5', account: 'VCB-VND', time: '17/10 · 08:00', description: 'PHI DICH VU NGAN HANG THANG 10', amount: -220000, matched: 'Chi phí ngân hàng' },
  { id: 't6', account: 'VCB-USD', time: '16/10 · 14:30', description: 'MEDIPHARM GMBH PAYMENT REF AK-FRA', amount: 1250, suggestion: { ref: '—', reason: 'Không tìm thấy hóa đơn, có thể khách trả nhầm tài khoản' } },
  { id: 't7', account: 'TCB-VND', time: '10/10 · 09:15', description: 'TT SAI GON LANH HD SGL/26/0918', amount: -104200000, matched: 'AP-2610-0029' },
];

export const vatPeriod = { name: 'Tháng 10/2026', deadline: '20/11/2026', output: 52840000, input: 31260000 };

export const vatInvoices: VatInvoice[] = [
  { number: 'LGA/26E-00407', direction: 'Đầu ra', party: 'Gỗ Lâm Phát', date: '17/10', net: 17871750, rate: 0, status: 'Đã cấp mã', note: 'Cước quốc tế, thuế suất 0%' },
  { number: 'LGA/26E-00398', direction: 'Đầu ra', party: 'Dược An Khang', date: '11/10', net: 60379000, rate: 0, status: 'Đã cấp mã', note: 'Cước quốc tế, thuế suất 0%' },
  { number: 'LGA/26E-00389', direction: 'Đầu ra', party: 'Nội thất Hòa Bình', date: '05/10', net: 186200000, rate: 0, status: 'Đã cấp mã' },
  { number: 'LGA/26E-00411', direction: 'Đầu ra', party: 'Thực phẩm Sao Việt', date: '18/10', net: 98400000, rate: 8, status: 'Chờ cấp mã', note: 'Vận tải nội địa, thuế suất 8%' },
  { number: 'LGA/26E-00393', direction: 'Đầu ra', party: 'Bán lẻ Delta', date: '08/10', net: 312000000, rate: 8, status: 'Đã cấp mã', note: 'Dịch vụ kho tháng 9' },
  { number: 'SGL/26/0918', direction: 'Đầu vào', party: 'Sài Gòn Lạnh', date: '30/09', net: 96481000, rate: 8, status: 'Hợp lệ' },
  { number: 'ENV-VN-26-1192', direction: 'Đầu vào', party: 'Envirotainer', date: '16/10', net: 34075000, rate: 8, status: 'Hợp lệ' },
  { number: 'HPX/26/1002', direction: 'Đầu vào', party: 'Hải Phòng Logistics Xanh', date: '02/10', net: 52800000, rate: 8, status: 'Sai thông tin', note: 'Sai mã số thuế người mua, cần hóa đơn thay thế' },
  { number: 'CMA/HPH/2610/7715', direction: 'Đầu vào', party: 'CMA CGM Việt Nam', date: '18/10', net: 39537000, rate: 8, status: 'Hợp lệ' },
];

export const reconciliations: Reconciliation[] = [
  {
    id: 'R1', party: 'Dệt Minh Phát', side: 'Khách hàng', period: 'Đến 30/09', ours: 2840, theirs: 2571.5, status: 'Có chênh lệch', sentAt: '15/10',
    items: [{ text: 'Khách đã chuyển 268,5 tr sáng 19/10 cho HĐ 00301, ngân hàng chưa ghép', amount: 268.5 }],
  },
  {
    id: 'R2', party: 'Nội thất Hòa Bình', side: 'Khách hàng', period: 'Đến 30/09', ours: 1120, theirs: 1111.4, status: 'Có chênh lệch', sentAt: '14/10',
    items: [{ text: 'Khách không ghi nhận phụ phí cảng chưa báo trước (khiếu nại KN-2610-009)', amount: 8.6 }],
  },
  { id: 'R3', party: 'Gỗ Lâm Phát', side: 'Khách hàng', period: 'Đến 30/09', ours: 970, theirs: 970, status: 'Đã xác nhận', sentAt: '10/10', items: [] },
  { id: 'R4', party: 'Dược An Khang', side: 'Khách hàng', period: 'Đến 30/09', ours: 960, status: 'Đã gửi', sentAt: '16/10', items: [] },
  { id: 'R5', party: 'Thực phẩm Sao Việt', side: 'Khách hàng', period: 'Đến 30/09', ours: 410, status: 'Chưa gửi', items: [] },
  {
    id: 'R6', party: 'Vận tải Đông Á', side: 'Nhà cung cấp', period: 'Tháng 10', ours: 186.4, theirs: 191.8, status: 'Có chênh lệch', sentAt: '18/10',
    items: [{ text: 'Chuyến TR-2610-0402 nhà thầu tính, LogiAI chưa ghi nhận vì thiếu POD', amount: 5.4 }],
  },
  {
    id: 'R7', party: 'Hải Phòng Logistics Xanh', side: 'Nhà cung cấp', period: 'Tháng 10', ours: 61.2, theirs: 63.0, status: 'Có chênh lệch', sentAt: '17/10',
    items: [{ text: 'Phí neo xe chờ đóng hàng 2 chuyến chưa có trong lệnh', amount: 1.8 }],
  },
  { id: 'R8', party: 'Sài Gòn Lạnh', side: 'Nhà cung cấp', period: 'Tháng 9', ours: 104.2, theirs: 104.2, status: 'Đã xác nhận', sentAt: '05/10', items: [] },
];
