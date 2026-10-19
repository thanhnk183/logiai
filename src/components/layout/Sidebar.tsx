import { useEffect, useState, type MouseEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { appModules } from '../../pages';
import { Logo, LogoMark } from '../ui/Logo';

const STORAGE_KEY = 'logiai.sidebarCollapsed';

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Nhóm menu chứa trang đang mở (ví dụ /job/HPH-... thuộc nhóm Job / Lô hàng) */
function groupOf(pathname: string) {
  return appModules.find(
    (m) => m.title && m.menu.some((i) => i.path !== '/' && (pathname === i.path || pathname.startsWith(`${i.path}/`))),
  )?.title;
}

export function Sidebar() {
  const { pathname } = useLocation();

  // Mặc định các nhóm đều đóng, chỉ mở nhóm chứa trang hiện tại
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const g = groupOf(pathname);
    return g ? { [g]: true } : {};
  });
  const toggleGroup = (title: string) => setOpenGroups((g) => ({ ...g, [title]: !g[title] }));

  // Chuyển sang trang thuộc nhóm khác (qua link trong nội dung) thì mở nhóm đó
  useEffect(() => {
    const g = groupOf(pathname);
    if (g) setOpenGroups((o) => (o[g] ? o : { ...o, [g]: true }));
  }, [pathname]);

  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch {
      // bỏ qua nếu trình duyệt chặn storage
    }
  }, [collapsed]);

  const ToggleIcon = collapsed ? ChevronRight : ChevronLeft;

  // Tooltip hiện tên đầy đủ khi menu thu gọn hoặc khi chữ bị cắt "…".
  // Dùng position: fixed để không bị cắt bởi vùng cuộn của sidebar.
  const [tip, setTip] = useState<{ text: string; top: number; left: number } | null>(null);

  const showTip = (e: MouseEvent<HTMLElement>, text: string) => {
    const el = e.currentTarget;
    const label = el.querySelector<HTMLElement>('.nav-link__label');
    const truncated = !!label && label.scrollWidth > label.clientWidth;
    if (!collapsed && !truncated) return;
    const rect = el.getBoundingClientRect();
    setTip({ text, top: rect.top + rect.height / 2, left: rect.right + 8 });
  };
  const hideTip = () => setTip(null);
  const tipProps = (text: string) => ({
    onMouseEnter: (e: MouseEvent<HTMLElement>) => showTip(e, text),
    onMouseLeave: hideTip,
    onFocus: hideTip,
    'aria-label': text,
  });

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar__logo">{collapsed ? <LogoMark size={30} /> : <Logo />}</div>

      <nav className="sidebar__nav">
        {appModules.map((m, i) => {
          const open = collapsed || !m.title || !!openGroups[m.title];
          return (
            <div key={m.title ?? i}>
              {m.title &&
                (collapsed ? (
                  <div className="sidebar__sep" />
                ) : (
                  <button className="sidebar__group" onClick={() => toggleGroup(m.title!)} aria-expanded={open}>
                    {m.title}
                    <ChevronDown size={12} style={{ transform: open ? undefined : 'rotate(-90deg)', transition: 'transform .15s' }} />
                  </button>
                ))}
              {open &&
                m.menu.map(({ path, label, icon: Icon }) => (
                  <NavLink key={path} to={path} end={path === '/'} className="nav-link" {...tipProps(label)}>
                    <Icon size={16} /> <span className="nav-link__label">{label}</span>
                  </NavLink>
                ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__settings" {...tipProps('Cài đặt')}>
          <Settings size={17} className="sidebar__settings-icon" />
          <span className="nav-link__label">Cài đặt</span>
        </button>
        <button
          className="sidebar__toggle"
          onClick={() => {
            hideTip();
            setCollapsed((c) => !c);
          }}
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          <ToggleIcon size={16} />
        </button>
      </div>

      {tip && (
        <div className="nav-tooltip" role="tooltip" style={{ top: tip.top, left: tip.left }}>
          {tip.text}
        </div>
      )}
    </aside>
  );
}
