import type { ReactNode } from 'react';

interface DetailHeaderProps {
  code: ReactNode;
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

/** Phần đầu của panel chi tiết: mã chứng từ + trạng thái, tiêu đề, mô tả, nút thao tác. */
export function DetailHeader({ code, badge, title, subtitle, actions }: DetailHeaderProps) {
  return (
    <div className="detail__section detail-head">
      <div className="detail-head__top">
        <span className="mono subtle" style={{ fontSize: 11 }}>{code}</span>
        {badge}
      </div>
      <h2 className="detail-head__title">{title}</h2>
      {subtitle && <div className="muted" style={{ fontSize: 12 }}>{subtitle}</div>}
      {actions && <div className="detail-head__actions">{actions}</div>}
    </div>
  );
}
