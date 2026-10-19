import type { Module } from '../../../types';
import { formatNumber } from '../../../utils/format';
import { declarations } from '../../customs/data';
import { dmsDocs } from '../../documents/data';
import { USD_RATE, arInvoices } from '../../finance/data';
import { jobs } from '../../jobs/data';
import { jobFinance, modeLabel } from '../../jobs/shared';
import { trips } from '../../transport/data';

export interface Dimension<T> {
  key: string;
  label: string;
  get: (row: T) => string;
}

export interface Measure<T> {
  key: string;
  label: string;
  /** Hậu tố đơn vị hiển thị trên thanh */
  unit: string;
  agg: 'count' | 'sum' | 'avg';
  get?: (row: T) => number | undefined;
  format: (v: number) => string;
}

export interface Source<T = unknown> {
  key: string;
  label: string;
  module: Module;
  rows: T[];
  dims: Dimension<T>[];
  measures: Measure<T>[];
}

/** Giữ kiểu chặt khi khai báo, sau đó gộp chung vào một danh sách */
const define = <T,>(s: Source<T>) => s as unknown as Source;

const count = (noun: string) => ({ key: 'count', label: `Số ${noun}`, unit: ` ${noun}`, agg: 'count' as const, format: (v: number) => `${formatNumber(v)} ${noun}` });
const trieu = (v: number) => `${formatNumber(v, 1)} tr ₫`;
const toVnd = (j: (typeof jobs)[number], n: number) => (j.finance.currency === 'USD' ? n * USD_RATE : n);

export const sources: Source[] = [
  define({
    key: 'jobs',
    label: 'Job / lô hàng',
    module: 'FMS',
    rows: jobs,
    dims: [
      { key: 'customer', label: 'Khách hàng', get: (j) => j.customer },
      { key: 'mode', label: 'Loại hình', get: (j) => modeLabel[j.mode] },
      { key: 'status', label: 'Trạng thái', get: (j) => j.status },
      { key: 'direction', label: 'Hướng', get: (j) => j.direction },
      { key: 'sales', label: 'Nhân viên sales', get: (j) => j.sales },
    ],
    measures: [
      count('job'),
      { key: 'revenue', label: 'Doanh thu (quy VND)', unit: ' tr', agg: 'sum', get: (j) => toVnd(j, jobFinance(j).revenue) / 1e6, format: trieu },
      { key: 'profit', label: 'Lãi gộp (quy VND)', unit: ' tr', agg: 'sum', get: (j) => toVnd(j, jobFinance(j).profit) / 1e6, format: trieu },
      { key: 'margin', label: 'Tỷ lệ lãi gộp bình quân', unit: '%', agg: 'avg', get: (j) => jobFinance(j).margin, format: (v) => `${formatNumber(v, 1)}%` },
    ],
  }),
  define({
    key: 'ar',
    label: 'Hóa đơn phải thu',
    module: 'FIN',
    rows: arInvoices,
    dims: [
      { key: 'customer', label: 'Khách hàng', get: (r) => r.customer },
      { key: 'status', label: 'Trạng thái', get: (r) => r.status },
      { key: 'kind', label: 'Loại chứng từ', get: (r) => r.kind },
    ],
    measures: [
      count('hóa đơn'),
      { key: 'amount', label: 'Số tiền', unit: ' tr', agg: 'sum', get: (r) => r.amount / 1e6, format: trieu },
    ],
  }),
  define({
    key: 'trips',
    label: 'Chuyến xe',
    module: 'TMS',
    rows: trips,
    dims: [
      { key: 'driver', label: 'Tài xế', get: (t) => t.driver },
      { key: 'vehicle', label: 'Xe', get: (t) => t.vehicle },
      { key: 'status', label: 'Trạng thái', get: (t) => t.status },
      { key: 'date', label: 'Ngày', get: (t) => t.date },
    ],
    measures: [
      count('chuyến'),
      { key: 'km', label: 'Quãng đường', unit: ' km', agg: 'sum', get: (t) => t.distanceKm, format: (v) => `${formatNumber(v)} km` },
      { key: 'cost', label: 'Chi phí phát sinh', unit: ' nghìn ₫', agg: 'sum', get: (t) => t.costs.reduce((s, c) => s + c.amount, 0) / 1000, format: (v) => `${formatNumber(v)} nghìn ₫` },
    ],
  }),
  define({
    key: 'declarations',
    label: 'Tờ khai hải quan',
    module: 'CUS',
    rows: declarations,
    dims: [
      { key: 'customer', label: 'Khách hàng', get: (d) => d.customer },
      { key: 'channel', label: 'Luồng', get: (d) => (d.channel ? `Luồng ${d.channel.toLowerCase()}` : 'Chưa phân luồng') },
      { key: 'status', label: 'Trạng thái', get: (d) => d.status },
      { key: 'direction', label: 'Hướng', get: (d) => d.direction },
    ],
    measures: [
      count('tờ khai'),
      { key: 'tax', label: 'Thuế NK + VAT', unit: ' tr', agg: 'sum', get: (d) => (d.duty + d.vat) / 1e6, format: trieu },
      { key: 'hours', label: 'Giờ thông quan bình quân', unit: ' giờ', agg: 'avg', get: (d) => d.clearHours, format: (v) => `${formatNumber(v, 1)} giờ` },
    ],
  }),
  define({
    key: 'docs',
    label: 'Chứng từ',
    module: 'DMS',
    rows: dmsDocs,
    dims: [
      { key: 'type', label: 'Loại chứng từ', get: (d) => d.type },
      { key: 'source', label: 'Nguồn', get: (d) => d.source },
      { key: 'status', label: 'Trạng thái', get: (d) => d.status },
      { key: 'customer', label: 'Đối tác', get: (d) => d.customer },
    ],
    measures: [count('chứng từ')],
  }),
];

