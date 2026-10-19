import { Boxes, ListChecks, MapPin } from 'lucide-react';
import type { AppModule } from '../../types';
import JobDetailPage from './detail/JobDetailPage';
import JobListPage from './list/JobListPage';
import TodayPage from './today/TodayPage';
import TrackingPage from './tracking/TrackingPage';

/**
 * Job / Lô hàng — màn hình trung tâm (mục 8.1 tài liệu kiến trúc).
 * "Chi tiết job" không nằm trên menu: mở từ danh sách hoặc từ bất kỳ mã job nào (JobLink).
 */
export const jobsModule: AppModule = {
  title: 'Job / Lô hàng',
  menu: [
    { path: '/job', label: 'Danh sách job', icon: Boxes },
    { path: '/tracking', label: 'Tracking lô hàng', icon: MapPin },
    { path: '/job-hom-nay', label: 'Job cần xử lý hôm nay', icon: ListChecks },
  ],
  routes: [
    { path: 'job', element: <JobListPage /> },
    { path: 'job/:code', element: <JobDetailPage /> },
    { path: 'tracking', element: <TrackingPage /> },
    { path: 'job-hom-nay', element: <TodayPage /> },
  ],
};
