import { useMemo, useState } from 'react';
import { Scale, Send } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { reconciliations } from '../data';
import { millions, reconTone } from '../shared';
import type { Reconciliation } from '../types';
import '../finance.css';

type Side = 'Khách hàng' | 'Nhà cung cấp';

const diffOf = (r: Reconciliation) => (r.theirs === undefined ? undefined : r.ours - r.theirs);

function ReconDetail({ r, onUpdate }: { r: Reconciliation; onUpdate: (next: Reconciliation) => void }) {
  const diff = diffOf(r);
  return (
    <section className="card">
      <DetailHeader
        code={`${r.side} · ${r.period}`}
        badge={<Badge tone={reconTone[r.status]}>{r.status}</Badge>}
        title={r.party}
        subtitle={r.sentAt ? `Gửi biên bản ngày ${r.sentAt}` : 'Chưa gửi biên bản'}
        actions={
          r.status === 'Chưa gửi' ? (
            <button className="btn btn--primary btn--sm" onClick={() => onUpdate({ ...r, status: 'Đã gửi', sentAt: '19/10' })}><Send size={14} /> Gửi biên bản đối soát</button>
          ) : r.status === 'Có chênh lệch' ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => onUpdate({ ...r, status: 'Đã xác nhận', theirs: r.ours, items: [] })}>Đã xử lý chênh lệch · chốt số</button>
              <button className="btn btn--sm">Gửi giải trình</button>
            </>
          ) : r.status === 'Đã gửi' ? (
            <button className="btn btn--sm">Nhắc xác nhận</button>
          ) : (
            <button className="btn btn--sm">Tải biên bản đã ký</button>
          )
        }
      />
      <div className="detail__section">
        <div className="recon-compare">
          <div><span>Theo sổ LogiAI</span><b>{millions(r.ours)}</b></div>
          <div><span>Theo {r.side === 'Khách hàng' ? 'khách hàng' : 'nhà cung cấp'}</span><b>{r.theirs === undefined ? 'Chưa phản hồi' : millions(r.theirs)}</b></div>
          <div className={diff ? 'is-diff' : undefined}>
            <span>Chênh lệch</span>
            <b>{diff === undefined ? '—' : diff === 0 ? 'Khớp' : `${diff > 0 ? '+' : '−'}${formatNumber(Math.abs(diff), 1)} tr`}</b>
          </div>
        </div>
      </div>
      {r.items.length > 0 && (
        <div className="detail__section">
          <div className="section-title">Khoản chênh lệch</div>
          {r.items.map((it) => (
            <div key={it.text} className="fin-line md-item__row">
              <span>{it.text}</span>
              <b className="text-red" style={{ whiteSpace: 'nowrap' }}>{formatNumber(it.amount, 1)} tr</b>
            </div>
          ))}
        </div>
      )}
      {r.status === 'Đã xác nhận' && <div className="detail__section"><Alert tone="green">Hai bên đã khớp số dư kỳ {r.period.toLowerCase()}.</Alert></div>}
    </section>
  );
}

export default function ReconciliationPage() {
  const [items, setItems] = useState(reconciliations);
  const [side, setSide] = useState<Side>('Khách hàng');
  const rows = useMemo(() => items.filter((r) => r.side === side), [items, side]);
  const [selected, setSelected] = useState(reconciliations[0].id);
  const current = rows.find((r) => r.id === selected) ?? rows[0];
  const update = (next: Reconciliation) => setItems((l) => l.map((r) => (r.id === next.id ? next : r)));

  return (
    <>
      <PageHeader
        icon={<Scale size={18} />}
        section="Tài chính"
        title="Đối soát công nợ"
        description="Biên bản đối chiếu số dư với khách hàng và nhà cung cấp theo kỳ. Chênh lệch được liệt kê từng khoản để xử lý trước khi chốt."
      />
      <StatGrid
        items={[
          { label: 'Biên bản kỳ này', value: String(items.length), note: `${items.filter((r) => r.side === 'Khách hàng').length} khách hàng, ${items.filter((r) => r.side === 'Nhà cung cấp').length} nhà cung cấp`, module: 'FIN' },
          { label: 'Có chênh lệch', value: String(items.filter((r) => r.status === 'Có chênh lệch').length), note: 'Cần xử lý trước khi chốt', valueTone: 'red', noteTone: 'red' },
          { label: 'Đã xác nhận', value: String(items.filter((r) => r.status === 'Đã xác nhận').length), note: 'Có biên bản ký' , noteTone: 'green' },
          { label: 'Chưa gửi', value: String(items.filter((r) => r.status === 'Chưa gửi').length), note: 'Hạn gửi 20/10' },
        ]}
      />
      <div className="toolbar">
        <Segmented<Side>
          value={side}
          onChange={setSide}
          options={(['Khách hàng', 'Nhà cung cấp'] as Side[]).map((s) => ({ value: s, label: s, count: items.filter((r) => r.side === s).length }))}
        />
      </div>
      <div className="master-detail">
        <div className="card md-list">
          {rows.map((r) => {
            const d = diffOf(r);
            return (
              <button key={r.id} className={`md-item ${r.id === current?.id ? 'is-active' : ''}`} onClick={() => setSelected(r.id)}>
                <div className="md-item__row">
                  <b>{r.party}</b>
                  <Badge tone={reconTone[r.status]}>{r.status}</Badge>
                </div>
                <div className="md-item__row" style={{ fontSize: 12 }}>
                  <span className="muted">{r.period} · {millions(r.ours)}</span>
                  {d ? <b className="text-red">lệch {formatNumber(Math.abs(d), 1)} tr</b> : null}
                </div>
              </button>
            );
          })}
        </div>
        {current && <ReconDetail key={current.id} r={current} onUpdate={update} />}
      </div>
    </>
  );
}
