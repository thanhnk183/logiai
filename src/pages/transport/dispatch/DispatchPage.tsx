import { useMemo, useState } from 'react';
import { Truck, Undo2 } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge, OutlineBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { NOW_HOUR, TODAY, orders as initialOrders, vehicles } from '../data';
import { fmtHour } from '../shared';
import type { Region, TransportOrder, Vehicle } from '../types';
import '../transport.css';

const START = 5;
const END = 24;
const HOURS = Array.from({ length: (END - START) / 2 + 1 }, (_, i) => START + 1 + i * 2).filter((h) => h < END);
const pct = (h: number) => ((Math.min(Math.max(h, START), END) - START) / (END - START)) * 100;

const overlaps = (a: TransportOrder, b: TransportOrder) => a.start < b.end && b.start < a.end;

/** Ngày có lệnh từ hôm nay trở đi, sắp theo thứ tự */
const toKey = (d: string) => d.split('/').reverse().join('');
const boardDates = [...new Set(initialOrders.map((o) => o.date))].filter((d) => toKey(d) >= toKey(TODAY)).sort((a, b) => toKey(a).localeCompare(toKey(b)));

type Fit = { ok: true; conflict?: TransportOrder } | { ok: false; reason: string };

function checkFit(v: Vehicle, order: TransportOrder, schedule: TransportOrder[]): Fit {
  if (v.status === 'Bảo dưỡng') return { ok: false, reason: 'Xe đang bảo dưỡng' };
  if (v.type !== order.needs) return { ok: false, reason: `Cần ${order.needs.toLowerCase()}` };
  return { ok: true, conflict: schedule.find((s) => overlaps(s, order)) };
}

