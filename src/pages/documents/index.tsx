import { FileWarning, FolderOpen, ScanText, SearchCheck, Upload } from 'lucide-react';
import type { AppModule } from '../../types';
import DocAlertsPage from './alerts/DocAlertsPage';
import AllDocumentsPage from './all/AllDocumentsPage';
import OcrQueuePage from './ocr/OcrQueuePage';
import AdvancedSearchPage from './search/AdvancedSearchPage';
import UploadPage from './upload/UploadPage';

/** Chứng từ (Logi.DMS) — mục 8.1 tài liệu kiến trúc. */
export const documentsModule: AppModule = {
  title: 'Chứng từ',
  menu: [
    { path: '/chung-tu', label: 'Tất cả chứng từ', icon: FolderOpen },
    { path: '/tai-len', label: 'Tải lên', icon: Upload },
    { path: '/duyet-ocr', label: 'Hàng chờ duyệt OCR', icon: ScanText },
    { path: '/canh-bao-chung-tu', label: 'Cảnh báo thiếu hoặc lệch', icon: FileWarning },
    { path: '/tim-kiem-chung-tu', label: 'Tìm kiếm nâng cao', icon: SearchCheck },
  ],
  routes: [
    { path: 'chung-tu', element: <AllDocumentsPage /> },
    { path: 'tai-len', element: <UploadPage /> },
    { path: 'duyet-ocr', element: <OcrQueuePage /> },
    { path: 'canh-bao-chung-tu', element: <DocAlertsPage /> },
    { path: 'tim-kiem-chung-tu', element: <AdvancedSearchPage /> },
  ],
};
