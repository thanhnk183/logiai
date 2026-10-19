import { Calculator, CalendarCheck, ClipboardList, ScrollText, Tags } from 'lucide-react';
import type { AppModule } from '../../types';
import BillsPage from './bills/BillsPage';
import BookingsPage from './bookings/BookingsPage';
import QuotationsPage from './quotations/QuotationsPage';
import RateTablePage from './rates/RateTablePage';
import ShippingInstructionsPage from './shipping-instructions/ShippingInstructionsPage';

/** Báo giá và Booking (Logi.FMS) — mục 8.1 tài liệu kiến trúc. */
export const quotationBookingModule: AppModule = {
  title: 'Báo giá và Booking',
  menu: [
    { path: '/bang-gia-cuoc', label: 'Bảng giá cước', icon: Tags },
    { path: '/bao-gia', label: 'Báo giá', icon: Calculator },
    { path: '/booking', label: 'Booking', icon: CalendarCheck },
    { path: '/shipping-instruction', label: 'Shipping Instruction', icon: ClipboardList },
    { path: '/van-don', label: 'Vận đơn (B/L, AWB)', icon: ScrollText },
  ],
  routes: [
    { path: 'bang-gia-cuoc', element: <RateTablePage /> },
    { path: 'bao-gia', element: <QuotationsPage /> },
    { path: 'booking', element: <BookingsPage /> },
    { path: 'shipping-instruction', element: <ShippingInstructionsPage /> },
    { path: 'van-don', element: <BillsPage /> },
  ],
};
