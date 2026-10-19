import { BadgeCheck, FileCheck2, FolderCheck, Receipt, ShieldCheck } from 'lucide-react';
import type { AppModule } from '../../types';
import DeclarationsPage from './declarations/DeclarationsPage';
import DossiersPage from './dossiers/DossiersPage';
import PermitsPage from './permits/PermitsPage';
import ResultsPage from './results/ResultsPage';
import TaxesPage from './taxes/TaxesPage';

/** Hải quan (Logi.Customs) — mục 8.1 tài liệu kiến trúc. */
export const customsModule: AppModule = {
  title: 'Hải quan',
  menu: [
    { path: '/to-khai', label: 'Tờ khai', icon: FileCheck2 },
    { path: '/ho-so-khai', label: 'Hồ sơ khai', icon: FolderCheck },
    { path: '/giay-phep-co', label: 'Giấy phép và C/O', icon: BadgeCheck },
    { path: '/ket-qua-thong-quan', label: 'Kết quả thông quan', icon: ShieldCheck },
    { path: '/thue-phi', label: 'Thuế và phí', icon: Receipt },
  ],
  routes: [
    { path: 'to-khai', element: <DeclarationsPage /> },
    { path: 'ho-so-khai', element: <DossiersPage /> },
    { path: 'giay-phep-co', element: <PermitsPage /> },
    { path: 'ket-qua-thong-quan', element: <ResultsPage /> },
    { path: 'thue-phi', element: <TaxesPage /> },
  ],
};
