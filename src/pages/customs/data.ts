import type { Declaration, Permit } from './types';

export const declarations: Declaration[] = [
  {
    number: '10584601873', job: 'HCM-WH-2610-0055', customer: 'Bán lẻ Delta', direction: 'Nhập', typeCode: 'A11', typeName: 'Nhập kinh doanh tiêu dùng',
    office: 'Chi cục HQ CK cảng Sài Gòn KV I', declarant: 'Lan Anh', registeredAt: '17/10 · 10:15', channel: 'Đỏ', status: 'Chờ kiểm hóa',
    inspection: { time: 'hôm nay 14:00', place: 'Bãi kiểm hóa Cát Lái, khu B', officer: 'Đội kiểm hóa số 2' },
    exchangeRate: 25380, duty: 76540000, vat: 112300000, fees: 20000, pay: 'Đã nộp',
    lines: [
      { hs: '3402.50', desc: 'Nước giặt dạng lỏng 3,8 L', qty: '620 thùng', value: 18600, rate: '15%' },
      { hs: '1517.90', desc: 'Dầu ăn thực vật 1 L', qty: '540 thùng', value: 16200, rate: '10%' },
      { hs: '4818.10', desc: 'Giấy vệ sinh cuộn', qty: '260 thùng', value: 7000, rate: '20%' },
    ],
    messages: [
      { label: 'Truyền tờ khai lên VNACCS', meta: '17/10 · 10:15', state: 'done' },
      { label: 'Phân luồng đỏ · kiểm tra thực tế hàng hóa', meta: '17/10 · 10:22', state: 'late' },
      { label: 'Nộp thuế điện tử', meta: '17/10 · 15:40', state: 'done' },
      { label: 'Kiểm hóa tại bãi Cát Lái', meta: 'Hôm nay 14:00', state: 'doing' },
      { label: 'Thông quan, kéo container về kho Tân Uyên', state: 'todo' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Email nhà cung cấp', state: 'ok' },
      { name: 'Packing List', source: 'Email nhà cung cấp', state: 'ok' },
      { name: 'Bill of Lading', source: 'Email hãng tàu', state: 'ok' },
      { name: 'Giấy chứng nhận hợp quy (nước giặt)', source: 'Portal khách', state: 'ok' },
      { name: 'Lệnh giao hàng (D/O)', source: '—', state: 'missing', note: 'Lấy D/O trước khi kéo container' },
    ],
    crossChecks: [
      { label: 'Số kiện Invoice = Packing List = B/L', state: 'ok', detail: '1.420 thùng' },
      { label: 'Trị giá khai khớp Invoice', state: 'ok', detail: '41.800 USD' },
    ],
  },
  {
    number: '30584712630', job: 'HPH-SEA-2610-0142', customer: 'Dệt Minh Phát', direction: 'Xuất', typeCode: 'B11', typeName: 'Xuất kinh doanh',
    office: 'Chi cục HQ CK cảng Hải Phòng KV III', declarant: 'Lan Anh', status: 'Chờ truyền',
    exchangeRate: 25380, duty: 0, vat: 0, fees: 20000, pay: 'Chưa nộp',
    lines: [{ hs: '6205.20', desc: 'Áo sơ mi nam, 100% cotton', qty: '1.860 thùng · 18.600 chiếc', value: 98400, rate: '0%' }],
    messages: [
      { label: 'Lập tờ khai nháp từ Invoice và Packing List (AI)', meta: '18/10 · 16:00', state: 'done' },
      { label: 'Kiểm tra trọng lượng với Packing List', meta: 'Lệch 180 kg', state: 'late' },
      { label: 'Truyền tờ khai lên VNACCS', meta: 'Trước 20/10 · 12:00', state: 'todo' },
      { label: 'Phân luồng, thông quan', state: 'todo' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Portal khách', state: 'ok' },
      { name: 'Packing List', source: 'Portal khách', state: 'mismatch', note: 'Trọng lượng 18.420 kg, tờ khai nháp ghi 18.240 kg' },
      { name: 'Hợp đồng mua bán', source: 'Email khách', state: 'ok' },
      { name: 'Booking Confirmation', source: 'Email hãng tàu', state: 'ok' },
    ],
    crossChecks: [
      { label: 'Số kiện Invoice = Packing List', state: 'ok', detail: '1.860 thùng' },
      { label: 'Trọng lượng tờ khai = Packing List', state: 'mismatch', detail: '18.240 kg ≠ 18.420 kg' },
      { label: 'Mã HS khớp mô tả hàng', state: 'ok' },
    ],
  },
  {
    number: '30584790115', job: 'HCM-AIR-2610-0087', customer: 'Dược An Khang', direction: 'Xuất', typeCode: 'B11', typeName: 'Xuất kinh doanh',
    office: 'Chi cục HQ CK sân bay Tân Sơn Nhất', declarant: 'Lan Anh', status: 'Đang soạn',
    exchangeRate: 25380, duty: 0, vat: 0, fees: 20000, pay: 'Chưa nộp',
    lines: [{ hs: '3004.90', desc: 'Thuốc thành phẩm, bảo quản 2–8°C', qty: '18 kiện · 1.240 kg', value: 186000, rate: '0%' }],
    messages: [
      { label: 'Nhận Invoice, Packing List từ khách', meta: '16/10 – 18/10', state: 'done' },
      { label: 'Đối chiếu Packing List với Invoice', meta: 'OCR lệch 2 dòng · hạn 14:00', state: 'doing' },
      { label: 'Truyền tờ khai', meta: 'Trước 20/10 · 12:00', state: 'todo' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Email khách', state: 'ok' },
      { name: 'Packing List', source: 'Email khách', state: 'mismatch', note: '2 dòng lệch số lượng với Invoice' },
      { name: 'Giấy phép xuất khẩu dược phẩm', source: 'Portal khách', state: 'ok' },
    ],
    crossChecks: [
      { label: 'Số lượng từng dòng Invoice = Packing List', state: 'mismatch', detail: 'Dòng 4 và 7 lệch' },
      { label: 'Giấy phép còn hiệu lực', state: 'ok', detail: 'GP-XK-2026-118 đến 31/12/2026' },
    ],
  },
  {
    job: 'HPH-SEA-2610-0131', customer: 'Nội thất Hòa Bình', direction: 'Xuất', typeCode: 'B11', typeName: 'Xuất kinh doanh',
    office: 'Chi cục HQ CK cảng Hải Phòng KV III', declarant: 'Lan Anh', status: 'Đang soạn',
    exchangeRate: 25380, duty: 0, vat: 0, fees: 20000, pay: 'Chưa nộp',
    lines: [{ hs: '9403.60', desc: 'Bàn ghế ăn bằng gỗ cao su', qty: '612 kiện', value: 64200, rate: '0%' }],
    messages: [
      { label: 'Nhận Invoice, Packing List', meta: '15/10', state: 'done' },
      { label: 'Chờ chứng thư hun trùng và C/O form AANZ', meta: 'Hạn hồ sơ 16:30 hôm nay', state: 'doing' },
      { label: 'Truyền tờ khai', meta: 'Trước 21/10', state: 'todo' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Email khách', state: 'ok' },
      { name: 'Packing List', source: 'Email khách', state: 'ok' },
      { name: 'Hợp đồng mua bán', source: 'Email khách', state: 'ok' },
      { name: 'Chứng thư hun trùng', source: '—', state: 'missing', note: 'Dự kiến 20/10' },
      { name: 'C/O form AANZ', source: '—', state: 'missing', note: 'Đang xin tại Bộ Công Thương' },
    ],
    crossChecks: [{ label: 'Số kiện Invoice = Packing List', state: 'ok', detail: '612 kiện' }],
  },
  {
    number: '30584633201', job: 'HPH-SEA-2610-0118', customer: 'Gỗ Lâm Phát', direction: 'Xuất', typeCode: 'B11', typeName: 'Xuất kinh doanh',
    office: 'Chi cục HQ CK cảng Hải Phòng KV III', declarant: 'Lan Anh', registeredAt: '16/10 · 09:50', clearedAt: '16/10 · 11:20', clearHours: 1.5,
    channel: 'Xanh', status: 'Đã thông quan', exchangeRate: 25350, duty: 0, vat: 0, fees: 20000, pay: 'Đã nộp',
    lines: [{ hs: '4412.33', desc: 'Gỗ dán, lõi bạch đàn, dày 18 mm', qty: '28 kiện · 27,5 m³', value: 9350, rate: '0%' }],
    messages: [
      { label: 'Truyền tờ khai', meta: '16/10 · 09:50', state: 'done' },
      { label: 'Phân luồng xanh', meta: '16/10 · 09:52', state: 'done' },
      { label: 'Thông quan', meta: '16/10 · 11:20', state: 'done' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Portal khách', state: 'ok' },
      { name: 'Packing List', source: 'Portal khách', state: 'ok' },
      { name: 'Giấy kiểm dịch thực vật', source: 'Portal khách', state: 'ok' },
    ],
    crossChecks: [{ label: 'Số kiện Invoice = Packing List', state: 'ok', detail: '28 kiện' }],
  },
  {
    number: '10584552117', job: 'HCM-SEA-2610-0120', customer: 'Nội thất Hòa Bình', direction: 'Nhập', typeCode: 'A11', typeName: 'Nhập kinh doanh tiêu dùng',
    office: 'Chi cục HQ CK cảng Sài Gòn KV I', declarant: 'Lan Anh', registeredAt: '12/10 · 15:30', clearedAt: '13/10 · 10:40', clearHours: 19.2,
    channel: 'Vàng', status: 'Đã thông quan', exchangeRate: 25360, duty: 18420000, vat: 31360000, fees: 20000, pay: 'Đã chuyển Kế toán',
    lines: [
      { hs: '8302.10', desc: 'Bản lề bằng thép', qty: '310 thùng', value: 7400, rate: '5% (form E)' },
      { hs: '8302.42', desc: 'Ray trượt ngăn kéo', qty: '480 thùng', value: 4950, rate: '5% (form E)' },
    ],
    messages: [
      { label: 'Truyền tờ khai', meta: '12/10 · 15:30', state: 'done' },
      { label: 'Phân luồng vàng · kiểm tra hồ sơ', meta: '12/10 · 15:41', state: 'done' },
      { label: 'Bổ sung bản gốc C/O form E', meta: '13/10 · 08:30', state: 'done' },
      { label: 'Thông quan', meta: '13/10 · 10:40', state: 'done' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Email đại lý', state: 'ok' },
      { name: 'Packing List', source: 'Email đại lý', state: 'ok' },
      { name: 'Bill of Lading', source: 'Email đại lý', state: 'ok' },
      { name: 'C/O form E', source: 'Bản gốc chuyển phát', state: 'ok' },
    ],
    crossChecks: [{ label: 'Trị giá khai khớp Invoice', state: 'ok', detail: '12.350 USD' }],
  },
  {
    number: '30584390022', job: 'HCM-SEA-2609-0377', customer: 'Dệt Minh Phát', direction: 'Xuất', typeCode: 'B11', typeName: 'Xuất kinh doanh',
    office: 'Chi cục HQ CK cảng Sài Gòn KV I', declarant: 'Lan Anh', registeredAt: '29/09 · 08:40', clearedAt: '29/09 · 10:05', clearHours: 1.4,
    channel: 'Xanh', status: 'Đã thông quan', exchangeRate: 25340, duty: 0, vat: 0, fees: 20000, pay: 'Đã nộp',
    lines: [{ hs: '6109.10', desc: 'Áo thun dệt kim, cotton', qty: '240 thùng', value: 21600, rate: '0%' }],
    messages: [
      { label: 'Truyền tờ khai', meta: '29/09 · 08:40', state: 'done' },
      { label: 'Phân luồng xanh, thông quan', meta: '29/09 · 10:05', state: 'done' },
    ],
    docs: [
      { name: 'Commercial Invoice', source: 'Portal khách', state: 'ok' },
      { name: 'Packing List', source: 'Portal khách', state: 'ok' },
    ],
    crossChecks: [{ label: 'Số kiện Invoice = Packing List', state: 'ok', detail: '240 thùng' }],
  },
];

export const permits: Permit[] = [
  {
    code: 'PL-2026-0331', kind: 'Giấy phép nhập khẩu', customer: 'Điện tử Kim Hưng', issuer: 'Cục Tần số vô tuyến điện',
    issued: '24/04/2026', expiry: '24/10/2026', status: 'Sắp hết hạn', usage: 'Đã dùng 3/4 lô',
    note: 'Lô linh kiện từ Thượng Hải (RFQ-2610-0211) có thể về sau ngày hết hạn. Cần xin gia hạn.',
  },
  {
    code: 'GP-XK-2026-118', kind: 'Giấy phép xuất khẩu dược phẩm', customer: 'Dược An Khang', job: 'HCM-AIR-2610-0087', issuer: 'Cục Quản lý Dược',
    issued: '02/01/2026', expiry: '31/12/2026', status: 'Còn hiệu lực', usage: 'Đã dùng 11 lô',
  },
  {
    code: 'AANZ-2610-HP-0912', kind: 'C/O form AANZ', customer: 'Nội thất Hòa Bình', job: 'HPH-SEA-2610-0131', issuer: 'Phòng Quản lý XNK Hải Phòng',
    expiry: 'Dự kiến cấp 21/10', status: 'Đang xin', note: 'Đã nộp hồ sơ 17/10. Cần có trước khi truyền tờ khai để khách được ưu đãi thuế tại Úc.',
  },
  {
    code: 'FUM-2610-2214', kind: 'Chứng thư hun trùng', customer: 'Nội thất Hòa Bình', job: 'HPH-SEA-2610-0131', issuer: 'Công ty Khử trùng Hải Phòng',
    expiry: 'Dự kiến cấp 20/10', status: 'Đang xin', note: 'Hun trùng 3 container ngày 19/10.',
  },
  {
    code: 'E2610-0458', kind: 'C/O form E', customer: 'Nội thất Hòa Bình', job: 'HCM-SEA-2610-0120', issuer: 'Bộ Thương mại Trung Quốc (MOFCOM)',
    issued: '03/10/2026', expiry: '03/10/2027', status: 'Đã sử dụng', usage: 'Tờ khai 10584552117',
  },
  {
    code: 'KDTV-2610-0815', kind: 'Giấy chứng nhận kiểm dịch thực vật', customer: 'Gỗ Lâm Phát', job: 'HPH-SEA-2610-0118', issuer: 'Chi cục Kiểm dịch thực vật vùng II',
    issued: '15/10/2026', expiry: '14/11/2026', status: 'Đã sử dụng', usage: 'Tờ khai 30584633201',
  },
  {
    code: 'HC-2610-NAF-0337', kind: 'Chứng thư vệ sinh thủy sản', customer: 'Thực phẩm Sao Việt', issuer: 'Cục Thủy sản (NAFIQAD vùng 4)',
    expiry: 'Dự kiến cấp 24/10', status: 'Đang xin', note: 'Cho lô 1 × 40RF đi Hong Kong, booking BK-2610-0099.',
  },
  {
    code: 'VNREX-0312456789', kind: 'Mã số REX (tự chứng nhận xuất xứ EU)', customer: 'Dệt Minh Phát', issuer: 'Bộ Công Thương',
    issued: '15/03/2022', expiry: 'Không thời hạn', status: 'Còn hiệu lực', usage: 'Dùng cho hàng đi EU',
  },
  {
    code: 'PL-2025-0877', kind: 'Giấy phép nhập khẩu', customer: 'Thép Thành Công', issuer: 'Bộ Công Thương',
    issued: '10/09/2025', expiry: '10/09/2026', status: 'Hết hạn', note: 'Khách đang tạm ngừng giao dịch.',
  },
];

/** Phân luồng 30 ngày gần nhất */
export const channelStats = { total: 124, Xanh: 84, 'Vàng': 32, 'Đỏ': 8 };
export const clearHoursByChannel = [
  { label: 'Luồng xanh', value: 1.6 },
  { label: 'Luồng vàng', value: 18.5 },
  { label: 'Luồng đỏ', value: 46 },
];
