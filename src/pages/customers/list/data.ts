import type { StatItem } from '../../../types';
import type { Customer } from '../types';

export const customerStats: StatItem[] = [
  { label: 'Khách đang giao dịch', value: '214', note: '+5 trong tháng 10' },
  { label: 'Khách tiềm năng', value: '87', note: '23 có RFQ đang mở' },
  { label: 'Vượt 90% hạn mức công nợ', value: '9', note: 'Cần Kế toán xem lại', valueTone: 'red', noteTone: 'red' },
  { label: 'Hợp đồng sắp hết hạn · 60 ngày', value: '12', note: 'Xem ở Hợp đồng và SLA', valueTone: 'amber' },
];

const defaultContacts = (a: string, b: string) => [
  { initials: initials(a), name: a, title: 'Trưởng phòng xuất nhập khẩu', phone: '0903 412 588' },
  { initials: initials(b), name: b, title: 'Kế toán công nợ', phone: '0938 220 714' },
];

function initials(name: string) {
  const parts = name.split(' ');
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const customers: Customer[] = [
  {
    code: 'KH-00128', name: 'Công ty TNHH Dệt Minh Phát', shortName: 'Dệt Minh Phát', taxCode: '0312456789',
    status: 'Đang giao dịch', sales: 'Quốc Bảo', debt: 2840, limit: 3000, overdue: 420, jobs90: 46,
    lastContact: 'Hôm nay · email', industry: 'Xuất khẩu dệt may', paymentTerm: 'Công nợ 30 ngày',
    address: 'KCN Tân Tạo, Bình Tân, TP.HCM', contract: 'HĐ-2025-041 · đến 31/12/2026', routes: 'HPH/HCM → Mỹ, EU',
    contacts: [
      { initials: 'TH', name: 'Trần Thu Hà', title: 'Trưởng phòng xuất nhập khẩu', phone: '0903 412 588' },
      { initials: 'NV', name: 'Nguyễn Văn Vũ', title: 'Kế toán công nợ', phone: '0938 220 714' },
    ],
    history: [
      { job: 'HPH-SEA-2610-0142', date: '15/10', desc: 'FCL 2×40HC · HPH → Los Angeles', amount: '7.420 USD' },
      { job: 'HPH-SEA-2610-0150', date: '14/10', desc: 'FCL 1×40HC · HPH → Long Beach', amount: '3.910 USD' },
      { job: 'HCM-SEA-2609-0377', date: '28/09', desc: 'LCL 12 CBM · HCM → Rotterdam', amount: '1.260 USD' },
    ],
  },
  {
    code: 'KH-00093', name: 'Công ty CP Dược phẩm An Khang', shortName: 'Dược An Khang', taxCode: '0301987452',
    status: 'Đang giao dịch', sales: 'Lan Anh', debt: 960, limit: 2000, overdue: 0, jobs90: 31,
    lastContact: 'Hôm qua · cuộc gọi', industry: 'Dược phẩm, hàng lạnh', paymentTerm: 'Công nợ 45 ngày',
    address: 'KCN Hiệp Phước, Nhà Bè, TP.HCM', contract: 'HĐ-2024-117 · đến 31/10/2026', routes: 'SGN → EU',
    contacts: [
      { initials: 'LC', name: 'Lê Minh Châu', title: 'Giám đốc chuỗi cung ứng', phone: '0909 118 342' },
      { initials: 'PT', name: 'Phạm Thảo', title: 'Kế toán công nợ', phone: '0912 664 019' },
    ],
    history: [
      { job: 'HCM-AIR-2610-0087', date: '16/10', desc: 'Air 1.240 kg · SGN → Frankfurt', amount: '6.150 USD' },
      { job: 'HCM-AIR-2610-0061', date: '09/10', desc: 'Air 420 kg · SGN → Amsterdam', amount: '2.380 USD' },
    ],
  },
  {
    code: 'KH-00211', name: 'Công ty TNHH Nội thất Hòa Bình', shortName: 'Nội thất Hòa Bình', taxCode: '3702114586',
    status: 'Đang giao dịch', sales: 'Quốc Bảo', debt: 1120, limit: 1500, overdue: 0, jobs90: 22,
    lastContact: '3 ngày trước · gặp mặt', industry: 'Đồ gỗ nội thất', paymentTerm: 'Công nợ 30 ngày',
    address: 'KCN Nam Tân Uyên, Bình Dương', contract: 'HĐ-2026-008 · đến 28/02/2027', routes: 'HPH/HCM → Úc, Nhật',
    contacts: defaultContacts('Đỗ Khải', 'Lý Thanh Mai'),
    history: [
      { job: 'HPH-SEA-2610-0131', date: '13/10', desc: 'FCL 3×40HC · HPH → Sydney', amount: '8.900 USD' },
    ],
  },
  {
    code: 'KH-00305', name: 'Công ty TNHH Gỗ Lâm Phát', shortName: 'Gỗ Lâm Phát', taxCode: '0315602281',
    status: 'Đang giao dịch', sales: 'Thu Trang', debt: 970, limit: 1000, overdue: 150, jobs90: 14,
    lastContact: '1 tuần trước · email', industry: 'Gỗ ván ép', paymentTerm: 'Công nợ 15 ngày',
    address: 'KCN Đình Vũ, Hải Phòng', contract: 'HĐ-2025-118 · đến 30/11/2026', routes: 'HPH → Hàn Quốc',
    contacts: defaultContacts('Võ Lâm', 'Trịnh Hồng'),
    history: [
      { job: 'HPH-SEA-2610-0118', date: '12/10', desc: 'FCL 1×20GP · HPH → Busan', amount: '1.180 USD' },
    ],
  },
  {
    code: 'KH-00342', name: 'Công ty CP Thực phẩm Sao Việt', shortName: 'Thực phẩm Sao Việt', taxCode: '0316045579',
    status: 'Đang giao dịch', sales: 'Lan Anh', debt: 410, limit: 1200, overdue: 0, jobs90: 19,
    lastContact: '2 ngày trước · Portal', industry: 'Thực phẩm đông lạnh', paymentTerm: 'Công nợ 30 ngày',
    address: 'KCN Long Hậu, Long An', contract: 'HĐ-2025-093 · đến 30/06/2027', routes: 'Long An → Cát Lái',
    contacts: defaultContacts('Hồ Quang Sơn', 'Đinh Bảo Ngọc'),
    history: [
      { job: 'HCM-TRK-2610-0210', date: '17/10', desc: 'Trucking 1×40RF · Long An → Cát Lái', amount: '14,5 tr ₫' },
      { job: 'HCM-TRK-2610-0198', date: '14/10', desc: 'FTL 1×40HC · Cát Lái → Mỹ Phước', amount: '6,8 tr ₫' },
    ],
  },
  {
    code: 'KH-00418', name: 'Công ty TNHH Cà phê Tây Nguyên', shortName: 'Cà phê Tây Nguyên', taxCode: '6001223448',
    status: 'Tiềm năng', sales: 'Thu Trang', debt: 0, limit: null, overdue: 0, jobs90: 0,
    lastContact: 'Hôm nay · RFQ qua Portal', industry: 'Cà phê nhân xuất khẩu', paymentTerm: 'Trả trước',
    address: 'TP. Buôn Ma Thuột, Đắk Lắk', contract: '—', routes: 'HCM → Hamburg',
    contacts: defaultContacts('Y Bích', 'Nguyễn Hoài'),
    history: [],
  },
  {
    code: 'KH-00421', name: 'Công ty CP Điện tử Kim Hưng', shortName: 'Điện tử Kim Hưng', taxCode: '0108556120',
    status: 'Tiềm năng', sales: 'Quốc Bảo', debt: 0, limit: null, overdue: 0, jobs90: 1,
    lastContact: '4 ngày trước · gặp mặt', industry: 'Linh kiện điện tử', paymentTerm: 'Trả trước',
    address: 'KCN Thăng Long, Hà Nội', contract: 'HĐ-2026-031 · nháp', routes: 'Thượng Hải → Hà Nội',
    contacts: defaultContacts('Kim Văn Hưng', 'Trần Thị Mến'),
    history: [],
  },
  {
    code: 'KH-00077', name: 'Công ty TNHH Thép Thành Công', shortName: 'Thép Thành Công', taxCode: '3600788412',
    status: 'Tạm ngừng', sales: 'Thu Trang', debt: 220, limit: 800, overdue: 220, jobs90: 3,
    lastContact: '3 tuần trước · email', industry: 'Thép cuộn, hàng nặng', paymentTerm: 'Trả trước (tạm ngừng)',
    address: 'KCN Sóng Thần, Bình Dương', contract: 'HĐ-2023-052 · hết hạn', routes: 'Bình Dương nội địa',
    contacts: defaultContacts('Tạ Công', 'Mai Hương'),
    history: [],
  },
];
