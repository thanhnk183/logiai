import type { ReactNode } from 'react';

interface PageHeaderProps {
  icon: ReactNode;
  section: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ icon, section, title, description, actions }: PageHeaderProps) {
  return (
    <div className="page-head">
      <div className="page-head__icon">{icon}</div>
      <div>
        <div className="breadcrumb">
          <span>{section}</span> / <span>{title}</span>
        </div>
        <h1 className="page-head__title">{title}</h1>
        <p className="page-head__desc">{description}</p>
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </div>
  );
}
