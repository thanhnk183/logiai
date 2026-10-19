import type { AppModule } from '../types';
import { customersModule } from './customers';
import { homeModule } from './home';
import { jobsModule } from './jobs';
import { quotationBookingModule } from './quotation-booking';
import { transportModule } from './transport';
import { warehouseModule } from './warehouse';
import { customsModule } from './customs';
import { financeModule } from './finance';
import { documentsModule } from './documents';
import { reportsModule } from './reports';
import { masterDataModule } from './master-data';
import { adminModule } from './admin';

/** Thứ tự ở đây = thứ tự hiển thị trên sidebar. Thêm module mới thì đăng ký vào đây. */
export const appModules: AppModule[] = [
  homeModule,
  customersModule,
  quotationBookingModule,
  jobsModule,
  transportModule,
  warehouseModule,
  customsModule,
  financeModule,
  documentsModule,
  reportsModule,
  masterDataModule,
  adminModule,
];
