import { Navigate, useRoutes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { appModules } from './pages';

export default function App() {
  return useRoutes([
    {
      element: <AppLayout />,
      children: [...appModules.flatMap((m) => m.routes), { path: '*', element: <Navigate to="/" replace /> }],
    },
  ]);
}
