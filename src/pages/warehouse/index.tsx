import { ChartColumn, ClipboardCheck, LayoutGrid, Package, PackageMinus, PackagePlus } from 'lucide-react';
import type { AppModule } from '../../types';
import CountsPage from './counts/CountsPage';
import InboundPage from './inbound/InboundPage';
import WarehouseMapPage from './map/WarehouseMapPage';
import OutboundPage from './outbound/OutboundPage';
import WarehouseReportPage from './reports/WarehouseReportPage';
import StockPage from './stock/StockPage';

/** Kho (Logi.WMS) — mục 8.1 tài liệu kiến trúc. */
export const warehouseModule: AppModule = {
  title: 'Kho',
  menu: [
    { path: '/ton-kho', label: 'Tồn kho', icon: Package },
    { path: '/nhap-kho', label: 'Nhập kho (GRN)', icon: PackagePlus },
    { path: '/xuat-kho', label: 'Xuất kho', icon: PackageMinus },
    { path: '/kiem-ke', label: 'Kiểm kê và điều chỉnh', icon: ClipboardCheck },
    { path: '/so-do-kho', label: 'Sơ đồ vị trí kho', icon: LayoutGrid },
    { path: '/bao-cao-kho', label: 'Báo cáo kho', icon: ChartColumn },
  ],
  routes: [
    { path: 'ton-kho', element: <StockPage /> },
    { path: 'nhap-kho', element: <InboundPage /> },
    { path: 'xuat-kho', element: <OutboundPage /> },
    { path: 'kiem-ke', element: <CountsPage /> },
    { path: 'so-do-kho', element: <WarehouseMapPage /> },
    { path: 'bao-cao-kho', element: <WarehouseReportPage /> },
  ],
};
