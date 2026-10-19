import type { ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageSquareText } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { LifecycleStepper } from '../../../components/ui/LifecycleStepper';
import { findJob } from '../data';
import { docIssues, jobStatusTone, modeLabel } from '../shared';
import type { Job } from '../types';
import { CustomsTab, DocumentsTab, FinanceTab, HistoryTab, OverviewTab, TransportTab, WarehouseTab } from './JobTabs';
import '../jobs.css';

type TabKey = 'tong-quan' | 'van-tai' | 'kho' | 'hai-quan' | 'tai-chinh' | 'chung-tu' | 'lich-su';

const tabs: { key: TabKey; label: string; count?: (j: Job) => number | undefined; render: (j: Job) => ReactNode }[] = [
  { key: 'tong-quan', label: 'Tổng quan', render: (j) => <OverviewTab job={j} /> },
  { key: 'van-tai', label: 'Vận tải', count: (j) => j.transport.length || undefined, render: (j) => <TransportTab job={j} /> },
  { key: 'kho', label: 'Kho', count: (j) => j.warehouse?.items.length, render: (j) => <WarehouseTab job={j} /> },
  { key: 'hai-quan', label: 'Hải quan', render: (j) => <CustomsTab job={j} /> },
  { key: 'tai-chinh', label: 'Tài chính', render: (j) => <FinanceTab job={j} /> },
  { key: 'chung-tu', label: 'Chứng từ', count: (j) => docIssues(j) || undefined, render: (j) => <DocumentsTab job={j} /> },
  { key: 'lich-su', label: 'Lịch sử', render: (j) => <HistoryTab job={j} /> },
];

export default function JobDetailPage() {
  const { code } = useParams();
  const [params, setParams] = useSearchParams();
  const job = findJob(code);

  if (!job) {
    return (
      <div className="card job-empty">
        Không tìm thấy job <span className="mono">{code}</span>. <Link to="/job">Quay lại danh sách job</Link>
      </div>
    );
  }

  const active = (tabs.find((t) => t.key === params.get('tab')) ?? tabs[0]).key;
  const tab = tabs.find((t) => t.key === active)!;

  return (
    <>
      <Link to="/job" className="job-back"><ArrowLeft size={14} /> Danh sách job</Link>

      <section className="card job-head">
        <div className="job-head__top">
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="mono job-head__code">{job.code}</span>
              <OutlineBadge>{job.mode}</OutlineBadge>
              <Badge tone={jobStatusTone[job.status]}>{job.status}</Badge>
            </div>
            <h1 className="job-head__title">{job.customer}</h1>
            <div className="muted">
              {modeLabel[job.mode]} · {job.pol} → {job.pod} · {job.equipment}
              {job.vessel && <> · {job.vessel}</>}
            </div>
          </div>
          <div className="job-head__actions">
            <button className="btn btn--sm">Cập nhật mốc</button>
            <button className="btn btn--sm">Gửi cập nhật cho khách</button>
            <button className="btn btn--primary btn--sm"><MessageSquareText size={14} /> Hỏi trợ lý AI về job</button>
          </div>
        </div>
        <div className="job-head__progress">
          <LifecycleStepper steps={job.steps} size="wide" />
          {job.alert && (
            <div style={{ minWidth: 240 }}>
              <Alert tone={job.alert.tone}>{job.alert.text}</Alert>
            </div>
          )}
        </div>
        <div className="underline-tabs job-tabs" role="tablist">
          {tabs.map((t) => {
            const n = t.count?.(job);
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={t.key === active}
                className={t.key === active ? 'active' : undefined}
                onClick={() => setParams(t.key === 'tong-quan' ? {} : { tab: t.key }, { replace: true })}
              >
                {t.label}
                {n !== undefined && <Badge tone={t.key === 'chung-tu' ? 'red' : 'gray'}>{n}</Badge>}
              </button>
            );
          })}
        </div>
      </section>

      {/* key theo job để state trong tab (việc đã tick...) không lẫn giữa các job */}
      <div key={job.code + active}>{tab.render(job)}</div>
    </>
  );
}
