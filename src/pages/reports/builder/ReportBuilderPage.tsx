import { useMemo, useState } from 'react';
import { CalendarClock, Download, Save, SlidersHorizontal } from 'lucide-react';
import { HBars } from '../../../components/charts/HBars';
import { Alert } from '../../../components/ui/Alert';
import { ModuleTag } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Segmented } from '../../../components/ui/Segmented';
import { formatNumber } from '../../../utils/format';
import { runReport, savedReports, sources, type ReportConfig } from './sources';
import '../reports.css';

type View = 'chart' | 'table';
const schedules = ['Không gửi tự động', 'Hằng ngày lúc 08:00', 'Thứ Hai hằng tuần', 'Ngày 1 hằng tháng'];

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ReportBuilderPage() {
  const [saved, setSaved] = useState(savedReports);
  const [cfg, setCfg] = useState<ReportConfig>(savedReports[0]);
  const [view, setView] = useState<View>('chart');
  const [top, setTop] = useState('10');
  const [schedule, setSchedule] = useState(schedules[0]);
  const [notice, setNotice] = useState('');

  const src = sources.find((s) => s.key === cfg.source)!;
  const report = useMemo(() => runReport(src, cfg), [src, cfg]);
  const shown = top === 'all' ? report.result : report.result.slice(0, Number(top));
  const total = report.measure.agg === 'avg' ? undefined : report.result.reduce((s, r) => s + r.value, 0);
  const filterDim = src.dims.find((d) => d.key === cfg.filterDim);
  const filterValues = filterDim ? [...new Set(src.rows.map(filterDim.get))].sort() : [];

  const set = (patch: Partial<ReportConfig>) => {
    setCfg((c) => ({ ...c, ...patch }));
    setNotice('');
  };
  const changeSource = (key: string) => {
    const s = sources.find((x) => x.key === key)!;
    set({ source: key, dim: s.dims[0].key, measure: s.measures[0].key, filterDim: '', filterValue: '', name: `${s.measures[0].label} theo ${s.dims[0].label.toLowerCase()}` });
  };
  const save = () => {
    setSaved((list) => [cfg, ...list.filter((r) => r.name !== cfg.name)]);
    setNotice(`Đã lưu "${cfg.name}"${schedule !== schedules[0] ? ` · gửi email ${schedule.toLowerCase()}` : ''}.`);
  };

  return (
    <>
      <PageHeader
        icon={<SlidersHorizontal size={18} />}
        section="Báo cáo"
        title="Báo cáo tự tạo"
        description="Chọn nguồn dữ liệu, nhóm theo và chỉ số cần xem. Kết quả tính ngay trên dữ liệu đang có của các phân hệ; lưu lại để dùng hoặc gửi email định kỳ."
      />

      <div className="builder">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Báo cáo đã lưu">
            {saved.map((r) => {
              const s = sources.find((x) => x.key === r.source)!;
              return (
                <button key={r.name} className={`saved-item ${r.name === cfg.name ? 'is-active' : ''}`} onClick={() => { setCfg(r); setNotice(''); }}>
                  <b style={{ fontWeight: 600 }}>{r.name}</b>
                  <div className="subtle" style={{ fontSize: 11.5, display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                    <ModuleTag module={s.module} plain /> {s.label}
                  </div>
                </button>
              );
            })}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Card title="Thiết lập">
            <div className="kv-grid kv-grid--3" style={{ gap: 12 }}>
              <Select id="rb-source" label="Nguồn dữ liệu" value={cfg.source} onChange={changeSource} options={sources.map((s) => ({ value: s.key, label: `${s.label} (${s.rows.length} dòng)` }))} />
              <Select id="rb-dim" label="Nhóm theo" value={cfg.dim} onChange={(v) => set({ dim: v })} options={src.dims.map((d) => ({ value: d.key, label: d.label }))} />
              <Select id="rb-measure" label="Chỉ số" value={cfg.measure} onChange={(v) => set({ measure: v })} options={src.measures.map((m) => ({ value: m.key, label: m.label }))} />
              <Select
                id="rb-fdim"
                label="Lọc theo"
                value={cfg.filterDim}
                onChange={(v) => set({ filterDim: v, filterValue: '' })}
                options={[{ value: '', label: 'Không lọc' }, ...src.dims.filter((d) => d.key !== cfg.dim).map((d) => ({ value: d.key, label: d.label }))]}
              />
              {filterDim ? (
                <Select id="rb-fval" label={`Giá trị ${filterDim.label.toLowerCase()}`} value={cfg.filterValue} onChange={(v) => set({ filterValue: v })} options={[{ value: '', label: 'Tất cả' }, ...filterValues.map((v) => ({ value: v, label: v }))]} />
              ) : <div />}
              <Select id="rb-top" label="Hiển thị" value={top} onChange={setTop} options={[{ value: '5', label: '5 nhóm lớn nhất' }, { value: '10', label: '10 nhóm lớn nhất' }, { value: 'all', label: 'Tất cả nhóm' }]} />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 260px' }}>
                <label className="field-label" htmlFor="rb-name">Tên báo cáo</label>
                <input id="rb-name" className="input" value={cfg.name} onChange={(e) => set({ name: e.target.value })} />
              </div>
              <div style={{ flex: '0 1 220px' }}>
                <label className="field-label" htmlFor="rb-schedule"><CalendarClock size={12} style={{ verticalAlign: -2 }} /> Gửi email</label>
                <select id="rb-schedule" className="select" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                  {schedules.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn btn--primary" onClick={save} disabled={!cfg.name.trim()}><Save size={14} /> Lưu báo cáo</button>
              <button className="btn"><Download size={14} /> Xuất Excel</button>
            </div>
            {notice && <div style={{ marginTop: 12 }}><Alert tone="green">{notice}</Alert></div>}
          </Card>

          <Card
            title={cfg.name || 'Kết quả'}
            subtitle={`${report.rowCount} dòng ${src.label.toLowerCase()} · ${report.result.length} nhóm${total !== undefined ? ` · tổng ${report.measure.format(total)}` : ''}`}
            action={<Segmented<View> value={view} onChange={setView} options={[{ value: 'chart', label: 'Biểu đồ' }, { value: 'table', label: 'Bảng' }]} />}
            bodyClassName={view === 'table' ? 'table-wrap' : 'card__body'}
          >
            {!shown.length ? (
              <div className="md-empty">Không có dữ liệu phù hợp. Thử bỏ bộ lọc hoặc chọn chỉ số khác.</div>
            ) : view === 'chart' ? (
              <HBars rows={shown.map((r) => ({ label: r.label, value: r.value, sub: report.measure.agg === 'count' ? undefined : `${r.n} dòng` }))} unit={report.measure.unit} />
            ) : (
              <table className="table">
                <thead>
                  <tr><th>{report.dim.label}</th><th className="num">Số dòng</th><th className="num">{report.measure.label}</th>{total !== undefined && <th className="num">Tỷ trọng</th>}</tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.label}>
                      <td style={{ fontWeight: 600 }}>{r.label}</td>
                      <td className="num">{r.n}</td>
                      <td className="num">{report.measure.format(r.value)}</td>
                      {total !== undefined && <td className="num muted">{formatNumber(total ? (r.value / total) * 100 : 0, 1)}%</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
