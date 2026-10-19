import type { Tone } from '../../types';
import { roles } from './data';
import type { IntegrationState, UserStatus } from './types';

export const userStatusTone: Record<UserStatus, Tone> = { 'Hoạt động': 'green', 'Đã mời': 'blue', 'Bị khóa': 'gray' };
export const integrationTone: Record<IntegrationState, Tone> = { 'Đang chạy': 'green', 'Cảnh báo': 'amber', 'Lỗi': 'red', 'Tắt': 'gray' };

export const roleName = (key: string) => roles.find((r) => r.key === key)?.name ?? key;

/** "Phạm Đức Anh" → "PA"; "Lan Anh" → "LA" */
export function initials(name: string) {
  const parts = name.split(' ');
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
