export type Module = 'FMS' | 'DMS' | 'CUS' | 'TMS' | 'WMS' | 'FIN';
export type Tone = 'green' | 'red' | 'amber' | 'blue' | 'gray';

/** Trạng thái một bước trong vòng đời lô hàng */
export type StepState = 'done' | 'doing' | 'late' | 'todo';

export interface StatItem {
  label: string;
  value: string;
  note: string;
  noteTone?: Tone;
  valueTone?: Tone;
  module?: Module;
}

// ---------- Khai báo module (route + menu) ----------
export interface MenuItem {
  path: string;
  label: string;
  icon: import('lucide-react').LucideIcon;
}

export interface AppModule {
  /** Tên nhóm trên sidebar. Bỏ trống = mục đứng riêng, không có tiêu đề nhóm. */
  title?: string;
  menu: MenuItem[];
  routes: import('react-router-dom').RouteObject[];
}
