import { useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { JobLifecycle } from './components/JobLifecycle';
import { ApprovalList, NoticeList } from './components/SidePanels';
import { TaskTable } from './components/TaskTable';
import { JobTypeBars, OnTimeChart, WeeklyJobsChart } from './components/charts';
import { homeStats, roles } from './data';
import type { Role } from './types';
import './home.css';

export default function HomePage() {
  const [role, setRole] = useState<Role>('CS / Ops');

  return (
    <>
      <section className="hero">
        <div className="hero__top">
          <div>
            <div className="hero__date mono">THỨ HAI · 19/10/2026 · 08:15</div>
            <h1 className="hero__title">Chào buổi sáng, Lan Anh</h1>
            <p className="hero__sub">Bạn có 12 việc hôm nay, 3 việc quá hạn và 4 mục chờ duyệt.</p>
          </div>
          <div className="hero__roles" role="tablist">
            {roles.map((r) => (
              <button key={r} className={r === role ? 'active' : undefined} onClick={() => setRole(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="stats" style={{ marginBottom: 0 }}>
          {homeStats.map((s) => (
            <StatCard key={s.label} item={s} />
          ))}
        </div>
      </section>

      <div className="home-charts">
        <WeeklyJobsChart />
        <OnTimeChart />
        <JobTypeBars />
      </div>

      <div className="home-grid">
        <div className="home-grid__main">
          <TaskTable />
          <JobLifecycle />
        </div>
        <div className="home-grid__side">
          <ApprovalList />
          <NoticeList />
        </div>
      </div>

      <footer className="page-footer">
        <span>Dữ liệu cập nhật lúc 08:14 · Hiển thị theo vai trò {role}</span>
        <span className="mono">Logi Platform · Workspace</span>
      </footer>
    </>
  );
}