export default function DispatchPage() {
  const [items, setItems] = useState(initialOrders);
  const [region, setRegion] = useState<Region>('TP.HCM');
  const [date, setDate] = useState(TODAY);
  const [selectedCode, setSelectedCode] = useState<string>();
  const [justAssigned, setJustAssigned] = useState<string[]>([]);

  const dayOrders = useMemo(() => items.filter((o) => o.region === region && o.date === date), [items, region, date]);
  const queue = dayOrders.filter((o) => o.status === 'Chờ điều xe');
  const selected = queue.find((o) => o.code === selectedCode);
  const fleet = vehicles.filter((v) => v.region === region);

  const assign = (order: TransportOrder, v: Vehicle) => {
    setItems((list) => list.map((o) => (o.code === order.code ? { ...o, vehicle: v.plate, status: 'Đã điều xe' } : o)));
    setJustAssigned((l) => [order.code, ...l]);
    setSelectedCode(undefined);
  };
  const undo = (code: string) => {
    setItems((list) => list.map((o) => (o.code === code ? { ...o, vehicle: undefined, status: 'Chờ điều xe' } : o)));
    setJustAssigned((l) => l.filter((c) => c !== code));
  };

  return (
    <>
      <PageHeader
        icon={<Truck size={18} />}
        section="Vận tải"
        title="Điều phối xe"
        description="Lịch xe theo giờ. Chọn một lệnh chờ điều xe để xem xe nào phù hợp, rồi bấm Gán xe. Hệ thống cảnh báo khi trùng lịch."
      />

      <div className="toolbar">
        <Segmented<Region>
          value={region}
          onChange={(r) => { setRegion(r); setSelectedCode(undefined); }}
          options={[{ value: 'TP.HCM', label: 'TP.HCM' }, { value: 'Hải Phòng', label: 'Hải Phòng' }]}
        />
        <Segmented<string>
          value={date}
          onChange={(d) => { setDate(d); setSelectedCode(undefined); }}
          options={boardDates.map((d) => ({
            value: d,
            label: d === TODAY ? `Hôm nay ${d}` : d,
            count: items.filter((o) => o.date === d && o.region === region && o.status === 'Chờ điều xe').length || undefined,
          }))}
        />
        <span className="toolbar__right">{fleet.length} xe · {dayOrders.length} lệnh trong ngày</span>
      </div>

      <div className="dispatch">
        <div className="dispatch__side">
          <Card title="Lệnh chờ điều xe" action={<Badge tone={queue.length ? 'amber' : 'green'}>{queue.length}</Badge>} bodyClassName="">
            {queue.length === 0 && <p className="subtle" style={{ padding: '0 16px 16px' }}>Đã điều xe cho mọi lệnh trong ngày.</p>}
            {queue.map((o) => (
              <button key={o.code} className={`queue-item ${o.code === selectedCode ? 'is-active' : ''}`} onClick={() => setSelectedCode(o.code === selectedCode ? undefined : o.code)}>
                <div className="md-item__row">
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{o.code}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtHour(o.start)} – {fmtHour(o.end)}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{o.kind}</div>
                <div className="muted" style={{ fontSize: 12 }}>{o.from} → {o.to}</div>
                <div className="md-item__row" style={{ marginTop: 4 }}>
                  <span className="subtle" style={{ fontSize: 11.5 }}>{o.customer}</span>
                  <OutlineBadge>{o.needs}</OutlineBadge>
                </div>
                {o.note && <div className="text-amber" style={{ fontSize: 11.5, marginTop: 2 }}>{o.note}</div>}
              </button>
            ))}
          </Card>

          {justAssigned.length > 0 && (
            <Card title="Vừa điều xe" bodyClassName="">
              {justAssigned.map((code) => {
                const o = items.find((x) => x.code === code)!;
                return (
                  <div key={code} className="assigned-item">
                    <div>
                      <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{code}</div>
                      <div style={{ fontSize: 12 }}>→ <span className="mono">{o.vehicle}</span></div>
                    </div>
                    <button className="btn btn--sm" onClick={() => undo(code)}><Undo2 size={13} /> Hoàn tác</button>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        <div className="card board">
          {selected && (
            <div style={{ padding: '12px 14px 0' }}>
              <Alert tone="blue">
                Đang chọn <b>{selected.code}</b> · {selected.kind}, {fmtHour(selected.start)} – {fmtHour(selected.end)}. Khung nét đứt là vị trí lệnh trên lịch từng xe.
              </Alert>
            </div>
          )}
          <div className="board__scroll">
            <div className="board__head">
              <div className="board__label" />
              <div className="board__axis">
                {HOURS.map((h) => (
                  <span key={h} style={{ left: `${pct(h)}%` }}>{fmtHour(h)}</span>
                ))}
              </div>
            </div>
            {fleet.map((v) => {
              const schedule = dayOrders.filter((o) => o.vehicle === v.plate);
              const fit = selected ? checkFit(v, selected, schedule) : undefined;
              return (
                <div key={v.plate} className={`board__row ${fit && !fit.ok ? 'is-dim' : ''}`}>
                  <div className="board__label">
                    <div className="md-item__row">
                      <span className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{v.plate}</span>
                      <Badge tone={v.status === 'Sẵn sàng' ? 'green' : v.status === 'Đang chạy' ? 'blue' : 'gray'}>{v.status}</Badge>
                    </div>
                    <div style={{ fontSize: 12 }}>{v.driver}</div>
                    <div className="subtle" style={{ fontSize: 11 }}>{v.type} · {v.owner}</div>
                    {fit && (fit.ok ? (
                      <button className={`btn btn--sm ${fit.conflict ? '' : 'btn--primary'}`} style={{ marginTop: 6 }} onClick={() => assign(selected!, v)}>
                        {fit.conflict ? `Gán (trùng ${fit.conflict.code.slice(-4)})` : 'Gán xe'}
                      </button>
                    ) : (
                      <div className="subtle" style={{ fontSize: 11.5, marginTop: 6 }}>{fit.reason}</div>
                    ))}
                  </div>
                  <div className="board__lane">
                    {HOURS.map((h) => <span key={h} className="board__grid" style={{ left: `${pct(h)}%` }} />)}
                    {date === TODAY && <span className="board__now" style={{ left: `${pct(NOW_HOUR)}%` }} title={`Bây giờ ${fmtHour(NOW_HOUR)}`} />}
                    {schedule.map((o) => (
                      <div
                        key={o.code}
                        className={`board__bar is-${o.status === 'Đang chạy' ? 'running' : 'planned'} ${justAssigned.includes(o.code) ? 'is-new' : ''}`}
                        style={{ left: `${pct(o.start)}%`, width: `${pct(o.end) - pct(o.start)}%` }}
                        title={`${o.code} · ${o.kind} · ${o.from} → ${o.to}`}
                      >
                        <b>{o.kind}</b>
                        <span>{o.to}</span>
                      </div>
                    ))}
                    {selected && fit?.ok && (
                      <div
                        className={`board__ghost ${fit.conflict ? 'is-conflict' : ''}`}
                        style={{ left: `${pct(selected.start)}%`, width: `${pct(selected.end) - pct(selected.start)}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
