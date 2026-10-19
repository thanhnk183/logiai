import { useMemo, useState } from 'react';
import { GitMerge, Plus, Users } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { fold } from '../../documents/shared';
import { jobs } from '../../jobs/data';
import { contractors } from '../../transport/data';
import { partners } from '../data';
import { RecordPanel, StatusBadge, useRecords } from '../shared';
import type { Partner, PartnerKind } from '../types';
import '../master-data.css';

type Kind = 'all' | PartnerKind;

/** Các vấn đề chất lượng dữ liệu của một đối tác */
function issuesOf(p: Partner, all: Partner[]) {
  const out: string[] = [];
  if (!p.taxCode) out.push('Thiếu mã số thuế.');
  const dup = all.find((x) => x.code !== p.code && x.taxCode && x.taxCode === p.taxCode);
  if (dup) out.push(`Trùng mã số thuế với ${dup.code} · ${dup.shortName}.`);
  if (!p.bankAccount && p.status !== 'Ngừng dùng' && p.kind === 'Nhà cung cấp') out.push('Thiếu tài khoản ngân hàng, chưa lập được ủy nhiệm chi.');
  if (!p.bankAccount && p.status === 'Chờ duyệt' && p.kind === 'Khách hàng') out.push('Thiếu tài khoản ngân hàng để đối soát tiền về.');
  return out;
}

/** Mức sử dụng: số job (khách hàng) hoặc số chuyến tháng (nhà thầu vận tải) */
function usageOf(p: Partner) {
  if (p.kind === 'Khách hàng') return `${jobs.filter((j) => j.customer === p.shortName).length} job đang theo dõi`;
  const c = contractors.find((x) => x.code === p.code);
  return c ? `${c.tripsMonth} chuyến trong tháng 10` : '—';
}

