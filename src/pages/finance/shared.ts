import type { Tone } from '../../types';
import { formatNumber } from '../../utils/format';
import type { ApStatus, ArStatus, ReconStatus } from './types';

export const arStatuses: ArStatus[] = ['Chờ xuất', 'Quá hạn', 'Sắp đến hạn', 'Chưa đến hạn', 'Đã thu'];
export const arTone: Record<ArStatus, Tone> = {
  'Chờ xuất': 'gray',
  'Chưa đến hạn': 'blue',
  'Sắp đến hạn': 'amber',
  'Quá hạn': 'red',
  'Đã thu': 'green',
};

export const apStatuses: ApStatus[] = ['Chờ HĐ NCC', 'Chờ duyệt', 'Đã duyệt', 'Đã thanh toán'];
export const apTone: Record<ApStatus, Tone> = {
  'Chờ HĐ NCC': 'gray',
  'Chờ duyệt': 'amber',
  'Đã duyệt': 'blue',
  'Đã thanh toán': 'green',
};

export const reconTone: Record<ReconStatus, Tone> = {
  'Chưa gửi': 'gray',
  'Đã gửi': 'blue',
  'Có chênh lệch': 'red',
  'Đã xác nhận': 'green',
};

export const vnd = (n: number) => `${formatNumber(n)} ₫`;

/** 188860000 → "188,9 tr ₫"; 2840000000 → "2,84 tỷ ₫" */
export function vndShort(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (abs >= 1e9) return `${sign}${formatNumber(abs / 1e9, 2)} tỷ ₫`;
  if (abs >= 1e6) return `${sign}${formatNumber(abs / 1e6, 1)} tr ₫`;
  return `${sign}${formatNumber(abs)} ₫`;
}

/** Số triệu → "2,84 tỷ" / "420 tr" */
export const millions = (m: number) => (m >= 1000 ? `${formatNumber(m / 1000, 2)} tỷ` : `${formatNumber(m, 1)} tr`);
