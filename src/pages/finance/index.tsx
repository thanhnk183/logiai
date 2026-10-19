import { ArrowDownToLine, ArrowUpFromLine, Landmark, Percent, Scale, TrendingUp } from 'lucide-react';
import type { AppModule } from '../../types';
import BankPage from './bank/BankPage';
import JobPnlPage from './job-pnl/JobPnlPage';
import PayablesPage from './payables/PayablesPage';
import ReceivablesPage from './receivables/ReceivablesPage';
import ReconciliationPage from './reconciliation/ReconciliationPage';
import VatPage from './vat/VatPage';

/** Tài chính (Logi.Finance) — mục 8.1 tài liệu kiến trúc. */
export const financeModule: AppModule = {
  title: 'Tài chính',
  menu: [
    { path: '/cong-no-phai-thu', label: 'Công nợ phải thu', icon: ArrowDownToLine },
    { path: '/cong-no-phai-tra', label: 'Công nợ phải trả', icon: ArrowUpFromLine },
    { path: '/thu-chi-ngan-hang', label: 'Thu chi và ngân hàng', icon: Landmark },
    { path: '/thue-vat', label: 'Thuế VAT', icon: Percent },
    { path: '/doi-soat-cong-no', label: 'Đối soát công nợ', icon: Scale },
    { path: '/lai-lo-theo-job', label: 'Lãi lỗ theo job', icon: TrendingUp },
  ],
  routes: [
    { path: 'cong-no-phai-thu', element: <ReceivablesPage /> },
    { path: 'cong-no-phai-tra', element: <PayablesPage /> },
    { path: 'thu-chi-ngan-hang', element: <BankPage /> },
    { path: 'thue-vat', element: <VatPage /> },
    { path: 'doi-soat-cong-no', element: <ReconciliationPage /> },
    { path: 'lai-lo-theo-job', element: <JobPnlPage /> },
  ],
};
