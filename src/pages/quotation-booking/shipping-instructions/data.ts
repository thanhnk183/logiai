import type { StatItem } from '../../../types';
import type { ShippingInstruction } from '../types';

export const siStats: StatItem[] = [
  { label: 'SI cần gửi trong 48 giờ', value: '3', note: '1 job cut-off 12:00 hôm nay', valueTone: 'red', noteTone: 'red', module: 'FMS' },
  { label: 'SI đang soạn', value: '5', note: '2 có lệch so với chứng từ', noteTone: 'amber' },
  { label: 'Đã gửi hãng · tuần này', value: '11', note: '9 hãng đã nhận' },
  { label: 'SI phải sửa sau khi gửi', value: '4%', note: '30 ngày gần nhất · mục tiêu dưới 5%', noteTone: 'green' },
];

export const shippingInstructions: ShippingInstruction[] = [
  {
    code: 'SI-2610-0142', job: 'HPH-SEA-2610-0142', booking: 'BK-2610-0088', customer: 'Dệt Minh Phát',
    carrier: 'Evergreen', vessel: 'ORIENT STAR V.112E', pol: 'Hải Phòng', pod: 'Los Angeles',
    cutoff: '12:00 hôm nay', cutoffTone: 'red', status: 'Đang soạn',
    shipper: 'DET MINH PHAT CO., LTD\nTAN TAO INDUSTRIAL PARK, BINH TAN DIST.\nHO CHI MINH CITY, VIETNAM',
    consignee: 'BLUE HARBOR APPAREL INC.\n2200 E 7TH ST, LOS ANGELES\nCA 90023, USA',
    notify: 'SAME AS CONSIGNEE',
    cargoDesc: "READY-MADE GARMENTS\nMEN'S SHIRTS, 100% COTTON\nPO NO. BH-26-0918",
    hsCode: '6205.20', packages: '1.860 thùng carton', grossWeight: '18.240 kg', measurement: '128,4 CBM',
    freightTerm: 'Collect', blType: 'Telex release',
    containers: [
      { no: 'EITU 148203-6', type: '40HC', seal: 'EMCV482931', packages: '940 ctns', weight: '9.220 kg' },
      { no: 'EGHU 902117-3', type: '40HC', seal: '', packages: '920 ctns', weight: '9.020 kg' },
    ],
    checks: [
      { label: 'Số kiện khớp Packing List', state: 'ok' },
      { label: 'Trọng lượng khớp Packing List', state: 'error', detail: 'Packing List: 18.420 kg · SI: 18.240 kg' },
      { label: 'Mô tả hàng khớp Commercial Invoice', state: 'ok' },
      { label: 'Mã HS khớp tờ khai hải quan', state: 'ok' },
      { label: 'Đủ số seal cho tất cả container', state: 'error', detail: 'EGHU 902117-3 chưa có seal' },
      { label: 'Người nhận khớp hợp đồng mua bán', state: 'ok' },
    ],
  },
  {
    code: 'SI-2610-0131', job: 'HPH-SEA-2610-0131', booking: 'BK-2610-0083', customer: 'Nội thất Hòa Bình',
    carrier: 'CMA CGM', vessel: 'CMA CGM TAGE V.0QJ7S', pol: 'Hải Phòng', pod: 'Sydney',
    cutoff: '21/10 · 12:00', cutoffTone: 'amber', status: 'Đang soạn',
    shipper: 'HOA BINH FURNITURE CO., LTD\nNAM TAN UYEN IP, BINH DUONG\nVIETNAM',
    consignee: 'COASTAL HOME LIVING PTY LTD\n18 FOUNDRY RD, SEVEN HILLS\nNSW 2147, AUSTRALIA',
    notify: 'SAME AS CONSIGNEE',
    cargoDesc: 'WOODEN FURNITURE\nDINING TABLES AND CHAIRS\nRUBBERWOOD, FUMIGATED',
    hsCode: '9403.60', packages: '612 kiện', grossWeight: '21.360 kg', measurement: '201,0 CBM',
    freightTerm: 'Prepaid', blType: 'Original 3/3',
    containers: [
      { no: 'CMAU 731045-2', type: '40HC', seal: 'F7712041', packages: '204 pkgs', weight: '7.120 kg' },
      { no: 'CMAU 731112-9', type: '40HC', seal: 'F7712042', packages: '204 pkgs', weight: '7.120 kg' },
      { no: 'TGHU 840273-1', type: '40HC', seal: '', packages: '204 pkgs', weight: '7.120 kg' },
    ],
    checks: [
      { label: 'Số kiện khớp Packing List', state: 'ok' },
      { label: 'Trọng lượng khớp Packing List', state: 'ok' },
      { label: 'Mô tả hàng khớp Commercial Invoice', state: 'ok' },
      { label: 'Có giấy chứng nhận hun trùng', state: 'pending', detail: 'Chờ chứng thư hun trùng, dự kiến 20/10' },
      { label: 'Đủ số seal cho tất cả container', state: 'pending', detail: 'Container thứ 3 đang đóng hàng' },
    ],
  },
  {
    code: 'SI-2610-0150', job: 'HPH-SEA-2610-0150', booking: 'BK-2610-0094', customer: 'Dệt Minh Phát',
    carrier: 'Yang Ming', vessel: 'YM WELLNESS V.087E', pol: 'Hải Phòng', pod: 'Long Beach',
    cutoff: '22/10 · 12:00', status: 'Chưa gửi',
    shipper: 'DET MINH PHAT CO., LTD\nTAN TAO INDUSTRIAL PARK, BINH TAN DIST.\nHO CHI MINH CITY, VIETNAM',
    consignee: 'BLUE HARBOR APPAREL INC.\n2200 E 7TH ST, LOS ANGELES\nCA 90023, USA',
    notify: 'SAME AS CONSIGNEE',
    cargoDesc: "READY-MADE GARMENTS\nWOMEN'S BLOUSES, POLYESTER",
    hsCode: '6206.40', packages: '—', grossWeight: '—', measurement: '—',
    freightTerm: 'Collect', blType: 'Telex release',
    containers: [{ no: 'YMMU 650218-4', type: '40HC', seal: '', packages: '—', weight: '—' }],
    checks: [
      { label: 'Có Packing List', state: 'pending', detail: 'Khách chưa gửi Packing List' },
      { label: 'Có Commercial Invoice', state: 'pending', detail: 'Khách chưa gửi Invoice' },
    ],
  },
  {
    code: 'SI-2610-0118', job: 'HPH-SEA-2610-0118', booking: 'BK-2610-0079', customer: 'Gỗ Lâm Phát',
    carrier: 'HMM', vessel: 'HMM BLESSING V.045E', pol: 'Hải Phòng', pod: 'Busan',
    cutoff: '15/10 · 12:00', status: 'Hãng đã nhận', sentAt: '15/10 · 10:20',
    shipper: 'LAM PHAT WOOD CO., LTD\nDINH VU INDUSTRIAL ZONE\nHAI PHONG, VIETNAM',
    consignee: 'HANSOL WOOD CO., LTD\n55 GANGBYEON-RO, SASANG-GU\nBUSAN, KOREA',
    notify: 'SAME AS CONSIGNEE',
    cargoDesc: 'PLYWOOD\nEUCALYPTUS CORE, 18MM',
    hsCode: '4412.33', packages: '28 kiện', grossWeight: '19.600 kg', measurement: '27,5 CBM',
    freightTerm: 'Prepaid', blType: 'Surrendered',
    containers: [{ no: 'HDMU 212094-7', type: '20GP', seal: 'HMM3390211', packages: '28 pkgs', weight: '19.600 kg' }],
    checks: [
      { label: 'Số kiện khớp Packing List', state: 'ok' },
      { label: 'Trọng lượng khớp Packing List', state: 'ok' },
      { label: 'Mô tả hàng khớp Commercial Invoice', state: 'ok' },
      { label: 'Đủ số seal cho tất cả container', state: 'ok' },
    ],
  },
];
