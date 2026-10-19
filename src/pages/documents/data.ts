import { jobs } from '../jobs/data';
import type { DmsDoc, DocAlert, OcrItem, UploadItem } from './types';

/** Nội dung chữ sau OCR của các file, dùng cho tìm kiếm toàn văn */
const ocrText: Record<string, string> = {
  'Booking_Confirmation_EGLV142600881.pdf': 'EVERGREEN LINE booking EGLV142600881 ORIENT STAR V.112E Hai Phong Los Angeles via Kaohsiung 2 x 40HC cut-off SI 19/10 12:00 cut-off VGM 19/10 17:00 CY 20/10 17:00',
  'Commercial_Invoice_BH-26-0918.pdf': 'DET MINH PHAT CO., LTD invoice BH-26-0918 BLUE HARBOR APPAREL INC. men shirts 100% cotton 12.480 pcs FOB Hai Phong USD 149.760,00',
  'Packing_List_BH-26-0918.xlsx': 'packing list BH-26-0918 1.040 cartons gross weight 18.420 kg net weight 16.980 kg 68,2 CBM men shirts',
  'Hop_dong_mua_ban_BH-2026.pdf': 'sales contract BH-2026 DET MINH PHAT BLUE HARBOR APPAREL payment T/T 30 days FOB Hai Phong',
  'EIR_EITU1482036.jpg': 'EIR EITU1482036 seal EMCQ482207 depot Dinh Vu 17/10 14:10 container sạch không hư hỏng',
  'EIR_EGHU9021173.jpg': 'EIR EGHU9021173 depot Dinh Vu 18/10 16:25 xe 15C-218.46',
  'SI-2610-0142': 'shipping instruction EGLV142600881 shipper DET MINH PHAT consignee BLUE HARBOR APPAREL gross weight 18.240 kg 1.040 cartons',
  LGHPH2610142: 'house bill of lading LGHPH2610142 draft BLUE HARBOR APPAREL Los Angeles EITU1482036 EGHU9021173',
  'Invoice_AK-FRA-2610.pdf': 'DUOC AN KHANG invoice AK-FRA-2610 pharmaceutical products 2-8°C 18 packages Frankfurt FCA Tan Son Nhat',
  'PackingList_AK-FRA-2610.pdf': 'packing list AK-FRA-2610 18 packages 1.240 kg vaccine insulin line 4 qty 360 line 7 qty 96',
  'Giay_phep_XK_duoc_2026-118.pdf': 'giấy phép xuất khẩu thuốc 2026-118 Cục Quản lý Dược Dược An Khang hiệu lực 31/12/2026',
  LGSGN2610087: 'house air waybill LGSGN2610087 LH8405 Frankfurt 18 pcs 1.240 kg',
  'Invoice_LPW-2610.pdf': 'LAM PHAT WOOD invoice LPW-2610 plywood 18mm HANSOL WOOD CO., LTD Busan FOB Hai Phong',
  'PackingList_LPW-2610.pdf': 'packing list LPW-2610 plywood 42 bundles 21.600 kg 1 x 20GP',
  'To_khai_30584633201.pdf': 'tờ khai xuất khẩu 30584633201 B11 Chi cục HQ cửa khẩu cảng Hải Phòng KV III luồng xanh 16/10',
  'HDMUHPHA2610079.pdf': 'HMM master bill of lading HDMUHPHA2610079 HMM BLESSING V.045E Hai Phong Busan',
  LGHPH2610118: 'house bill of lading LGHPH2610118 consignee HANSUNG WOOD CO., LTD Busan sửa thành HANSOL WOOD',
  'DO_CatLai_2610198.pdf': 'delivery order Cat Lai TGHU5520183 Thuc pham Sao Viet',
  'EIR_TGHU5520183.jpg': 'EIR TGHU5520183 Cat Lai 14/10 xe 51C-662.14',
  'Invoice_CHL-SYD-26.pdf': 'HOA BINH FURNITURE invoice CHL-SYD-26 COASTAL HOME LIVING PTY LTD rubberwood dining set Sydney',
  'PackingList_CHL-SYD-26.xlsx': 'packing list CHL-SYD-26 3 x 40HC 612 cartons 31.450 kg rubberwood',
  LGHPH2610131: 'house bill of lading LGHPH2610131 draft COASTAL HOME LIVING Sydney CMA CGM TAGE',
  'Booking_Confirmation_YMLU260094551.pdf': 'YANG MING booking YMLU260094551 YM WELLNESS V.087E Hai Phong Long Beach 1 x 40HC',
  'Lenh_van_chuyen_0210.pdf': 'lệnh vận chuyển 0210 Thực phẩm Sao Việt kho Tân Uyên giao 20/10',
  'Packing_list_Delta_IB0128.xlsx': 'packing list Ban le Delta IB-2610-0128 LGPU4821930 LGPU4822017 DL-DET-0412 DL-DAU-1180 DL-GIA-0210',
  'BL_COSU6248103.pdf': 'COSCO bill of lading COSU6248103 Noi that Hoa Binh nhập khẩu',
  'To_khai_10584552117.pdf': 'tờ khai nhập khẩu 10584552117 Cát Lái luồng vàng 13/10',
  'LGSGN2609377.pdf': 'house bill of lading LGSGN2609377 LCL Dệt Minh Phát',
  'LGSGN2610061.pdf': 'house air waybill LGSGN2610061 Dược An Khang',
};

