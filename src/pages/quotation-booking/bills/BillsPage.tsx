import { useMemo, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import type { Tone } from '../../../types';
import type { Bill, BillKind, BillParty, BillStatus } from '../types';
import { billStats, bills as initialBills } from './data';
import '../quotation-booking.css';

type KindFilter = 'all' | BillKind;

const statusTone: Record<BillStatus, Tone> = {
  'Bản nháp': 'gray',
  'Chờ khách duyệt': 'amber',
  'Khách yêu cầu sửa': 'red',
  'Đã phát hành': 'green',
};

const partyLabel: Record<BillParty, string> = { shipper: 'Shipper', consignee: 'Consignee', notify: 'Notify party' };

function Cell({ label, value, flagged = false, wide = false }: { label: string; value: string; flagged?: boolean; wide?: boolean }) {
  return (
    <div className={`doc-cell ${wide ? 'doc-cell--wide' : ''} ${flagged ? 'is-flagged' : ''}`}>
      <div className="doc-cell__label">{label}</div>
      <div className="doc-cell__value">{value}</div>
    </div>
  );
}

function BillSheet({ b }: { b: Bill }) {
  const flagged = b.status === 'Khách yêu cầu sửa' ? b.feedback?.fix?.field : undefined;
  const isAwb = b.kind === 'AWB';
  return (
    <div className="doc-sheet">
      <div className="doc-title">
        <b>{b.level.toUpperCase()} {isAwb ? 'AIR WAYBILL' : 'BILL OF LADING'}</b>
        <span>No. {b.number} · {b.issueType}</span>
      </div>
      {(['shipper', 'consignee', 'notify'] as BillParty[]).map((p) => (
        <Cell key={p} label={partyLabel[p]} value={b[p]} flagged={flagged === p} />
      ))}
      <Cell label={isAwb ? 'Carrier / Flight' : 'Carrier / Vessel – Voyage'} value={`${b.carrier}\n${b.vessel}`} />
      <Cell label={isAwb ? 'Airport of departure' : 'Port of loading'} value={b.pol} />
      <Cell label={isAwb ? 'Airport of destination' : 'Port of discharge'} value={b.pod} />
      <Cell label="Marks & numbers" value={b.marks} />
      <Cell label="Description of goods" value={b.description} />
      <Cell label="No. of packages" value={b.packages} />
      <Cell label="Gross weight / Measurement" value={`${b.weight}\n${b.measure}`} />
      <Cell label="Freight" value={`FREIGHT ${b.freightTerm.toUpperCase()}`} />
      <Cell label={isAwb ? 'Executed on' : 'Shipped on board / Issued'} value={`${b.onBoard ?? '—'}\n${b.issuedAt ? `Issued ${b.issuedAt}` : 'Chưa phát hành'}`} />
    </div>
  );
}

function BillDetail({ b, onUpdate }: { b: Bill; onUpdate: (next: Bill) => void }) {
  const addVersion = (note: string, patch: Partial<Bill>) => {
    const n = Number(b.versions[0]?.version.slice(1) ?? 0) + 1;
    onUpdate({ ...b, ...patch, versions: [{ version: `v${n}`, time: 'vừa xong', by: 'Lan Anh', note }, ...b.versions] });
  };

  const applyFix = () => {
    const fix = b.feedback?.fix;
    if (!fix) return;
    addVersion(`Sửa ${partyLabel[fix.field]} theo yêu cầu khách, gửi lại`, {
      [fix.field]: fix.value,
      status: 'Chờ khách duyệt',
      feedback: undefined,
    });
  };

  const actions: Record<BillStatus, JSX.Element> = {
    'Bản nháp': (
      <>
        <button className="btn btn--primary btn--sm" onClick={() => addVersion('Gửi khách duyệt qua Portal', { status: 'Chờ khách duyệt' })}>
          Gửi khách duyệt
        </button>
        <button className="btn btn--sm">Sửa draft</button>
      </>
    ),
    'Chờ khách duyệt': (
      <>
        <button className="btn btn--primary btn--sm" onClick={() => addVersion('Khách duyệt, phát hành', { status: 'Đã phát hành', issuedAt: '19/10/2026' })}>
          Khách đã duyệt · phát hành
        </button>
        <button className="btn btn--sm">Nhắc khách</button>
      </>
    ),
    'Khách yêu cầu sửa': (
      <>
        {b.feedback?.fix && <button className="btn btn--primary btn--sm" onClick={applyFix}>Sửa theo yêu cầu và gửi lại</button>}
        <button className="btn btn--sm">Sửa thủ công</button>
      </>
    ),
    'Đã phát hành': (
      <>
        <button className="btn btn--sm">Tải PDF</button>
        <button className="btn btn--sm">Gửi khách</button>
      </>
    ),
  };

  return (
    <section className="card">
      <DetailHeader
        code={<><JobLink code={b.job} /> · {b.carrier}</>}
        badge={<Badge tone={statusTone[b.status]}>{b.status}</Badge>}
        title={`${b.level} ${b.kind} · ${b.customer}`}
        subtitle={`${b.pol} → ${b.pod} · ${b.vessel}`}
        actions={actions[b.status]}
      />
      {b.feedback && (
        <div className="detail__section">
          <Alert tone="red">
            <b>{b.feedback.from}</b> · {b.feedback.time}
            <div>{b.feedback.text}</div>
          </Alert>
        </div>
      )}
      <div className="detail__section">
        <BillSheet b={b} />
      </div>
      <div className="detail__section">
        <div className="section-title">Lịch sử phiên bản <small>lưu ở DMS</small></div>
        <ul className="versions">
          {b.versions.map((v) => (
            <li key={v.version}>
              <span className="mono subtle">{v.version}</span>
              <div>
                <div>{v.note}</div>
                <div className="subtle" style={{ fontSize: 11 }}>{v.time} · {v.by}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function BillsPage() {
  const [items, setItems] = useState(initialBills);
  const [kind, setKind] = useState<KindFilter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initialBills[0].number);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (b) =>
        (kind === 'all' || b.kind === kind) &&
        (!q || [b.number, b.job, b.customer, b.vessel].some((s) => s.toLowerCase().includes(q))),
    );
  }, [items, kind, query]);

  const current = rows.find((b) => b.number === selected) ?? rows[0];
  const update = (next: Bill) => setItems((list) => list.map((b) => (b.number === next.number ? next : b)));

  return (
    <>
      <PageHeader
        icon={<ScrollText size={18} />}
        section="Báo giá và Booking"
        title="Vận đơn (B/L, AWB)"
        description="Soạn House/Master B/L và AWB từ SI, gửi khách duyệt draft qua Portal, sửa theo phản hồi và phát hành."
      />
      <StatGrid items={billStats} />

      <div className="toolbar">
        <Segmented<KindFilter>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'Tất cả', count: items.length },
            { value: 'B/L', label: 'B/L', count: items.filter((b) => b.kind === 'B/L').length },
            { value: 'AWB', label: 'AWB', count: items.filter((b) => b.kind === 'AWB').length },
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số vận đơn, job, khách, tàu..." />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có vận đơn phù hợp.</div>}
          {rows.map((b) => (
            <button key={b.number} className={`md-item ${b.number === current?.number ? 'is-active' : ''}`} onClick={() => setSelected(b.number)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{b.number}</span>
                <Badge tone={statusTone[b.status]}>{b.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{b.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                <OutlineBadge>{b.level === 'House' ? 'H' : 'M'}{b.kind === 'AWB' ? 'AWB' : 'BL'}</OutlineBadge> {b.pol} → {b.pod}
              </div>
              <div className="subtle mono" style={{ fontSize: 10.5 }}>{b.job}</div>
            </button>
          ))}
        </div>
        {current ? (
          <BillDetail key={current.number} b={current} onUpdate={update} />
        ) : (
          <div className="card md-empty">Chọn một vận đơn để xem chi tiết.</div>
        )}
      </div>
    </>
  );
}
