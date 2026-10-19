import type { Module, StepState, Tone } from '../../types';

export type Role = 'CS / Ops' | 'Điều phối' | 'Kế toán' | 'Quản lý';

export interface TaskItem {
  job: string;
  module: Module;
  task: string;
  customer: string;
  due: string;
  dueTone?: Tone;
  status: string;
  statusTone: Tone;
  bucket: 'today' | 'overdue' | 'week';
}

export interface WatchedJob {
  job: string;
  mode: string;
  route: string;
  detail: string;
  steps: StepState[];
  alert: string;
  alertTone: Tone;
  note: string;
}

export interface Approval {
  module: Module;
  kind: string;
  title: string;
  meta: string;
  amount: string;
}

export interface Notice {
  time: string;
  category: string;
  tone: Tone;
  text: string;
}
