import { useEffect, useRef } from 'react';
import { Bell, MessageSquareText, Plus, Search } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export function Topbar({ role }: { role: string }) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K: focus ô tìm kiếm toàn cục
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="topbar">
      <label className="search">
        <Search size={15} />
        <input ref={searchRef} placeholder="Tìm job, B/L, số container, tờ khai, khách hàng..." aria-label="Tìm kiếm toàn cục" />
        <span className="kbd">Ctrl K</span>
      </label>
      <div className="topbar__spacer" />
      <button className="btn btn--primary">
        <Plus size={15} /> Tạo nhanh
      </button>
      <button className="icon-btn">
        <MessageSquareText size={15} /> Trợ lý AI
      </button>
      <button className="icon-btn" aria-label="Thông báo">
        <Bell size={15} />
        <span className="dot-count">7</span>
      </button>
      <button className="icon-btn mono" aria-label="Ngôn ngữ">
        VI
      </button>
      <div className="user">
        <Avatar initials="LA" size={30} />
        <div>
          <div className="user__name">Lan Anh</div>
          <div className="user__role">{role}</div>
        </div>
      </div>
    </header>
  );
}
