'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { 
  Home, 
  Info, 
  Sparkles, 
  Bookmark, 
  FileText, 
  Mail, 
  Users, 
  FileDown, 
  Heart, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Menu,
  X
} from 'lucide-react';

const publicNavItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About Org', href: '/about', icon: Info },
  { label: 'What we Do', href: '/what-we-do', icon: Sparkles },
  { label: 'Archive', href: '/collection', icon: Bookmark },
  { label: 'Blogs', href: '/blogs', icon: FileText },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'People', href: '/people', icon: Users },
  { label: 'Reports', href: '/reports', icon: FileDown },
  { label: 'Donate', href: '/donate', icon: Heart },
];

export default function PublicSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authentication state
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    onClose();
    window.location.reload();
  };

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[100] flex transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar container */}
      <div 
        className={clsx(
          "relative flex flex-col w-[290px] h-full bg-white text-slate-800 p-6 shadow-2xl z-10 transition-transform duration-300 ease-out rounded-r-[2rem] border-r border-slate-200/50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header (Hamburger icon + App Title) */}
        <div className="flex items-center gap-4 py-2 mb-6 border-b border-slate-100 select-none shrink-0">
          <button 
            onClick={onClose} 
            type="button"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer outline-none"
          >
            <Menu className="w-6 h-6 text-slate-800" />
          </button>
          <span className="font-extrabold text-[20px] tracking-tight text-slate-900">
            Sylheti Archive
          </span>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          {publicNavItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium text-[15px] group",
                  isActive
                    ? "bg-[#3f66f2] text-white shadow-lg shadow-blue-600/10 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className={clsx("w-5 h-5 transition-colors duration-200", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separated footer items */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-1.5 shrink-0">
          {!loading && user && (
            <>
              {/* Admin Panel Link */}
              {(user.role === 'ADMIN' || user.role === 'SUPERADMIN' || user.role === 'CONTRIBUTOR') && (
                <Link
                  href="/admin/dashboard"
                  onClick={onClose}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium text-[15px] group",
                    pathname.startsWith("/admin")
                      ? "bg-[#3f66f2] text-white shadow-lg shadow-blue-600/10 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <LayoutDashboard className={clsx("w-5 h-5 transition-colors duration-200", pathname.startsWith("/admin") ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* My Profile Link */}
              <Link
                href="/profile"
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium text-[15px] group",
                  pathname === "/profile"
                    ? "bg-[#3f66f2] text-white shadow-lg shadow-blue-600/10 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <UserIcon className={clsx("w-5 h-5 transition-colors duration-200", pathname === "/profile" ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span>My Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium text-[15px] text-rose-500 hover:bg-rose-50/50 hover:text-rose-600 group"
              >
                <LogOut className="w-5 h-5 transition-colors duration-200 text-rose-400 group-hover:text-rose-500" />
                <span>Logout</span>
              </button>
            </>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-bold text-[15px] bg-[#3f66f2] hover:bg-blue-600 text-white shadow-md text-center"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
