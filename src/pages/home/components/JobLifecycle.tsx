import { OutlineBadge, toneColor } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { LIFECYCLE_STEPS, LifecycleStepper } from '../../../components/ui/LifecycleStepper';
import { watchedJobs } from '../data';

export function JobLifecycle() {
  return (
    <Card
      title="Job cần chú ý hôm nay"
      subtitle={`Theo vòng đời lô hàng: ${LIFECYCLE_STEPS.join(' → ')}`}
      bodyClassName=""
    >
      <div className="legend">
        <span><i className="legend__dot is-done" /> Xong</span>
        <span><i className="legend__dot is-doing" /> Đang làm</span>
        <span><i className="legend__dot is-late" /> Trễ</span>
      </div>
      {watchedJobs.map((j) => (
        <div key={j.job} className="watch-row">
          <div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <JobLink code={j.job} />
              <OutlineBadge>{j.mode}</OutlineBadge>
            </div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{j.route}</div>
            <div className="subtle" style={{ fontSize: 11.5 }}>{j.detail}</div>
          </div>
          <LifecycleStepper steps={j.steps} />
          <div className="watch-row__alert">
            <div style={{ color: toneColor[j.alertTone], fontWeight: 600 }}>{j.alert}</div>
            <div className="subtle" style={{ fontSize: 11.5 }}>{j.note}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}
