import { FileText, Filter, LayoutList, MessageSquare } from 'lucide-react';
import type { AppModule } from '../../types';
import ActivitiesPage from './activities/ActivitiesPage';
import ContractsPage from './contracts/ContractsPage';
import CustomerListPage from './list/CustomerListPage';
import RfqPage from './opportunities/RfqPage';

export const customersModule: AppModule = {
  title: 'Khách hàng',
  menu: [
    { path: '/khach-hang', label: 'Danh sách khách hàng', icon: LayoutList },
    { path: '/co-hoi-rfq', label: 'Cơ hội và RFQ', icon: Filter },
    { path: '/hop-dong-sla', label: 'Hợp đồng và SLA', icon: FileText },
    { path: '/hoat-dong', label: 'Hoạt động chăm sóc', icon: MessageSquare },
  ],
  routes: [
    { path: 'khach-hang', element: <CustomerListPage /> },
    { path: 'co-hoi-rfq', element: <RfqPage /> },
    { path: 'hop-dong-sla', element: <ContractsPage /> },
    { path: 'hoat-dong', element: <ActivitiesPage /> },
  ],
};