export default function PartnersPage() {
  const [rows, update, setRows] = useRecords(partners);
  const [kind, setKind] = useState<Kind>('all');
  const [query, setQuery] = useState('');
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [selected, setSelected] = useState('KH-00431');
  const [notice, setNotice] = useState('');

  const issues = useMemo(() => Object.fromEntries(rows.map((p) => [p.code, issuesOf(p, rows)])), [rows]);
  const q = fold(query.trim());
  const list = rows
    .filter((p) => kind === 'all' || p.kind === kind)
    .filter((p) => !q || fold(`${p.code} ${p.name} ${p.shortName} ${p.taxCode} ${p.group}`).includes(q))
    .filter((p) => !onlyIssues || issues[p.code].length);
  const current = rows.find((p) => p.code === selected) ?? list[0];
  const withIssues = rows.filter((p) => issues[p.code].length).length;
  const dupOf = current && rows.find((x) => x.code !== current.code && x.taxCode && x.taxCode === current.taxCode && x.status !== 'Chờ duyệt');

  const merge = (from: Partner, into: Partner) => {
    setRows((l) => l.filter((p) => p.code !== from.code));
    setSelected(into.code);
    setNotice(`Đã gộp ${from.code} vào ${into.code}. Địa chỉ "${from.address}" được thêm làm địa chỉ giao nhận phụ của ${into.shortName}.`);
  };

  return (
    <>
      <PageHeader
        icon={<Users size={18} />}
        section="Danh mục"
        title="Khách hàng, nhà cung cấp"
        description="Danh mục đối tác dùng chung cho CRM, FMS, TMS và Tài chính. Khách hàng đồng bộ từ CRM, nhà thầu vận tải từ TMS; hệ thống kiểm tra trùng mã số thuế và thông tin còn thiếu."
        actions={<button className="btn btn--primary"><Plus size={14} /> Thêm đối tác</button>}
      />
      <StatGrid
        items={[
          { label: 'Khách hàng', value: String(rows.filter((p) => p.kind === 'Khách hàng').length), note: 'Đồng bộ từ CRM' },
          { label: 'Nhà cung cấp', value: String(rows.filter((p) => p.kind === 'Nhà cung cấp').length), note: 'Vận tải, hãng tàu, cảng, khử trùng' },
          { label: 'Chờ duyệt', value: String(rows.filter((p) => p.status === 'Chờ duyệt').length), note: 'Bản ghi mới tạo hoặc đang thẩm định', valueTone: 'amber' },
          { label: 'Có vấn đề dữ liệu', value: String(withIssues), note: 'Trùng MST, thiếu MST hoặc tài khoản', valueTone: withIssues ? 'red' : undefined, noteTone: withIssues ? 'red' : undefined },
        ]}
      />
      {notice && <div style={{ marginBottom: 12 }}><Alert tone="green">{notice}</Alert></div>}

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Mã, tên, mã số thuế" />
        <Segmented<Kind>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'Tất cả', count: rows.length },
            { value: 'Khách hàng', label: 'Khách hàng', count: rows.filter((p) => p.kind === 'Khách hàng').length },
            { value: 'Nhà cung cấp', label: 'Nhà cung cấp', count: rows.filter((p) => p.kind === 'Nhà cung cấp').length },
          ]}
        />
        <label className="check-inline">
          <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} /> Chỉ bản ghi có vấn đề
        </label>
      </div>

      <div className="split split--wide">
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Mã</th><th>Đối tác</th><th>Nhóm</th><th>Mã số thuế</th><th>Nguồn</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.code} className={`clickable ${p.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(p.code)}>
                  <td className="mono" style={{ whiteSpace: 'nowrap' }}>{p.code}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.shortName}</div>
                    <div className="subtle" style={{ fontSize: 11.5 }}>{p.kind}</div>
                  </td>
                  <td className="muted">{p.group}</td>
                  <td className="mono">
                    {p.taxCode || <span className="subtle">—</span>}
                    {issues[p.code].length > 0 && <div><Badge tone="red">{issues[p.code].length} vấn đề</Badge></div>}
                  </td>
                  <td className="muted">{p.source}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={6} className="md-empty">Không có đối tác phù hợp.</td></tr>}
            </tbody>
          </table>
        </Card>

        {current && (
          <RecordPanel
            key={current.code}
            code={`${current.code} · ${current.kind}`}
            title={current.name}
            subtitle={`${current.group} · ${usageOf(current)}`}
            record={current}
            issues={issues[current.code]}
            onSave={(patch) => update(current.code, patch as Partial<Partner>)}
            onStatus={(status) => update(current.code, { status })}
            fields={[
              { key: 'shortName', label: 'Tên ngắn', value: current.shortName },
              { key: 'taxCode', label: 'Mã số thuế', value: current.taxCode, mono: true },
              { key: 'address', label: 'Địa chỉ', value: current.address, full: true },
              { key: 'paymentTerm', label: 'Điều khoản thanh toán', value: current.paymentTerm },
              { key: 'bankAccount', label: 'Tài khoản ngân hàng', value: current.bankAccount, placeholder: 'Ngân hàng · số tài khoản' },
              { key: 'contact', label: 'Liên hệ chính', value: current.contact, full: true },
              { key: 'source', label: 'Nguồn dữ liệu', value: current.source, readOnly: true },
            ]}
          >
            {dupOf && current.status === 'Chờ duyệt' && (
              <div className="detail__section">
                <div className="section-title">Gợi ý gộp bản ghi</div>
                <div className="merge-box">
                  <div><span className="mono">{current.code}</span> {current.shortName}<div className="subtle">{current.address}</div></div>
                  <GitMerge size={16} className="subtle" />
                  <div><span className="mono">{dupOf.code}</span> {dupOf.shortName}<div className="subtle">{dupOf.address}</div></div>
                </div>
                <div className="muted" style={{ fontSize: 12, margin: '8px 0' }}>
                  Cùng mã số thuế nên là cùng pháp nhân. Nên giữ {dupOf.code} và thêm chi nhánh Hà Nội làm địa chỉ giao nhận, tránh tách công nợ.
                </div>
                <button className="btn btn--primary btn--sm" onClick={() => merge(current, dupOf)}><GitMerge size={14} /> Gộp vào {dupOf.code}</button>
              </div>
            )}
          </RecordPanel>
        )}
      </div>
    </>
  );
}
