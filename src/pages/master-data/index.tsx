import { Hash, MapPin, ReceiptText, Ship, Users } from 'lucide-react';
import type { AppModule } from '../../types';
import CarriersPage from './carriers/CarriersPage';
import HsUomPage from './hs-uom/HsUomPage';
import LocationsPage from './locations/LocationsPage';
import PartnersPage from './partners/PartnersPage';
import TariffPage from './tariff/TariffPage';

/** Danh mục (Master Data) — mục 8.1 tài liệu kiến trúc. */
export const masterDataModule: AppModule = {
  title: 'Danh mục',
  menu: [
    { path: '/doi-tac', label: 'Khách hàng, nhà cung cấp', icon: Users },
    { path: '/hang-tau-hang-bay', label: 'Hãng tàu, hãng bay', icon: Ship },
    { path: '/dia-diem', label: 'Cảng, kho, địa điểm', icon: MapPin },
    { path: '/ma-hs-don-vi', label: 'Mã HS, đơn vị tính', icon: Hash },
    { path: '/bieu-phi-chuan', label: 'Biểu phí chuẩn', icon: ReceiptText },
  ],
  routes: [
    { path: 'doi-tac', element: <PartnersPage /> },
    { path: 'hang-tau-hang-bay', element: <CarriersPage /> },
    { path: 'dia-diem', element: <LocationsPage /> },
    { path: 'ma-hs-don-vi', element: <HsUomPage /> },
    { path: 'bieu-phi-chuan', element: <TariffPage /> },
  ],
};
