import type { Tone } from '../../types';
import { formatNumber, formatUsd } from '../../utils/format';
import type { DocStatus, Job, JobMode, JobStatus } from './types';

export const jobStatuses: JobStatus[] = ['Đang thực hiện', 'Chờ chứng từ', 'Có vấn đề', 'Hoàn tất'];

export const jobStatusTone: Record<JobStatus, Tone> = {
  'Đang thực hiện': 'blue',
  'Chờ chứng từ': 'amber',
  'Có vấn đề': 'red',
  'Hoàn tất': 'green',
};

export const modeLabel: Record<JobMode, string> = {
  FCL: 'Sea FCL',
  LCL: 'Sea LCL',
  AIR: 'Air',
  FTL: 'Trucking',
  WH: 'Kho',
};

export const docStatusTone: Record<DocStatus, Tone> = {
  'Đã duyệt': 'green',
  'Chờ duyệt OCR': 'blue',
  'Lệch': 'red',
  'Thiếu': 'amber',
  'Nháp': 'gray',
};

export function formatMoney(n: number, currency: 'USD' | 'VND'): string {
  return currency === 'USD' ? formatUsd(n) : `${formatNumber(n)} ₫`;
}

export function jobFinance(job: Job) {
  const revenue = job.finance.revenue.reduce((s, l) => s + l.amount, 0);
  const cost = job.finance.costs.reduce((s, l) => s + l.amount, 0);
  return { revenue, cost, profit: revenue - cost, margin: revenue ? ((revenue - cost) / revenue) * 100 : 0 };
}

/** Số chứng từ cần xử lý (thiếu hoặc lệch) */
export const docIssues = (job: Job) => job.documents.filter((d) => d.status === 'Thiếu' || d.status === 'Lệch').length;
