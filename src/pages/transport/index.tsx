import { BarChart3, Container, Files, Handshake, PenLine, Route, Truck } from 'lucide-react';
import type { AppModule } from '../../types';
import ContainersPage from './containers/ContainersPage';
import ContractorsPage from './contractors/ContractorsPage';
import DispatchPage from './dispatch/DispatchPage';
import TransportOrdersPage from './orders/TransportOrdersPage';
import PodApprovalPage from './pod/PodApprovalPage';
import TransportReportPage from './reports/TransportReportPage';
import TripsPage from './trips/TripsPage';

/** Vận tải (Logi.TMS) — mục 8.1 tài liệu kiến trúc. */
export const transportModule: AppModule = {
  title: 'Vận tải',
  menu: [
    { path: '/lenh-van-chuyen', label: 'Lệnh vận chuyển', icon: Files },
    { path: '/dieu-phoi-xe', label: 'Điều phối xe', icon: Truck },
    { path: '/container-eir', label: 'Container và EIR', icon: Container },
    { path: '/chuyen', label: 'Chuyến (Trip)', icon: Route },
    { path: '/duyet-pod', label: 'Duyệt POD', icon: PenLine },
    { path: '/nha-thau-van-tai', label: 'Nhà thầu vận tải', icon: Handshake },
    { path: '/bao-cao-van-tai', label: 'Báo cáo vận tải', icon: BarChart3 },
  ],
  routes: [
    { path: 'lenh-van-chuyen', element: <TransportOrdersPage /> },
    { path: 'dieu-phoi-xe', element: <DispatchPage /> },
    { path: 'container-eir', element: <ContainersPage /> },
    { path: 'chuyen', element: <TripsPage /> },
    { path: 'duyet-pod', element: <PodApprovalPage /> },
    { path: 'nha-thau-van-tai', element: <ContractorsPage /> },
    { path: 'bao-cao-van-tai', element: <TransportReportPage /> },
  ],
};
