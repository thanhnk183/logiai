import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Snowflake } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchBox } from '../../../components/ui/SearchBox';
import { Segmented } from '../../../components/ui/Segmented';
import { StatGrid } from '../../../components/ui/StatCard';
import { formatNumber } from '../../../utils/format';
import { WAREHOUSE, skus, stock } from '../data';
import { stockStatusTone } from '../shared';
import type { Sku } from '../types';
import '../warehouse.css';

const customers = ['Bán lẻ Delta', 'Dệt Minh Phát', 'Thực phẩm Sao Việt', 'Dược An Khang'];

/** Gộp tồn theo mã hàng */
function summarize(sku: Sku) {
  const lines = stock.filter((s) => s.sku === sku.code);
  const qty = lines.reduce((s, l) => s + l.qty, 0);
  const reserved = lines.reduce((s, l) => s + l.reserved, 0);
  const nearExpiry = lines.some((l) => l.status === 'Cận hạn');
  const counting = lines.some((l) => l.status === 'Đang kiểm kê');
  const onHold = lines.some((l) => l.status === 'Giữ hàng');
  return { lines, qty, reserved, available: qty - reserved, low: qty < sku.minStock, nearExpiry, counting, onHold };
}

function SkuDetail({ sku }: { sku: Sku }) {
  const s = summarize(sku);
  return (
    <aside className="card">
      <DetailHeader
        code={sku.code}
        badge={sku.temp !== 'Thường' ? <Badge tone="blue">{sku.temp}</Badge> : undefined}
        title={sku.name}
        subtitle={`${sku.customer} · ${sku.packing}`}
        actions={
          <>
            <Link to="/xuat-kho" className="btn btn--primary btn--sm" style={{ textDecoration: 'none' }}>Tạo lệnh xuất</Link>
            <button className="btn btn--sm">Chuyển vị trí</button>
          </>
        }
      />
      {s.low && (
        <div className="detail__section">
          <Alert tone="amber">Tồn {formatNumber(s.qty)} {sku.uom}, dưới mức tối thiểu {sku.minStock}. Báo khách bổ sung hàng.</Alert>
        </div>
      )}
      <div className="detail__section">
        <div className="debt-boxes">
          <div><span>Tồn thực tế</span><b>{formatNumber(s.qty)}</b></div>
          <div><span>Đã giữ cho đơn</span><b>{formatNumber(s.reserved)}</b></div>
          <div><span>Có thể xuất</span><b className="text-green">{formatNumber(s.available)}</b></div>
        </div>
      </div>
      <div className="detail__section kv-grid">
        <Field label="Đơn vị">{sku.uom}</Field>
        <Field label="Tồn tối thiểu">{sku.minStock} {sku.uom}</Field>
        <Field label="Nhiệt độ bảo quản">{sku.temp}</Field>
        <Field label="Kho">{WAREHOUSE}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Theo vị trí và lô <small>xuất theo FEFO</small></div>
        <table className="table table--compact">
          <thead><tr><th>Vị trí</th><th>Lô / hạn dùng</th><th className="num">Tồn</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {s.lines.map((l) => (
              <tr key={l.location + l.lot}>
                <td><Link to={`/so-do-kho?o=${l.location}`} className="link-mono">{l.location}</Link></td>
                <td>
                  <div className="mono" style={{ fontSize: 11.5 }}>{l.lot}</div>
                  <div className="subtle" style={{ fontSize: 11 }}>Nhập {l.received}{l.expiry ? ` · HSD ${l.expiry}` : ''}</div>
                </td>
                <td className="num">{formatNumber(l.qty)}</td>
                <td><Badge tone={stockStatusTone[l.status]}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}

export default function StockPage() {
  const [customer, setCustomer] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(skus[0].code);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skus.filter(
      (s) => (customer === 'all' || s.customer === customer) && (!q || [s.code, s.name].some((v) => v.toLowerCase().includes(q))),
    );
  }, [customer, query]);

  const current = rows.find((s) => s.code === selected) ?? rows[0];
  const all = skus.map(summarize);

  return (
    <>
      <PageHeader
        icon={<Package size={18} />}
        section="Kho"
        title="Tồn kho"
        description={`Tồn theo mã hàng, vị trí và lô tại ${WAREHOUSE}. Phần đã giữ cho đơn xuất không tính vào tồn có thể xuất.`}
        actions={<button className="btn">Xuất báo cáo tồn</button>}
      />
      <StatGrid
        items={[
          { label: 'Mã hàng đang lưu', value: String(skus.length), note: `${customers.length} chủ hàng`, module: 'WMS' },
          { label: 'Cận hạn sử dụng', value: String(all.filter((s) => s.nearExpiry).length), note: 'Ưu tiên xuất trước', valueTone: 'red', noteTone: 'red' },
          { label: 'Dưới tồn tối thiểu', value: String(all.filter((s) => s.low).length), note: 'Cần báo khách bổ sung', valueTone: 'amber', noteTone: 'amber' },
          { label: 'Vị trí đang kiểm kê', value: String(stock.filter((s) => s.status === 'Đang kiểm kê').length), note: 'Khu A3 · tạm khóa xuất', noteTone: 'amber' },
        ]}
      />

      <div className="toolbar">
        <Segmented<string>
          value={customer}
          onChange={setCustomer}
          options={[{ value: 'all', label: 'Tất cả', count: skus.length }, ...customers.map((c) => ({ value: c, label: c, count: skus.filter((s) => s.customer === c).length }))]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="Mã hàng, tên hàng..." />
      </div>

      <div className="split">
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mã hàng</th>
                <th>Chủ hàng</th>
                <th className="num">Tồn</th>
                <th className="num">Đã giữ</th>
                <th className="num">Có thể xuất</th>
                <th>Vị trí</th>
                <th>Cảnh báo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sku) => {
                const s = summarize(sku);
                return (
                  <tr key={sku.code} className={`clickable ${sku.code === current?.code ? 'selected' : ''}`} onClick={() => setSelected(sku.code)}>
                    <td>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {sku.name}
                        {sku.temp !== 'Thường' && <Snowflake size={13} color="var(--brand)" aria-label={sku.temp} />}
                      </div>
                      <div className="mono subtle" style={{ fontSize: 11 }}>{sku.code}</div>
                    </td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{sku.customer}</td>
                    <td className="num"><b>{formatNumber(s.qty)}</b> <span className="subtle" style={{ fontSize: 11 }}>{sku.uom}</span></td>
                    <td className="num muted">{formatNumber(s.reserved)}</td>
                    <td className="num">{formatNumber(s.available)}</td>
                    <td className="mono" style={{ fontSize: 11.5 }}>{s.lines.map((l) => l.location).join(', ')}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {s.nearExpiry && <Badge tone="red">Cận hạn</Badge>}
                        {s.low && <Badge tone="amber">Dưới tối thiểu</Badge>}
                        {s.counting && <Badge tone="amber">Đang kiểm kê</Badge>}
                        {s.onHold && <Badge tone="blue">Giữ hàng</Badge>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={7} className="subtle" style={{ textAlign: 'center', padding: 24 }}>Không có mã hàng phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
        {current ? <SkuDetail sku={current} /> : <aside className="card md-empty">Chọn một mã hàng.</aside>}
      </div>
    </>
  );
}
