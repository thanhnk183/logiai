import type { Tone } from '../../types';
import type { CountLine, CountStatus, InboundStatus, OutboundStatus, StockStatus, TempZone } from './types';

export const stockStatusTone: Record<StockStatus, Tone> = {
  'Sẵn sàng': 'green',
  'Giữ hàng': 'blue',
  'Cận hạn': 'red',
  'Đang kiểm kê': 'amber',
};

export const inboundStatuses: InboundStatus[] = ['Chờ lịch hẹn', 'Đã hẹn', 'Đang nhận hàng', 'Chờ cất hàng', 'Hoàn tất'];
export const inboundStatusTone: Record<InboundStatus, Tone> = {
  'Chờ lịch hẹn': 'red',
  'Đã hẹn': 'blue',
  'Đang nhận hàng': 'amber',
  'Chờ cất hàng': 'amber',
  'Hoàn tất': 'green',
};

export const outboundStatuses: OutboundStatus[] = ['Mới', 'Đang soạn hàng', 'Đã đóng gói', 'Đã xuất'];
export const outboundStatusTone: Record<OutboundStatus, Tone> = {
  'Mới': 'gray',
  'Đang soạn hàng': 'amber',
  'Đã đóng gói': 'blue',
  'Đã xuất': 'green',
};

export const countStatusTone: Record<CountStatus, Tone> = {
  'Đang đếm': 'blue',
  'Chờ duyệt điều chỉnh': 'amber',
  'Đã điều chỉnh': 'green',
};

export const tempTone: Record<TempZone, Tone> = {
  'Thường': 'gray',
  'Mát 2–8°C': 'blue',
  'Đông −18°C': 'blue',
};

/** Chênh lệch kiểm kê của một dòng (chưa đếm thì undefined) */
export const countDiff = (l: CountLine) => (l.counted === undefined ? undefined : l.counted - l.system);

export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
