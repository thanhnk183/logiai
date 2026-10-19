import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  bodyClassName?: string;
}

export function Card({ title, subtitle, action, children, className = '', style, bodyClassName = 'card__body' }: CardProps) {
  return (
    <section className={`card ${className}`} style={style}>
      {(title || action) && (
        <div className="card__head">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <div className="card__sub">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
