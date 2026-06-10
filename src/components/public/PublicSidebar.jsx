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
  const [hoverTimeout, setHoverTimeout] = useState(null);

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

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const handleMouseEnter = (href) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      router.push(href);
      onClose();
    }, 180); // 180ms delay prevents accidental navigation during quick sweeps
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleLogout = async () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
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
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar container */}
      <div 
        className={clsx(
          "relative flex flex-col w-[220px] h-full bg-slate-950/95 text-white p-5 shadow-2xl z-10 transition-transform duration-300 ease-out border-r border-white/10 backdrop-blur-md rounded-none overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header (Hamburger icon + App Title) */}
        <div className="flex items-center gap-3 py-1.5 mb-5 border-b border-white/10 select-none shrink-0">
          <button 
            onClick={onClose} 
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="font-extrabold text-[16px] tracking-tight bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
            Sylheti Archive
          </span>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 space-y-1 overflow-hidden select-none">
          {publicNavItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-[14px] group",
                  isActive
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={clsx("w-4.5 h-4.5 transition-colors duration-200", isActive ? "text-slate-950" : "text-white/50 group-hover:text-emerald-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separated footer items */}
        <div className="mt-auto pt-3 border-t border-white/10 space-y-1 shrink-0">
          {!loading && user && (
            <>
              {/* Admin Panel Link */}
              {(user.role === 'ADMIN' || user.role === 'SUPERADMIN' || user.role === 'CONTRIBUTOR') && (
                <Link
                  href="/admin/dashboard"
                  onClick={onClose}
                  onMouseEnter={() => handleMouseEnter("/admin/dashboard")}
                  onMouseLeave={handleMouseLeave}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-[14px] group",
                    pathname.startsWith("/admin")
                      ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <LayoutDashboard className={clsx("w-4.5 h-4.5 transition-colors duration-200", pathname.startsWith("/admin") ? "text-slate-950" : "text-white/50 group-hover:text-emerald-400")} />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* My Profile Link */}
              <Link
                href="/profile"
                onClick={onClose}
                onMouseEnter={() => handleMouseEnter("/profile")}
                onMouseLeave={handleMouseLeave}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-[14px] group",
                  pathname === "/profile"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <UserIcon className={clsx("w-4.5 h-4.5 transition-colors duration-200", pathname === "/profile" ? "text-slate-950" : "text-white/50 group-hover:text-emerald-400")} />
                <span>My Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-[14px] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 group"
              >
                <LogOut className="w-4.5 h-4.5 transition-colors duration-200 text-rose-400 group-hover:text-rose-300" />
                <span>Logout</span>
              </button>
            </>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              onClick={onClose}
              onMouseEnter={() => handleMouseEnter("/login")}
              onMouseLeave={handleMouseLeave}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer font-bold text-[14px] bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md text-center"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
