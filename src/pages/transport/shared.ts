import type { Tone } from '../../types';
import { formatNumber } from '../../utils/format';
import type { ContractorStatus, OrderStatus, PodStatus, TripStatus } from './types';

export const orderStatuses: OrderStatus[] = ['Chờ điều xe', 'Đã điều xe', 'Đang chạy', 'Chờ POD', 'Hoàn tất'];

export const orderStatusTone: Record<OrderStatus, Tone> = {
  'Chờ điều xe': 'amber',
  'Đã điều xe': 'blue',
  'Đang chạy': 'blue',
  'Chờ POD': 'red',
  'Hoàn tất': 'green',
};

export const tripStatusTone: Record<TripStatus, Tone> = {
  'Chưa bắt đầu': 'gray',
  'Đang chạy': 'blue',
  'Hoàn tất': 'green',
  'Có sự cố': 'red',
};

export const podStatusTone: Record<PodStatus, Tone> = {
  'Chờ duyệt': 'amber',
  'Đã duyệt': 'green',
  'Yêu cầu chụp lại': 'blue',
  'Thiếu POD': 'red',
};

export const contractorStatusTone: Record<ContractorStatus, Tone> = {
  'Đang hợp tác': 'green',
  'Đang thẩm định': 'amber',
  'Tạm dừng': 'gray',
};

/** 13.5 → "13:30" */
export function fmtHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export const fmtVnd = (n: number) => `${formatNumber(n)} ₫`;