export interface ReportConfig {
  name: string;
  source: string;
  dim: string;
  measure: string;
  filterDim: string;
  filterValue: string;
}

/** Nhóm theo chiều, tính chỉ số; bỏ nhóm không có số liệu (vd. trung bình khi mọi dòng trống) */
export function runReport(src: Source, c: ReportConfig) {
  const dim = src.dims.find((d) => d.key === c.dim) ?? src.dims[0];
  const m = src.measures.find((x) => x.key === c.measure) ?? src.measures[0];
  const fd = src.dims.find((d) => d.key === c.filterDim);
  const rows = src.rows.filter((r) => !fd || !c.filterValue || fd.get(r) === c.filterValue);
  const groups = new Map<string, number[]>();
  for (const r of rows) {
    const v = m.agg === 'count' ? 1 : m.get!(r);
    if (v === undefined) continue;
    const k = dim.get(r);
    groups.set(k, [...(groups.get(k) ?? []), v]);
  }
  const result = [...groups.entries()].map(([label, vals]) => {
    const sum = vals.reduce((s, v) => s + v, 0);
    return { label, value: m.agg === 'avg' ? sum / vals.length : sum, n: vals.length };
  });
  return { dim, measure: m, rowCount: rows.length, result: result.sort((a, b) => b.value - a.value) };
}

export const savedReports: ReportConfig[] = [
  { name: 'Lãi gộp theo khách hàng', source: 'jobs', dim: 'customer', measure: 'profit', filterDim: '', filterValue: '' },
  { name: 'Hóa đơn quá hạn theo khách', source: 'ar', dim: 'customer', measure: 'amount', filterDim: 'status', filterValue: 'Quá hạn' },
  { name: 'Quãng đường theo tài xế', source: 'trips', dim: 'driver', measure: 'km', filterDim: '', filterValue: '' },
  { name: 'Thuế nộp hộ theo khách hàng', source: 'declarations', dim: 'customer', measure: 'tax', filterDim: '', filterValue: '' },
  { name: 'Chứng từ theo nguồn nhận', source: 'docs', dim: 'source', measure: 'count', filterDim: '', filterValue: '' },
];
