import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import type { Tone } from '../../types';
import { formatNumber } from '../../utils/format';
import type { Channel, Declaration, DeclarationStatus, DocState, PayStatus, PermitStatus } from './types';

export const declarationStatuses: DeclarationStatus[] = ['Đang soạn', 'Chờ truyền', 'Chờ phân luồng', 'Chờ kiểm hóa', 'Đã thông quan'];

export const declarationTone: Record<DeclarationStatus, Tone> = {
  'Đang soạn': 'gray',
  'Chờ truyền': 'amber',
  'Chờ phân luồng': 'blue',
  'Chờ kiểm hóa': 'red',
  'Đã thông quan': 'green',
};

export const channelTone: Record<Channel, Tone> = { 'Xanh': 'green', 'Vàng': 'amber', 'Đỏ': 'red' };

export const payTone: Record<PayStatus, Tone> = {
  'Không phát sinh': 'gray',
  'Chưa nộp': 'amber',
  'Đã nộp': 'green',
  'Đã chuyển Kế toán': 'blue',
};

export const permitTone: Record<PermitStatus, Tone> = {
  'Còn hiệu lực': 'green',
  'Sắp hết hạn': 'amber',
  'Hết hạn': 'red',
  'Đang xin': 'blue',
  'Đã sử dụng': 'gray',
};

/** Phân luồng luôn đi kèm chữ, không chỉ dựa vào màu */
export function ChannelBadge({ channel }: { channel?: Channel }) {
  if (!channel) return <span className="subtle" style={{ fontSize: 12 }}>Chưa phân luồng</span>;
  return <Badge tone={channelTone[channel]}>Luồng {channel.toLowerCase()}</Badge>;
}

export function DocStateIcon({ state }: { state: DocState }) {
  if (state === 'ok') return <CheckCircle2 size={15} color="var(--green)" aria-label="Đủ" />;
  if (state === 'mismatch') return <XCircle size={15} color="var(--red)" aria-label="Lệch" />;
  return <CircleDashed size={15} color="var(--amber)" aria-label="Thiếu" />;
}

export const fmtVnd = (n: number) => (n === 0 ? '0 ₫' : `${formatNumber(n)} ₫`);
export const totalValue = (d: Declaration) => d.lines.reduce((s, l) => s + l.value, 0);
export const totalTax = (d: Declaration) => d.duty + d.vat + d.fees;
export const docProgress = (d: Declaration) => ({
  ok: d.docs.filter((x) => x.state === 'ok').length,
  total: d.docs.length,
  issues: d.docs.filter((x) => x.state !== 'ok').length + d.crossChecks.filter((x) => x.state !== 'ok').length,
});
