import { useState } from 'react';
import { Hash, Plus, Sparkles } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { JobLink } from '../../../components/ui/JobLink';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { declarations } from '../../customs/data';
import { fold } from '../../documents/shared';
import { hsCodes, uoms } from '../data';
import { RecordPanel, StatusBadge, useRecords } from '../shared';
import type { HsCode, Uom } from '../types';
import '../master-data.css';

type Tab = 'hs' | 'uom';

/** Tờ khai có dòng hàng dùng mã HS này */
const declarationsWith = (code: string) => declarations.filter((d) => d.lines.some((l) => l.hs === code));

/** Gợi ý mã HS theo số từ trùng trong mô tả (mô phỏng gợi ý AI) */
function suggest(text: string, list: HsCode[]) {
  const words = fold(text).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  if (!words.length) return [];
  return list
    .map((h) => ({ h, score: words.filter((w) => fold(h.desc).includes(w)).length / words.length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function HsTab() {
  const [rows, update] = useRecords(hsCodes);
  const [query, setQuery] = useState('');
  const [describe, setDescribe] = useState('áo sơ mi cotton nam');
  const [selected, setSelected] = useState('6205.20');
  const q = fold(query.trim());
  const list = rows.filter((h) => !q || fold(`${h.code} ${h.desc} ${h.policy ?? ''}`).includes(q));
  const current = rows.find((h) => h.code === selected) ?? list[0];
  const used = current ? declarationsWith(current.code) : [];
  const hints = suggest(describe, rows);

  return (
    <>
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Mã HS, mô tả, chính sách" />
      </div>
      <div className="split split--wide">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Card bodyClassName="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Mã HS</th><th>Mô tả</th><th>Thuế NK MFN</th><th>Ưu đãi đặc biệt</th><th>VAT</th><th className="num">Tờ khai</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                {list.map((h) => (
                  <tr key={h.code} className={`clickable ${h.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(h.code)}>
                    <td className="mono" style={{ fontWeight: 600 }}>{h.code}</td>
                    <td>
                      {h.desc}
                      {h.policy && <div style={{ fontSize: 11.5, color: 'var(--amber)' }}>{h.policy}</div>}
                    </td>
                    <td className="mono">{h.mfn}</td>
                    <td className="mono">{h.special ?? <span className="subtle">—</span>}</td>
                    <td className="mono">{h.vat}</td>
                    <td className="num">{declarationsWith(h.code).length || <span className="subtle">—</span>}</td>
                    <td><StatusBadge status={h.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title={<><Sparkles size={14} style={{ verticalAlign: -2, color: 'var(--brand)' }} /> Gợi ý mã HS từ mô tả hàng</>} subtitle="Gõ mô tả như trên Invoice, hệ thống gợi ý mã đã dùng trước đây">
            <input className="input" value={describe} onChange={(e) => setDescribe(e.target.value)} placeholder="Ví dụ: bàn ghế gỗ cao su" aria-label="Mô tả hàng" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {hints.map(({ h, score }) => (
                <button key={h.code} className="hint-row" onClick={() => setSelected(h.code)}>
                  <span className="mono" style={{ fontWeight: 600 }}>{h.code}</span>
                  <span style={{ flex: 1 }}>{h.desc}</span>
                  <Badge tone={score >= 0.6 ? 'green' : 'gray'}>{Math.round(score * 100)}% khớp</Badge>
                </button>
              ))}
              {!hints.length && <div className="subtle" style={{ fontSize: 12 }}>Chưa có mã nào khớp. Gửi bộ phận hải quan tra cứu và thêm mã mới.</div>}
            </div>
          </Card>
        </div>

        {current && (
          <RecordPanel
            key={current.code}
            code={`HS ${current.code}`}
            title={current.desc}
            subtitle={`Biểu thuế 2026 · dùng ở ${used.length} tờ khai`}
            record={current}
            onSave={(patch) => update(current.code, patch as Partial<HsCode>)}
            onStatus={(status) => update(current.code, { status })}
            issues={current.status === 'Chờ duyệt' ? ['Mã mới do Sales đề xuất cho RFQ cà phê Tây Nguyên, cần bộ phận hải quan xác nhận trước khi dùng trên tờ khai.'] : []}
            fields={[
              { key: 'desc', label: 'Mô tả', value: current.desc, full: true },
              { key: 'mfn', label: 'Thuế NK ưu đãi (MFN)', value: current.mfn, mono: true },
              { key: 'special', label: 'Ưu đãi đặc biệt hay dùng', value: current.special ?? '', mono: true },
              { key: 'vat', label: 'Thuế VAT', value: current.vat, mono: true },
              { key: 'policy', label: 'Chính sách quản lý', value: current.policy ?? '', placeholder: 'Giấy phép, kiểm tra chuyên ngành' },
            ]}
          >
            {used.length > 0 && (
              <div className="detail__section">
                <div className="section-title">Tờ khai dùng mã này</div>
                {used.map((d) => (
                  <div key={d.job} className="party-row">
                    <span><JobLink code={d.job} /> <span className="subtle">· {d.customer}</span></span>
                    <span className="mono" style={{ fontSize: 11.5 }}>{d.lines.find((l) => l.hs === current.code)?.rate}</span>
                  </div>
                ))}
              </div>
            )}
          </RecordPanel>
        )}
      </div>
    </>
  );
}

function UomTab() {
  const [rows, update] = useRecords(uoms);
  const [selected, setSelected] = useState('CW');
  const current = rows.find((u) => u.code === selected) ?? rows[0];
  return (
    <div className="split split--wide">
      <Card bodyClassName="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Mã</th><th>Tên</th><th>Nhóm</th><th>Mã trên VNACCS</th><th>Quy đổi</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.code} className={`clickable ${u.code === current.code ? 'selected' : ''}`} onClick={() => setSelected(u.code)}>
                <td className="mono" style={{ fontWeight: 600 }}>{u.code}</td>
                <td>{u.name}</td>
                <td className="muted">{u.kind}</td>
                <td className="mono">{u.customsCode}</td>
                <td className="muted" style={{ fontSize: 12 }}>{u.convert ?? '—'}</td>
                <td><StatusBadge status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <RecordPanel
        key={current.code}
        code={`Đơn vị ${current.code}`}
        title={current.name}
        subtitle={current.kind}
        record={current}
        onSave={(patch) => update(current.code, patch as Partial<Uom>)}
        onStatus={(status) => update(current.code, { status })}
        fields={[
          { key: 'name', label: 'Tên', value: current.name },
          { key: 'customsCode', label: 'Mã trên VNACCS', value: current.customsCode, mono: true },
          { key: 'convert', label: 'Quy đổi', value: current.convert ?? '', full: true },
        ]}
      />
    </div>
  );
}

export default function HsUomPage() {
  const [tab, setTab] = useState<Tab>('hs');
  const policies = hsCodes.filter((h) => h.policy).length;

  return (
    <>
      <PageHeader
        icon={<Hash size={18} />}
        section="Danh mục"
        title="Mã HS, đơn vị tính"
        description="Mã HS với thuế suất và chính sách quản lý, dùng khi lập tờ khai và kiểm tra hồ sơ; đơn vị tính và cách quy đổi dùng cho báo giá, kho và hải quan."
        actions={<button className="btn btn--primary"><Plus size={14} /> {tab === 'hs' ? 'Thêm mã HS' : 'Thêm đơn vị'}</button>}
      />
      <StatGrid
        items={[
          { label: 'Mã HS đang dùng', value: String(hsCodes.filter((h) => h.status === 'Đang dùng').length), note: `${hsCodes.filter((h) => h.status === 'Chờ duyệt').length} mã chờ duyệt`, module: 'CUS' },
          { label: 'Có chính sách quản lý', value: String(policies), note: 'Giấy phép, kiểm dịch, an toàn thực phẩm', valueTone: 'amber' },
          { label: 'Đơn vị tính', value: String(uoms.length), note: 'Đếm, khối lượng, thể tích, container' },
          { label: 'Biểu thuế áp dụng', value: '2026', note: 'Cập nhật theo Nghị định 26/2023 và các FTA' },
        ]}
      />
      <div style={{ marginBottom: 12 }}>
        <Segmented<Tab> value={tab} onChange={setTab} options={[{ value: 'hs', label: 'Mã HS', count: hsCodes.length }, { value: 'uom', label: 'Đơn vị tính', count: uoms.length }]} />
      </div>
      {tab === 'hs' ? <HsTab /> : <UomTab />}
    </>
  );
}
