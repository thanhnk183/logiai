import { GitBranch, History, Plug, ShieldCheck, Users } from 'lucide-react';
import type { AppModule } from '../../types';
import AuditLogPage from './audit/AuditLogPage';
import IntegrationsPage from './integrations/IntegrationsPage';
import PermissionsPage from './permissions/PermissionsPage';
import UsersPage from './users/UsersPage';
import WorkflowsPage from './workflows/WorkflowsPage';

/** Quản trị — mục 8.1 tài liệu kiến trúc. */
export const adminModule: AppModule = {
  title: 'Quản trị',
  menu: [
    { path: '/nguoi-dung', label: 'Người dùng và vai trò', icon: Users },
    { path: '/phan-quyen', label: 'Phân quyền', icon: ShieldCheck },
    { path: '/quy-trinh-duyet', label: 'Quy trình duyệt (Workflow)', icon: GitBranch },
    { path: '/tich-hop', label: 'Cấu hình tích hợp', icon: Plug },
    { path: '/nhat-ky', label: 'Nhật ký hệ thống', icon: History },
  ],
  routes: [
    { path: 'nguoi-dung', element: <UsersPage /> },
    { path: 'phan-quyen', element: <PermissionsPage /> },
    { path: 'quy-trinh-duyet', element: <WorkflowsPage /> },
    { path: 'tich-hop', element: <IntegrationsPage /> },
    { path: 'nhat-ky', element: <AuditLogPage /> },
  ],
};
