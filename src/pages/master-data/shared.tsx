import { useState, type ReactNode } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { DetailHeader } from '../../components/ui/DetailHeader';
import type { Tone } from '../../types';
import type { MasterMeta, RecordStatus } from './types';

export const statusTone: Record<RecordStatus, Tone> = { 'Đang dùng': 'green', 'Ngừng dùng': 'gray', 'Chờ duyệt': 'amber' };

export function StatusBadge({ status }: { status: RecordStatus }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
}

/** Danh sách bản ghi có thể sửa tại chỗ; mọi thay đổi ghi người sửa là Lan Anh, lúc 08:15 hôm nay */
export function useRecords<T extends MasterMeta & { code: string }>(initial: T[]) {
  const [rows, setRows] = useState(initial);
  const update = (code: string, patch: Partial<T>) =>
    setRows((list) => list.map((r) => (r.code === code ? { ...r, ...patch, updated: '19/10', updatedBy: 'Lan Anh' } : r)));
  return [rows, update, setRows] as const;
}

export interface FieldDef {
  key: string;
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
  /** Không cho sửa (vd. mã, dữ liệu đồng bộ từ phân hệ khác) */
  readOnly?: boolean;
  placeholder?: string;
}

interface RecordPanelProps {
  code: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  record: MasterMeta;
  fields: FieldDef[];
  onSave: (patch: Record<string, string>) => void;
  onStatus: (status: RecordStatus) => void;
  /** Cảnh báo chất lượng dữ liệu của bản ghi */
  issues?: string[];
  children?: ReactNode;
}

/** Panel chi tiết bản ghi danh mục: xem, sửa, đổi trạng thái. Đặt `key` theo mã bản ghi để reset khi đổi bản ghi. */
export function RecordPanel({ code, title, subtitle, record, fields, onSave, onStatus, issues = [], children }: RecordPanelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const changed = Object.entries(draft).filter(([k, v]) => fields.find((f) => f.key === k)?.value !== v);

  const save = () => {
    if (changed.length) onSave(Object.fromEntries(changed));
    setEditing(false);
    setDraft({});
  };

  return (
    <section className="card">
      <DetailHeader
        code={code}
        badge={<StatusBadge status={record.status} />}
        title={title}
        subtitle={subtitle}
        actions={
          editing ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={save}><Check size={14} /> Lưu{changed.length ? ` ${changed.length} thay đổi` : ''}</button>
              <button className="btn btn--sm" onClick={() => { setEditing(false); setDraft({}); }}><X size={14} /> Hủy</button>
            </>
          ) : (
            <>
              <button className="btn btn--sm" onClick={() => setEditing(true)}><Pencil size={14} /> Sửa</button>
              {record.status === 'Chờ duyệt' && <button className="btn btn--primary btn--sm" onClick={() => onStatus('Đang dùng')}>Duyệt</button>}
              {record.status === 'Đang dùng' && <button className="btn btn--sm" onClick={() => onStatus('Ngừng dùng')}>Ngừng dùng</button>}
              {record.status === 'Ngừng dùng' && <button className="btn btn--sm" onClick={() => onStatus('Đang dùng')}>Dùng lại</button>}
            </>
          )
        }
      />
      {issues.length > 0 && (
        <div className="detail__section">
          <Alert tone="amber">{issues.join(' ')}</Alert>
        </div>
      )}
      <div className="detail__section kv-grid">
        {fields.map((f) => (
          <div key={f.key} style={f.full ? { gridColumn: '1 / -1' } : undefined}>
            <label className="kv__k" htmlFor={`md-${f.key}`}>{f.label}</label>
            {editing && !f.readOnly ? (
              <input
                id={`md-${f.key}`}
                className={`input ${f.mono ? 'mono' : ''}`}
                style={{ padding: '5px 8px', fontSize: 12.5, marginTop: 2 }}
                value={draft[f.key] ?? f.value}
                placeholder={f.placeholder}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            ) : (
              <div className={`kv__v ${f.mono ? 'mono' : ''}`}>{f.value || <span className="subtle">Chưa có</span>}</div>
            )}
          </div>
        ))}
      </div>
      {children}
      <div className="detail__section subtle" style={{ fontSize: 11.5 }}>
        Cập nhật {record.updated}/2026 · {record.updatedBy}
      </div>
    </section>
  );
}
