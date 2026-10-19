import { useMemo, useState } from 'react';
import { FileCheck2, Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { Timeline } from '../../../components/ui/Timeline';
import { formatNumber, formatUsd } from '../../../utils/format';
import { declarations as initial } from '../data';
import { ChannelBadge, declarationStatuses, declarationTone, docProgress, fmtVnd, totalValue } from '../shared';
import type { Declaration, DeclarationStatus } from '../types';
import '../customs.css';

type Filter = 'all' | DeclarationStatus;

function DeclarationDetail({ d, onUpdate }: { d: Declaration; onUpdate: (next: Declaration) => void }) {
  const value = totalValue(d);
  const p = docProgress(d);

  const transmit = () =>
    onUpdate({
      ...d,
      number: d.number ?? 'Chờ cấp số',
      status: 'Chờ phân luồng',
      registeredAt: 'vừa xong',
      messages: d.messages.map((m) => (m.state === 'todo' && m.label.startsWith('Truyền') ? { ...m, state: 'done', meta: 'vừa xong' } : m)),
    });

  const actions: Partial<Record<DeclarationStatus, JSX.Element>> = {
    'Đang soạn': (
      <>
        <button className="btn btn--primary btn--sm">Điền nháp từ chứng từ (AI)</button>
        <button className="btn btn--sm" disabled={p.issues > 0} title={p.issues ? 'Còn chứng từ thiếu hoặc lệch' : undefined}>Chuyển sang chờ truyền</button>
      </>
    ),
    'Chờ truyền': (
      <>
        <button className="btn btn--primary btn--sm" onClick={transmit}>Truyền tờ khai lên VNACCS</button>
        <button className="btn btn--sm">Sửa tờ khai</button>
      </>
    ),
    'Chờ kiểm hóa': <button className="btn btn--sm">Đổi lịch kiểm hóa</button>,
    'Đã thông quan': <button className="btn btn--sm">Tải tờ khai đã thông quan</button>,
  };

  return (
    <section className="card">
      <DetailHeader
        code={<>{d.number ?? 'Chưa có số tờ khai'} · <JobLink code={d.job} /></>}
        badge={<Badge tone={declarationTone[d.status]}>{d.status}</Badge>}
        title={d.customer}
        subtitle={`${d.typeCode} · ${d.typeName} · ${d.office}`}
        actions={actions[d.status]}
      />
      {d.status === 'Chờ truyền' && p.issues > 0 && (
        <div className="detail__section"><Alert tone="red">Còn {p.issues} điểm lệch với chứng từ. Sửa trước khi truyền để tránh phải khai bổ sung.</Alert></div>
      )}
      {d.inspection && (
        <div className="detail__section">
          <Alert tone="red"><b>Kiểm hóa {d.inspection.time}</b> · {d.inspection.place}{d.inspection.officer ? ` · ${d.inspection.officer}` : ''}. Cần nhân viên hiện trường có mặt trước 30 phút.</Alert>
        </div>
      )}
      <div className="detail__section kv-grid kv-grid--4">
        <Field label="Phân luồng"><ChannelBadge channel={d.channel} /></Field>
        <Field label="Ngày đăng ký">{d.registeredAt ?? '—'}</Field>
        <Field label="Thông quan">{d.clearedAt ?? '—'}</Field>
        <Field label="Người khai">{d.declarant}</Field>
        <Field label="Trị giá">{formatUsd(value)}</Field>
        <Field label="Tỷ giá">{formatNumber(d.exchangeRate)} ₫/USD</Field>
        <Field label="Thuế NK + VAT">{fmtVnd(d.duty + d.vat)}</Field>
        <Field label="Hồ sơ">{p.ok}/{p.total} chứng từ đủ</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Dòng hàng</div>
        <div className="table-wrap">
          <table className="table table--compact">
            <thead><tr><th>Mã HS</th><th>Mô tả</th><th>Số lượng</th><th className="num">Trị giá</th><th className="num">Thuế suất</th></tr></thead>
            <tbody>
              {d.lines.map((l) => (
                <tr key={l.hs}>
                  <td className="mono" style={{ fontWeight: 600 }}>{l.hs}</td>
                  <td>{l.desc}</td>
                  <td className="muted">{l.qty}</td>
                  <td className="num">{formatUsd(l.value)}</td>
                  <td className="num">{l.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="detail__section">
        <div className="section-title">Phản hồi từ hệ thống hải quan <small>VNACCS</small></div>
        <Timeline items={d.messages} />
      </div>
    </section>
  );
}

export default function DeclarationsPage() {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initial[0].job);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (d) => (filter === 'all' || d.status === filter) && (!q || [d.number ?? '', d.job, d.customer, ...d.lines.map((l) => l.hs)].some((s) => s.toLowerCase().includes(q))),
    );
  }, [items, filter, query]);

  const current = rows.find((d) => d.job === selected) ?? rows[0];
  const count = (s: DeclarationStatus) => items.filter((d) => d.status === s).length;
  const update = (next: Declaration) => setItems((l) => l.map((d) => (d.job === next.job ? next : d)));

  return (
    <>
      <PageHeader
        icon={<FileCheck2 size={18} />}
        section="Hải quan"
        title="Tờ khai"
        description="Tờ khai xuất nhập khẩu lập từ dữ liệu job và chứng từ đã OCR, truyền lên VNACCS và theo dõi phân luồng đến khi thông quan."
        actions={<button className="btn btn--primary"><Plus size={15} /> Tạo tờ khai</button>}
      />
      <StatGrid
        items={[
          { label: 'Tờ khai đang xử lý', value: String(items.filter((d) => d.status !== 'Đã thông quan').length), note: '1 cần truyền trước 20/10 · 12:00', noteTone: 'amber', module: 'CUS' },
          { label: 'Chờ kiểm hóa', value: String(count('Chờ kiểm hóa')), note: 'Luồng đỏ · kiểm hóa 14:00 hôm nay', valueTone: 'red', noteTone: 'red' },
          { label: 'Thông quan · 30 ngày', value: '118', note: '68% luồng xanh' },
          { label: 'Khai bổ sung · 30 ngày', value: '3', note: '2,4% số tờ khai · mục tiêu dưới 3%', noteTone: 'green' },
        ]}
      />

      <div className="toolbar">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'Tất cả', count: items.length }, ...declarationStatuses.map((s) => ({ value: s, label: s, count: count(s) || undefined }))]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Số tờ khai, job, khách, mã HS..." />
      </div>

      <div className="master-detail">
        <div className="card md-list">
          {rows.length === 0 && <div className="md-empty">Không có tờ khai phù hợp.</div>}
          {rows.map((d) => (
            <button key={d.job} className={`md-item ${d.job === current?.job ? 'is-active' : ''}`} onClick={() => setSelected(d.job)}>
              <div className="md-item__row">
                <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{d.number ?? 'Chưa có số'}</span>
                <Badge tone={declarationTone[d.status]}>{d.status}</Badge>
              </div>
              <div style={{ fontWeight: 600 }}>{d.customer}</div>
              <div className="muted" style={{ fontSize: 12 }}><OutlineBadge>{d.typeCode}</OutlineBadge> {d.direction} · {formatUsd(totalValue(d))}</div>
              <div className="md-item__row" style={{ fontSize: 11 }}>
                <span className="mono subtle">{d.job}</span>
                <ChannelBadge channel={d.channel} />
              </div>
            </button>
          ))}
        </div>
        {current ? <DeclarationDetail key={current.job} d={current} onUpdate={update} /> : <div className="card md-empty">Chọn một tờ khai.</div>}
      </div>
    </>
  );
}
