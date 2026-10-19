import { Activity, Briefcase, SlidersHorizontal, TrendingUp, Wallet } from 'lucide-react';
import type { AppModule } from '../../types';
import ReportBuilderPage from './builder/ReportBuilderPage';
import FinanceDashboardPage from './finance/FinanceDashboardPage';
import ForecastPage from './forecast/ForecastPage';
import OperationsDashboardPage from './operations/OperationsDashboardPage';
import SalesDashboardPage from './sales/SalesDashboardPage';

/** Báo cáo (Logi.Data) — mục 8.1 tài liệu kiến trúc. */
export const reportsModule: AppModule = {
  title: 'Báo cáo',
  menu: [
    { path: '/dashboard-van-hanh', label: 'Dashboard vận hành', icon: Activity },
    { path: '/dashboard-tai-chinh', label: 'Dashboard tài chính', icon: Wallet },
    { path: '/dashboard-kinh-doanh', label: 'Dashboard kinh doanh', icon: Briefcase },
    { path: '/bao-cao-tu-tao', label: 'Báo cáo tự tạo', icon: SlidersHorizontal },
    { path: '/du-bao', label: 'Dự báo', icon: TrendingUp },
  ],
  routes: [
    { path: 'dashboard-van-hanh', element: <OperationsDashboardPage /> },
    { path: 'dashboard-tai-chinh', element: <FinanceDashboardPage /> },
    { path: 'dashboard-kinh-doanh', element: <SalesDashboardPage /> },
    { path: 'bao-cao-tu-tao', element: <ReportBuilderPage /> },
    { path: 'du-bao', element: <ForecastPage /> },
  ],
};
