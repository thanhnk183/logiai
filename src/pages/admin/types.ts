import type { Module, Tone } from '../../types';

export type UserStatus = 'Hoạt động' | 'Đã mời' | 'Bị khóa';

export interface Role {
  key: string;
  name: string;
  desc: string;
  /** Phạm vi dữ liệu mặc định */
  scope: DataScope;
  system?: boolean;
}

export type DataScope = 'Của mình' | 'Chi nhánh' | 'Toàn công ty';

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  branch: 'TP.HCM' | 'Hải Phòng' | 'Kho Tân Uyên' | 'Toàn công ty';
  roles: string[];
  status: UserStatus;
  lastLogin: string;
  mfa: boolean;
}

export type PermAction = 'view' | 'edit' | 'approve' | 'export';

export interface PermArea {
  key: string;
  label: string;
  module?: Module;
}

export interface WorkflowStep {
  approver: string;
  /** Điều kiện để bước này được kích hoạt, trống = luôn có */
  when?: string;
  slaHours: number;
}

export interface Workflow {
  id: string;
  name: string;
  area: string;
  module?: Module;
  trigger: string;
  steps: WorkflowStep[];
  escalation: string;
  enabled: boolean;
  /** Số yêu cầu đang chờ, đếm từ dữ liệu các phân hệ */
  pending: number;
  pendingLink?: string;
  avgHours: number;
}

export type IntegrationState = 'Đang chạy' | 'Cảnh báo' | 'Lỗi' | 'Tắt';

export interface Integration {
  id: string;
  name: string;
  group: string;
  method: 'API' | 'EDI' | 'Email' | 'SDK' | 'Webhook';
  state: IntegrationState;
  lastSync: string;
  callsToday: number;
  errorRate: number;
  purpose: string;
  config: { label: string; value: string; secret?: boolean }[];
  log: { time: string; text: string; tone: Tone }[];
  issue?: string;
}

export type AuditKind = 'Đăng nhập' | 'Sửa dữ liệu' | 'Duyệt' | 'Tích hợp' | 'Bảo mật' | 'Phân quyền';

export interface AuditEvent {
  id: string;
  time: string;
  user: string;
  kind: AuditKind;
  module?: Module | 'ADM';
  action: string;
  target: string;
  ip: string;
  changes?: { field: string; before: string; after: string }[];
  tone?: Tone;
}