const uploader: Record<string, string> = {
  'Email hãng tàu': 'Tự động · email',
  'Email khách': 'Tự động · email',
  'Email đại lý': 'Tự động · email',
  'Portal khách': 'Khách hàng · portal',
  'Driver App': 'Tài xế · Driver App',
  'Tạo trong FMS': 'Lan Anh',
  'Hệ thống HQ điện tử': 'Tự động · VNACCS',
};

/** Chứng từ gắn với job (đọc thẳng từ module Job) */
const fromJobs: DmsDoc[] = jobs.flatMap((j) =>
  j.documents
    .filter((d) => d.status !== 'Thiếu')
    .map((d) => ({
      id: '',
      name: d.name,
      type: d.type,
      source: d.source,
      status: d.status as DmsDoc['status'],
      version: d.version ?? 'v1',
      updated: d.updated ?? '19/10',
      job: j.code,
      customer: j.customer,
      note: d.note,
      size: '',
      pages: 0,
      text: ocrText[d.name] ?? '',
      uploadedBy: uploader[d.source] ?? 'Lan Anh',
    })),
);

/** Chứng từ cấp khách hàng, không gắn job */
const general: Omit<DmsDoc, 'id' | 'size' | 'pages'>[] = [
  { name: 'HD_dich_vu_logistics_DMP_2026.pdf', type: 'Hợp đồng dịch vụ', source: 'Tạo trong CRM', status: 'Đã duyệt', version: 'v3', updated: '05/01', customer: 'Dệt Minh Phát', text: 'hợp đồng dịch vụ logistics 2026 Dệt Minh Phát hạn mức công nợ 3 tỷ thanh toán 30 ngày', uploadedBy: 'Hoàng Minh' },
  { name: 'Phu_luc_SLA_Duoc_An_Khang.pdf', type: 'Phụ lục SLA', source: 'Tạo trong CRM', status: 'Đã duyệt', version: 'v2', updated: '20/08', customer: 'Dược An Khang', text: 'phụ lục SLA hàng lạnh 2-8°C nhiệt độ ghi nhận 15 phút bồi thường', uploadedBy: 'Lan Anh' },
  { name: 'GPKD_Ban_le_Delta.pdf', type: 'Giấy phép kinh doanh', source: 'Portal khách', status: 'Đã duyệt', version: 'v1', updated: '11/03', customer: 'Bán lẻ Delta', text: 'giấy chứng nhận đăng ký doanh nghiệp Bán lẻ Delta mã số thuế 0315582941', uploadedBy: 'Khách hàng · portal' },
  { name: 'Bao_gia_BG-2609-0240.pdf', type: 'Báo giá', source: 'Tạo trong FMS', status: 'Đã duyệt', version: 'v2', updated: '28/09', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', text: 'báo giá BG-2609-0240 Hải Phòng Los Angeles 40HC Evergreen', uploadedBy: 'Quốc Bảo' },
  { name: 'HD_van_tai_Dong_A_2026.pdf', type: 'Hợp đồng nhà thầu', source: 'Tạo trong TMS', status: 'Nháp', version: 'v2', updated: '17/10', customer: 'Vận tải Đông Á', text: 'hợp đồng vận tải nội địa Đông Á 2026 đơn giá chuyến bổ sung phụ lục giá dầu', uploadedBy: 'Thanh Tùng' },
];

export const dmsDocs: DmsDoc[] = [...fromJobs, ...general].map((d, i) => ({
  ...d,
  id: `DOC-${String(4810 + i).padStart(5, '0')}`,
  size: d.name.endsWith('.jpg') ? `${(1.2 + ((i * 7) % 9) / 10).toFixed(1)} MB` : `${180 + ((i * 137) % 820)} KB`,
  pages: d.name.endsWith('.jpg') ? 1 : 1 + ((i * 3) % 5),
}));

/** Kết quả OCR chưa đạt ngưỡng tự duyệt, cần người xem */
export const ocrQueue: OcrItem[] = [
  {
    id: 'OCR-1908',
    file: 'VGM_EGLV142600881.pdf',
    job: 'HPH-SEA-2610-0142',
    customer: 'Dệt Minh Phát',
    source: 'Email khách',
    receivedAt: '19/10 · 08:02',
    predictedType: 'VGM',
    typeConfidence: 97,
    reason: '1 trường độ tin cậy thấp',
    resolves: 'VGM (đang thiếu, cut-off 17:00 hôm nay)',
    preview: {
      title: 'VERIFIED GROSS MASS DECLARATION',
      lines: ['Shipper: DET MINH PHAT CO., LTD', 'Booking No: EGLV142600881', 'EITU1482036 · 12.950 KG', 'EGHU9021173 · 13.270 KG', 'Method: 1 (weighing packed container)', 'Signed: Pham Van Duc · 18/10/2026'],
    },
    fields: [
      { label: 'Số booking', value: 'EGLV142600881', confidence: 99, ref: { source: 'Booking BK-2610-0088', value: 'EGLV142600881', match: true } },
      { label: 'Container 1', value: 'EITU1482036', confidence: 98, ref: { source: 'Job', value: 'EITU1482036', match: true } },
      { label: 'VGM container 1', value: '12.950 kg', confidence: 93 },
      { label: 'Container 2', value: 'EGHU9021173', confidence: 97, ref: { source: 'Job', value: 'EGHU9021173', match: true } },
      { label: 'VGM container 2', value: '13.270 kg', confidence: 64 },
      { label: 'Phương pháp cân', value: 'Phương pháp 1', confidence: 92 },
      { label: 'Người xác nhận', value: 'Phạm Văn Đức', confidence: 88 },
    ],
    insight: {
      tone: 'blue',
      text: 'Tổng VGM 26.220 kg = hàng 18.420 kg theo Packing List + vỏ 2 × 3.900 kg. Số 18.240 kg trên SI nhiều khả năng gõ nhầm, nên sửa SI theo Packing List.',
    },
  },
  {
    id: 'OCR-1904',
    file: 'EIR_EGHU9021173.jpg',
    job: 'HPH-SEA-2610-0142',
    customer: 'Dệt Minh Phát',
    source: 'Driver App',
    receivedAt: '18/10 · 21:40',
    predictedType: 'EIR',
    typeConfidence: 95,
    reason: 'Ảnh chụp mờ, số seal đọc không chắc',
    resolves: 'EIR_EGHU9021173.jpg (chờ duyệt OCR)',
    preview: {
      title: 'PHIẾU GIAO NHẬN CONTAINER (EIR)',
      lines: ['Depot Đình Vũ · Hải Phòng', 'Container: EGHU9021173 · 40HC', 'Seal: EMCQ48221?', 'Xe: 15C-218.46', 'Giờ ra: 18/10/2026 16:25', 'Tình trạng: Sạch, không hư hỏng'],
    },
    fields: [
      { label: 'Số container', value: 'EGHU9021173', confidence: 96, ref: { source: 'Job', value: 'EGHU9021173', match: true } },
      { label: 'Số seal', value: 'EMCQ482211', confidence: 58 },
      { label: 'Bãi', value: 'Depot Đình Vũ', confidence: 94, ref: { source: 'Lệnh vận chuyển', value: 'Depot Đình Vũ', match: true } },
      { label: 'Giờ ra bãi', value: '18/10 · 16:25', confidence: 90 },
      { label: 'Biển số xe', value: '15C-218.46', confidence: 87 },
      { label: 'Tình trạng vỏ', value: 'Sạch, không hư hỏng', confidence: 82 },
    ],
    insight: { tone: 'amber', text: 'Số seal phải khớp với SI và B/L. Nên gọi tài xế xác nhận hoặc yêu cầu chụp lại trước khi duyệt.' },
  },
  {
    id: 'OCR-1903',
    file: 'Packing_list_Delta_IB0128.xlsx',
    job: 'HCM-WH-2610-0055',
    customer: 'Bán lẻ Delta',
    source: 'Email khách',
    receivedAt: '18/10 · 16:12',
    predictedType: 'Packing List',
    typeConfidence: 99,
    reason: 'Một dòng số lượng khác phiếu nhập kho',
    resolves: 'Packing_list_Delta_IB0128.xlsx (chờ duyệt OCR)',
    preview: {
      title: 'PACKING LIST · DELTA RETAIL',
      lines: ['Ref: IB-2610-0128', 'LGPU4821930 / LGPU4822017', 'DL-DET-0412 · Bột giặt 4kg · 620 thùng', 'DL-DAU-1180 · Dầu ăn 1L · 540 thùng', 'DL-GIA-0210 · Giấy vệ sinh · 206 thùng', 'Total: 1.366 cartons'],
    },
    fields: [
      { label: 'Container', value: 'LGPU4821930, LGPU4822017', confidence: 98, ref: { source: 'Phiếu nhập IB-2610-0128', value: 'LGPU 482193-0, LGPU 482201-7', match: true } },
      { label: 'DL-DET-0412', value: '620 thùng', confidence: 97, ref: { source: 'Phiếu nhập', value: '620 thùng', match: true } },
      { label: 'DL-DAU-1180', value: '540 thùng', confidence: 97, ref: { source: 'Phiếu nhập', value: '540 thùng', match: true } },
      { label: 'DL-GIA-0210', value: '206 thùng', confidence: 71, ref: { source: 'Phiếu nhập', value: '260 thùng', match: false } },
      { label: 'Tổng số thùng', value: '1.366 thùng', confidence: 95, ref: { source: 'Phiếu nhập', value: '1.420 thùng', match: false } },
    ],
    insight: { tone: 'amber', text: 'Có thể OCR đọc đảo chữ số (260 → 206), hoặc khách sửa số lượng. Kiểm tra file gốc trước khi cập nhật phiếu nhập kho.' },
  },
  {
    id: 'OCR-1909',
    file: 'Invoice_PL_DMP-2610-22.pdf',
    job: 'HPH-SEA-2610-0150',
    customer: 'Dệt Minh Phát',
    source: 'Email khách',
    receivedAt: '19/10 · 07:48',
    predictedType: 'Commercial Invoice + Packing List',
    typeConfidence: 81,
    reason: 'Một file chứa 2 loại chứng từ, cần tách',
    resolves: 'Commercial Invoice và Packing List (đang thiếu)',
    preview: {
      title: 'COMMERCIAL INVOICE / PACKING LIST',
      lines: ['Seller: DET MINH PHAT CO., LTD', 'Buyer: BLUE HARBOR APPAREL INC.', 'Invoice No: DMP-EXP-2610-22', "Ladies' blouses · 9.600 pcs", 'Amount: USD 96.000,00 · FOB Hai Phong', 'Page 2: 800 cartons · 9.860 kg'],
    },
    fields: [
      { label: 'Số invoice', value: 'DMP-EXP-2610-22', confidence: 96 },
      { label: 'Người mua', value: 'BLUE HARBOR APPAREL INC.', confidence: 94, ref: { source: 'SI nháp', value: 'BLUE HARBOR APPAREL INC.', match: true } },
      { label: 'Điều kiện giao hàng', value: 'FOB Hai Phong', confidence: 98, ref: { source: 'Job', value: 'FOB Hải Phòng', match: true } },
      { label: 'Trị giá', value: 'USD 96.000,00', confidence: 93 },
      { label: 'Số thùng', value: '800 thùng', confidence: 90 },
      { label: 'Trọng lượng cả bì', value: '9.860 kg', confidence: 89 },
    ],
    insight: { tone: 'blue', text: 'Duyệt sẽ tách thành 2 chứng từ: trang 1 là Commercial Invoice, trang 2 là Packing List, cùng gắn vào job HPH-SEA-2610-0150.' },
  },
];

/** Số chứng từ đã tự duyệt hôm nay vì mọi trường đạt ngưỡng 95% */
export const autoApprovedToday = 14;
export const OCR_THRESHOLD = 95;

/** Chi tiết thời hạn và tác động của từng chứng từ thiếu hoặc lệch */
const alertMeta: Record<string, Pick<DocAlert, 'blocks' | 'deadline' | 'urgency' | 'party' | 'action'> & { detail?: string }> = {
  'HPH-SEA-2610-0142|Packing_List_BH-26-0918.xlsx': { blocks: 'Gửi SI cho hãng tàu', deadline: '12:00 hôm nay', urgency: 'today', party: 'Nội bộ · CS', action: 'Sửa SI' },
  'HPH-SEA-2610-0142|VGM': { blocks: 'Hạ bãi, xếp tàu', deadline: '17:00 hôm nay', urgency: 'today', party: 'Khách hàng', action: 'Duyệt VGM vừa nhận', detail: 'Khách đã gửi VGM lúc 08:02, đang chờ duyệt OCR' },
  'HPH-SEA-2610-0142|Tờ khai xuất khẩu': { blocks: 'Hạ bãi, xếp tàu', deadline: '20/10 · 17:00', urgency: 'soon', party: 'Nội bộ · Hải quan', action: 'Mở tờ khai' },
  'HCM-AIR-2610-0087|PackingList_AK-FRA-2610.pdf': { blocks: 'Khai hải quan xuất', deadline: '14:00 hôm nay', urgency: 'today', party: 'Khách hàng', action: 'Gửi khách xác nhận' },
  'HCM-AIR-2610-0087|Chứng nhận điều kiện bảo quản': { blocks: 'Hạ hàng tại TCS', deadline: '20/10 · 12:00', urgency: 'soon', party: 'Khách hàng', action: 'Nhắc khách', detail: 'Hãng bay yêu cầu cho hàng 2–8°C' },
  'HPH-SEA-2610-0118|LGHPH2610118': { blocks: 'Phát hành House B/L', deadline: 'Quá hạn từ 18/10', urgency: 'overdue', party: 'Nội bộ · CS', action: 'Sửa B/L' },
  'HCM-TRK-2610-0198|POD': { blocks: 'Xuất hóa đơn', deadline: 'Quá hạn từ 15/10', urgency: 'overdue', party: 'Tài xế · Đông Á', action: 'Nhắc tài xế' },
  'HPH-SEA-2610-0131|Chứng thư hun trùng': { blocks: 'Hồ sơ hải quan', deadline: '16:30 hôm nay', urgency: 'today', party: 'Khử trùng Hải Phòng', action: 'Gọi nhà cung cấp' },
  'HPH-SEA-2610-0131|C/O form AANZ': { blocks: 'Hồ sơ hải quan', deadline: '16:30 hôm nay', urgency: 'today', party: 'Khách hàng', action: 'Nhắc khách' },
  'HPH-SEA-2610-0150|Commercial Invoice': { blocks: 'Soạn SI', deadline: '22/10 · 12:00', urgency: 'later', party: 'Khách hàng', action: 'Duyệt file vừa nhận', detail: 'Khách đã gửi lúc 07:48, đang chờ duyệt OCR' },
  'HPH-SEA-2610-0150|Packing List': { blocks: 'Soạn SI', deadline: '22/10 · 12:00', urgency: 'later', party: 'Khách hàng', action: 'Duyệt file vừa nhận', detail: 'Nằm chung file với Invoice' },
  'HCM-WH-2610-0055|Lệnh giao hàng (D/O)': { blocks: 'Lấy container tại Cát Lái', deadline: '20/10 · 09:00', urgency: 'soon', party: 'Hãng tàu', action: 'Gửi yêu cầu D/O' },
  'HCM-SEA-2610-0120|Debit note': { blocks: 'Thu tiền khách', deadline: 'Quá hạn từ 16/10', urgency: 'overdue', party: 'Nội bộ · Kế toán', action: 'Tạo debit note' },
};

/** Chứng từ thiếu hoặc lệch, đọc từ chứng từ của các job */
export const docAlerts: DocAlert[] = jobs.flatMap((j) =>
  j.documents
    .filter((d) => d.status === 'Thiếu' || d.status === 'Lệch')
    .map((d) => {
      const m = alertMeta[`${j.code}|${d.name}`] ?? { blocks: '—', deadline: '—', urgency: 'later' as const, party: 'Khách hàng', action: 'Nhắc' };
      return {
        id: `${j.code}|${d.name}`,
        job: j.code,
        customer: j.customer,
        doc: d.name,
        type: d.type,
        kind: d.status as DocAlert['kind'],
        detail: m.detail ?? d.note ?? (d.status === 'Thiếu' ? 'Chưa nhận được' : ''),
        blocks: m.blocks,
        deadline: m.deadline,
        urgency: m.urgency,
        party: m.party,
        action: m.action,
      };
    }),
);

export const uploadChannels = [
  { name: 'Email docs@logiai.vn', today: 18, note: 'Tự đọc file đính kèm, gắn job theo số booking / B/L trong tiêu đề' },
  { name: 'Portal khách hàng', today: 7, note: 'Khách tải lên trực tiếp trong job của mình' },
  { name: 'Driver App', today: 12, note: 'Ảnh EIR, POD, biên bản do tài xế chụp' },
  { name: 'Hệ thống HQ điện tử', today: 2, note: 'Tờ khai, kết quả phân luồng từ VNACCS' },
];

export const recentUploads: UploadItem[] = [
  { id: 'UP-2210', file: 'Invoice_PL_DMP-2610-22.pdf', size: '1,4 MB', channel: 'Email', time: '07:48', by: 'acc@detminhphat.vn', type: 'Invoice + Packing List', job: 'HPH-SEA-2610-0150', state: 'Chờ duyệt' },
  { id: 'UP-2211', file: 'VGM_EGLV142600881.pdf', size: '220 KB', channel: 'Email', time: '08:02', by: 'logistics@detminhphat.vn', type: 'VGM', job: 'HPH-SEA-2610-0142', state: 'Chờ duyệt' },
  { id: 'UP-2209', file: 'Arrival_Notice_COSU6251180.pdf', size: '310 KB', channel: 'Email', time: '07:35', by: 'cs@cosco.com.vn', type: 'Arrival Notice', job: 'HCM-WH-2610-0055', state: 'Đã lưu' },
  { id: 'UP-2208', file: 'IMG_20261019_0712.jpg', size: '3,1 MB', channel: 'Driver App', time: '07:12', by: 'Tài xế Lương Văn Sáng', state: 'Không nhận diện' },
  { id: 'UP-2207', file: 'Phieu_can_15C-302.19.jpg', size: '1,8 MB', channel: 'Driver App', time: '06:58', by: 'Tài xế Trần Quốc Toản', type: 'Phiếu cân xe', state: 'Đã lưu' },
  { id: 'UP-2206', file: 'Tokhai_10584601873_phanluong.xml', size: '24 KB', channel: 'VNACCS', time: '06:40', by: 'Hệ thống', type: 'Kết quả phân luồng', job: 'HCM-WH-2610-0055', state: 'Đã lưu' },
];
