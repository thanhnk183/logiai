import { Home } from 'lucide-react';
import type { AppModule } from '../../types';
import HomePage from './HomePage';

export const homeModule: AppModule = {
  menu: [{ path: '/', label: 'Trang chủ', icon: Home }],
  routes: [{ index: true, element: <HomePage /> }],
};
