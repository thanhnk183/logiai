import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LayoutGrid, Snowflake } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { DetailHeader } from '../../../components/ui/DetailHeader';
import { Field } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { formatNumber } from '../../../utils/format';
import { WAREHOUSE, bayFill, findSku, locCode, stock, zoneFill, zones } from '../data';
import { stockStatusTone } from '../shared';
import '../warehouse.css';

/** Thang lấp đầy: một màu (xanh thương hiệu) từ nhạt đến đậm */
const STEPS = [
  { max: 0, label: 'Trống', cls: 'is-0' },
  { max: 0.5, label: 'Dưới 50%', cls: 'is-1' },
  { max: 0.75, label: '50–75%', cls: 'is-2' },
  { max: 0.9, label: '75–90%', cls: 'is-3' },
  { max: 1, label: 'Trên 90%', cls: 'is-4' },
];
const stepOf = (f: number) => STEPS.find((s) => f <= s.max) ?? STEPS[STEPS.length - 1];

const parseLoc = (code: string | null) => {
  const m = code?.match(/^([A-Z])(\d+)-(\d+)$/);
  return m ? { zone: m[1], rack: Number(m[2]), bay: Number(m[3]) } : undefined;
};

function BayDetail({ code }: { code: string }) {
  const p = parseLoc(code)!;
  const fill = bayFill(p.zone, p.rack, p.bay);
  const lines = stock.filter((s) => s.location === code);
  const zone = zones.find((z) => z.code === p.zone)!;
  return (
    <aside className="card">
      <DetailHeader
        code={zone.name}
        badge={lines.some((l) => l.status === 'Đang kiểm kê') ? <Badge tone="amber">Đang kiểm kê</Badge> : undefined}
        title={<span className="mono">{code}</span>}
        subtitle={`Dãy ${p.zone}${p.rack} · ô ${String(p.bay).padStart(2, '0')} · ${zone.temp}`}
        actions={<button className="btn btn--sm">Chuyển hàng sang vị trí khác</button>}
      />
      <div className="detail__section kv-grid">
        <Field label="Lấp đầy">{Math.round(fill * 100)}%</Field>
        <Field label="Chủ hàng">{zone.customer}</Field>
      </div>
      <div className="detail__section">
        <div className="section-title">Hàng tại vị trí</div>
        {lines.length === 0 ? (
          <p className="subtle">{fill === 0 ? 'Vị trí trống, có thể cất hàng.' : 'Hàng lô cũ, chưa có chi tiết trong dữ liệu mẫu.'}</p>
        ) : (
          lines.map((l) => {
            const sku = findSku(l.sku);
            return (
              <div key={l.lot} className="bay-line">
                <div className="md-item__row">
                  <b>{sku.name}</b>
                  <Badge tone={stockStatusTone[l.status]}>{l.status}</Badge>
                </div>
                <div className="mono subtle" style={{ fontSize: 11 }}>{l.sku} · {l.lot}</div>
                <div className="muted" style={{ fontSize: 12 }}>{formatNumber(l.qty)} {sku.uom}{l.expiry ? ` · HSD ${l.expiry}` : ''}</div>
              </div>
            );
          })
        )}
        <Link to="/ton-kho" className="link-small" style={{ display: 'inline-block', marginTop: 8 }}>Xem trong Tồn kho</Link>
      </div>
    </aside>
  );
}

export default function WarehouseMapPage() {
  const [params, setParams] = useSearchParams();
  const initial = parseLoc(params.get('o'));
  const [zoneCode, setZoneCode] = useState(initial?.zone ?? 'A');
  const selected = params.get('o') ?? undefined;
  const zone = zones.find((z) => z.code === zoneCode)!;

  const counting = new Set(stock.filter((s) => s.status === 'Đang kiểm kê').map((s) => s.location));
  const select = (code: string) => setParams({ o: code }, { replace: true });

  return (
    <>
      <PageHeader
        icon={<LayoutGrid size={18} />}
        section="Kho"
        title="Sơ đồ vị trí kho"
        description={`${WAREHOUSE}: mỗi ô là một vị trí kệ, màu càng đậm càng đầy. Bấm vào ô để xem hàng đang lưu.`}
      />

      <div className="zone-cards">
        {zones.map((z) => {
          const f = zoneFill(z);
          return (
            <button key={z.code} className={`card zone-card ${z.code === zoneCode ? 'is-active' : ''}`} onClick={() => setZoneCode(z.code)}>
              <div className="md-item__row">
                <b>{z.name}</b>
                {z.temp !== 'Thường' && <Snowflake size={14} color="var(--brand)" aria-label={z.temp} />}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{z.customer} · {z.racks * z.bays} vị trí</div>
              <div className="progress" style={{ marginTop: 8, height: 6 }}>
                <div className="progress__bar" style={{ width: `${f}%`, background: 'var(--brand)' }} />
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}><b>{f}%</b> <span className="subtle">lấp đầy</span></div>
            </button>
          );
        })}
      </div>

      <div className="toolbar">
        <Segmented<string> value={zoneCode} onChange={setZoneCode} options={zones.map((z) => ({ value: z.code, label: `Khu ${z.code}` }))} />
        <div className="map-legend">
          {STEPS.map((s) => <span key={s.cls}><i className={`bay ${s.cls}`} /> {s.label}</span>)}
          <span><i className="bay is-2 is-counting" /> Đang kiểm kê</span>
        </div>
      </div>

      <div className="split">
        <div className="card map">
          <div className="map__head">
            <b>{zone.name}</b>
            <span className="muted">{zone.temp} · {zone.customer}</span>
          </div>
          <div className="map__grid" style={{ gridTemplateColumns: `56px repeat(${zone.bays}, minmax(40px, 1fr))` }}>
            <span />
            {Array.from({ length: zone.bays }, (_, b) => <span key={b} className="map__col">{String(b + 1).padStart(2, '0')}</span>)}
            {Array.from({ length: zone.racks }, (_, r) => (
              <Row key={r} zone={zone.code} rack={r + 1} bays={zone.bays} selected={selected} counting={counting} onSelect={select} />
            ))}
          </div>
          <div className="map__aisle">Lối đi xe nâng · cửa nhập ở phía dưới</div>
        </div>
        {selected && parseLoc(selected) ? <BayDetail code={selected} /> : <aside className="card md-empty">Bấm vào một ô kệ để xem chi tiết.</aside>}
      </div>
    </>
  );
}

function Row({ zone, rack, bays, selected, counting, onSelect }: {
  zone: string; rack: number; bays: number; selected?: string; counting: Set<string>; onSelect: (code: string) => void;
}) {
  return (
    <>
      <span className="map__row">Dãy {zone}{rack}</span>
      {Array.from({ length: bays }, (_, b) => {
        const code = locCode(zone, rack, b + 1);
        const fill = bayFill(zone, rack, b + 1);
        const cls = stepOf(fill).cls;
        return (
          <button
            key={code}
            className={`bay ${cls} ${counting.has(code) ? 'is-counting' : ''} ${code === selected ? 'is-selected' : ''}`}
            onClick={() => onSelect(code)}
            title={`${code} · ${Math.round(fill * 100)}%`}
            aria-label={`Vị trí ${code}, lấp đầy ${Math.round(fill * 100)}%`}
          >
            {stock.some((s) => s.location === code) && <span className="bay__dot" />}
          </button>
        );
      })}
    </>
  );
}
