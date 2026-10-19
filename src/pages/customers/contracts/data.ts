import type { StatItem } from '../../../types';
import type { Contract } from '../types';

export const contractStats: StatItem[] = [
  { label: 'Hợp đồng đang hiệu lực', value: '168', note: '142 khung năm, 26 theo job' },
  { label: 'Sắp hết hạn · 60 ngày', value: '12', note: '5 đã gửi phụ lục gia hạn', valueTone: 'amber' },
  { label: 'SLA đạt · tháng 9', value: '91%', note: '7 hợp đồng có chỉ tiêu trượt', noteTone: 'red' },
  { label: 'Bản nháp chờ duyệt', value: '4', note: 'Quy trình duyệt: Trưởng phòng → Giám đốc' },
];

const genericSla = (pct: number) => [
  { name: 'Phản hồi báo giá', actual: '3,8 giờ', target: '≤ 4 giờ', percent: 50, marker: 50 },
  { name: 'Giao/đi đúng lịch', actual: `${pct}%`, target: '≥ 95%', percent: pct, marker: 95 },
];

const genericDocs = (code: string) => [
  { name: `${code}_ban_ky.pdf`, version: 'v1 · đã ký' },
  { name: 'Bieu_phi_dinh_kem.pdf', version: 'v2' },
];

export const contracts: Contract[] = [
  {
    code: 'HĐ-2024-117', customer: 'Dược phẩm An Khang', scope: 'Air xuất, hàng lạnh', type: 'Khung năm',
    from: '01/11/2024', to: '31/10/2026', remaining: 'Còn 13 ngày', remainingTone: 'amber', sla: 96, status: 'Sắp hết hạn',
    reminder: 'Đã nhắc 01/10 và 15/10', paymentTerm: 'Công nợ 45 ngày', creditLimit: '2,0 tỷ ₫',
    slaMetrics: [
      { name: 'Phản hồi báo giá', actual: '3,1 giờ', target: '≤ 4 giờ', percent: 40, marker: 50 },
      { name: 'Bay đúng chuyến đã đặt', actual: '97%', target: '≥ 95%', percent: 97, marker: 95 },
      { name: 'Giữ nhiệt độ 2–8°C', actual: '100%', target: '≥ 100%', percent: 100, marker: 100 },
    ],
    documents: [
      { name: 'HĐ-2024-117_ban_ky.pdf', version: 'v2 · đã ký' },
      { name: 'Phu_luc_SLA_HĐ-2024-117.pdf', version: 'v1' },
      { name: 'Bieu_phi_dinh_kem.pdf', version: 'v4' },
    ],
  },
  {
    code: 'HĐ-2025-041', customer: 'Dệt Minh Phát', scope: 'FCL xuất Mỹ, EU', type: 'Khung năm',
    from: '01/01/2025', to: '31/12/2026', remaining: 'Còn 74 ngày', sla: 88, status: 'Hiệu lực',
    reminder: 'Chưa nhắc', paymentTerm: 'Công nợ 30 ngày', creditLimit: '3,0 tỷ ₫',
    slaMetrics: genericSla(88), documents: genericDocs('HĐ-2025-041'),
  },
  {
    code: 'HĐ-2026-008', customer: 'Nội thất Hòa Bình', scope: 'FCL xuất Úc, Nhật', type: 'Khung năm',
    from: '01/03/2026', to: '28/02/2027', remaining: 'Còn 4 tháng', sla: 94, status: 'Hiệu lực',
    reminder: 'Chưa nhắc', paymentTerm: 'Công nợ 30 ngày', creditLimit: '1,5 tỷ ₫',
    slaMetrics: genericSla(94), documents: genericDocs('HĐ-2026-008'),
  },
  {
    code: 'HĐ-2025-093', customer: 'Thực phẩm Sao Việt', scope: 'Xe lạnh Long An – Cát Lái', type: 'Vận tải nội địa',
    from: '01/07/2025', to: '30/06/2027', remaining: 'Còn 20 tháng', sla: 98, status: 'Hiệu lực',
    reminder: 'Chưa nhắc', paymentTerm: 'Công nợ 30 ngày', creditLimit: '1,2 tỷ ₫',
    slaMetrics: genericSla(98), documents: genericDocs('HĐ-2025-093'),
  },
  {
    code: 'HĐ-2026-031', customer: 'Điện tử Kim Hưng', scope: 'Air nhập Trung Quốc', type: 'Khung năm',
    from: '01/11/2026', to: '31/10/2027', remaining: 'Chưa hiệu lực', sla: null, status: 'Nháp chờ duyệt',
    reminder: '—', paymentTerm: 'Trả trước', creditLimit: '—',
    slaMetrics: [], documents: [{ name: 'HĐ-2026-031_nhap.docx', version: 'v3 · nháp' }],
  },
  {
    code: 'HĐ-2025-118', customer: 'Gỗ Lâm Phát', scope: 'FCL xuất Hàn Quốc', type: 'Theo kỳ',
    from: '01/12/2025', to: '30/11/2026', remaining: 'Còn 43 ngày', remainingTone: 'amber', sla: 90, status: 'Sắp hết hạn',
    reminder: 'Đã nhắc 15/10', paymentTerm: 'Công nợ 15 ngày', creditLimit: '1,0 tỷ ₫',
    slaMetrics: genericSla(90), documents: genericDocs('HĐ-2025-118'),
  },
  {
    code: 'HĐ-2023-052', customer: 'Thép Thành Công', scope: 'Hàng nặng Bình Dương', type: 'Vận tải nội địa',
    from: '01/09/2023', to: '31/08/2025', remaining: 'Hết hạn 14 tháng', remainingTone: 'red', sla: null, status: 'Hết hạn',
    reminder: '—', paymentTerm: 'Trả trước', creditLimit: '800 tr ₫',
    slaMetrics: [], documents: genericDocs('HĐ-2023-052'),
  },
];
