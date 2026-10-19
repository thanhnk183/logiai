import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

/** Mã job có thể bấm, mở màn hình chi tiết job */
export function JobLink({ code, style }: { code: string; style?: CSSProperties }) {
  return (
    <Link to={`/job/${code}`} className="link-mono" style={style} onClick={(e) => e.stopPropagation()}>
      {code}
    </Link>
  );
}
