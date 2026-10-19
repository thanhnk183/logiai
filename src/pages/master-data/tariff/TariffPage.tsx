import { Fragment, useState } from 'react';
import { Check, ReceiptText, X } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { fold } from '../../documents/shared';
import { approver } from '../../quotation-booking/quotations/data';
import { TARIFF_VERSION, tariff } from '../data';
import { RecordPanel, StatusBadge, useRecords } from '../shared';
import type { TariffItem } from '../types';
import '../master-data.css';

const money = (v: number, c: TariffItem['currency']) => (c === 'USD' ? `${formatNumber(v)} USD` : `${formatNumber(v)} ₫`);
const groups = [...new Set(tariff.map((t) => t.group))];

export default function TariffPage() {
  const [rows, update] = useRecords(tariff);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('THC-40');
  const [notice, setNotice] = useState('');

  const q = fold(query.trim());
  const list = rows.filter((t) => !q || fold(`${t.code} ${t.name} ${t.group} ${t.modes}`).includes(q));
  const current = rows.find((t) => t.code === selected) ?? list[0];
  const proposals = rows.filter((t) => t.proposal);

  const decide = (t: TariffItem, ok: boolean) => {
    if (ok && t.proposal) update(t.code, { price: t.proposal.price, proposal: undefined });
    else update(t.code, { proposal: undefined });
    setNotice(ok ? `Đã duyệt giá mới ${t.name}: ${money(t.proposal!.price, t.currency)} từ ${t.proposal!.from}.` : `Đã từ chối đề xuất đổi giá ${t.name}.`);
  };

  return (
    <>
      <PageHeader
        icon={<ReceiptText size={18} />}
        section="Danh mục"
        title="Biểu phí chuẩn"
        description="Giá bán chuẩn của các khoản phí địa phương, hải quan, vận tải nội địa và kho. Báo giá lấy giá từ đây; giá thấp hơn giá sàn cần Trưởng phòng kinh doanh duyệt."
        actions={<button className="btn">Xuất Excel</button>}
      />
      <StatGrid
        items={[
          { label: 'Phiên bản đang áp dụng', value: 'v3', note: `${TARIFF_VERSION.name} · từ ${TARIFF_VERSION.from}` },
          { label: 'Khoản phí đang dùng', value: String(rows.filter((t) => t.status === 'Đang dùng').length), note: `${groups.length} nhóm phí` },
          { label: 'Đề xuất đổi giá chờ duyệt', value: String(proposals.length), note: `Người duyệt: ${approver.split(' · ')[0]}`, valueTone: proposals.length ? 'amber' : undefined },
          { label: 'Thuế VAT', value: '0% / 8%', note: 'Dịch vụ quốc tế 0%, nội địa 8%' },
        ]}
      />
      {notice && <div style={{ marginBottom: 12 }}><Alert tone="green">{notice}</Alert></div>}
      {proposals.length > 0 && (
        <Card title="Đề xuất đổi giá chờ duyệt" style={{ marginBottom: 16 }} bodyClassName="">
          {proposals.map((t) => (
            <div key={t.code} className="proposal">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{t.proposal!.reason} · đề xuất bởi {t.proposal!.by}</div>
              </div>
              <div className="proposal__price">
                <span className="subtle" style={{ textDecoration: 'line-through' }}>{money(t.price, t.currency)}</span>
                <b>{money(t.proposal!.price, t.currency)}</b>
                <span className="subtle">từ {t.proposal!.from}</span>
              </div>
              <button className="btn btn--primary btn--sm" onClick={() => decide(t, true)}><Check size={14} /> Duyệt</button>
              <button className="btn btn--sm" onClick={() => decide(t, false)}><X size={14} /> Từ chối</button>
            </div>
          ))}
        </Card>
      )}

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} placeholder="Mã phí, tên, loại hình" />
      </div>
      <div className="split split--wide">
        <Card bodyClassName="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Mã</th><th>Khoản phí</th><th>Đơn vị</th><th className="num">Giá chuẩn</th><th className="num">Giá sàn</th><th>VAT</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {groups.map((g) => {
                const items = list.filter((t) => t.group === g);
                if (!items.length) return null;
                return (
                  <Fragment key={g}>
                    <tr><td colSpan={7} className="group-row">{g}</td></tr>
                    {items.map((t) => (
                      <tr key={t.code} className={`clickable ${t.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(t.code)}>
                        <td className="mono" style={{ whiteSpace: 'nowrap' }}>{t.code}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <div className="subtle" style={{ fontSize: 11.5 }}>{t.modes}</div>
                        </td>
                        <td className="muted" style={{ whiteSpace: 'nowrap' }}>{t.unit}</td>
                        <td className="num" style={{ fontWeight: 600 }}>
                          {money(t.price, t.currency)}
                          {t.proposal && <div><Badge tone="amber">→ {formatNumber(t.proposal.price)}</Badge></div>}
                        </td>
                        <td className="num muted">{money(t.floor, t.currency)}</td>
                        <td className="mono">{t.vat}</td>
                        <td><StatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </Card>

        {current && (
          <RecordPanel
            key={`${current.code}-${current.price}`}
            code={`${current.code} · ${current.group}`}
            title={current.name}
            subtitle={`Áp dụng: ${current.modes}`}
            record={current}
            onSave={(patch) => {
              const num = (k: 'price' | 'floor') => (patch[k] !== undefined ? Number(patch[k].replace(/\./g, '').replace(',', '.')) : current[k]);
              const price = num('price');
              const floor = num('floor');
              if (Number.isNaN(price) || Number.isNaN(floor)) return;
              // Đổi giá chuẩn không áp dụng ngay mà tạo đề xuất chờ duyệt
              const { price: _p, floor: _f, ...rest } = patch;
              update(current.code, {
                ...(rest as Partial<TariffItem>),
                floor,
                ...(price !== current.price ? { proposal: { price, from: '01/11/2026', by: 'Lan Anh', reason: 'Điều chỉnh từ danh mục' } } : {}),
              });
              if (price !== current.price) setNotice(`Đã gửi đề xuất đổi giá ${current.name} cho ${approver.split(' · ')[0]} duyệt.`);
            }}
            onStatus={(status) => update(current.code, { status })}
            fields={[
              { key: 'name', label: 'Tên khoản phí', value: current.name, full: true },
              { key: 'unit', label: 'Đơn vị tính', value: current.unit },
              { key: 'modes', label: 'Áp dụng cho', value: current.modes },
              { key: 'price', label: `Giá chuẩn (${current.currency})`, value: formatNumber(current.price), mono: true },
              { key: 'floor', label: `Giá sàn (${current.currency})`, value: formatNumber(current.floor), mono: true },
              { key: 'vat', label: 'Thuế VAT', value: current.vat, mono: true },
            ]}
          >
            <div className="detail__section kv-grid">
              <Field label="Biên độ được giảm">{formatNumber(((current.price - current.floor) / current.price) * 100, 1)}% không cần duyệt</Field>
              <Field label="Phiên bản">{TARIFF_VERSION.name}</Field>
              {current.proposal && (
                <Field label="Đề xuất đang chờ" full>
                  {money(current.proposal.price, current.currency)} từ {current.proposal.from} · {current.proposal.by}
                </Field>
              )}
            </div>
            <div className="detail__section subtle" style={{ fontSize: 11.5 }}>
              Đổi giá chuẩn sẽ tạo đề xuất chờ duyệt, không áp dụng ngay cho báo giá đang mở.
            </div>
          </RecordPanel>
        )}
      </div>
    </>
  );
}
