// components/public/TransparentNavbar.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Menu, Search, Bookmark, Grid3X3, LogOut, LayoutDashboard, ChevronDown, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PublicSidebar from '@/components/public/PublicSidebar';
import NotificationBell from '@/components/public/NotificationBell';
import { useTheme } from '@/components/ThemeProvider';

export default function TransparentNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : user?.username
    ? user.username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const isLight = theme === 'light';

  const iconColorClass = isLight || scrolled ? "text-slate-800 dark:text-white" : "text-white";
  const hoverBgClass = isLight || scrolled ? "hover:bg-slate-100 dark:hover:bg-white/10" : "hover:bg-white/10";
  const logoTitleClass = isLight || scrolled ? "text-slate-900 dark:text-white" : "text-white";
  const logoSubtitleClass = isLight || scrolled ? "text-slate-500 dark:text-white/60" : "text-white/60";
  const logoBorderClass = isLight || scrolled ? "border-slate-200 dark:border-white/10" : "border-white/10";

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 w-full z-50 px-6 py-3 transition-all duration-300 flex items-center justify-between',
          scrolled
            ? 'bg-white/70 dark:bg-background/65 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-lg text-slate-800 dark:text-white'
            : isLight
              ? 'bg-gradient-to-b from-white/80 to-transparent text-slate-800'
              : 'bg-gradient-to-b from-background/80 to-transparent text-white'
        )}
      >
        {/* Left Toggle + Logo Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className={clsx("p-2 rounded-full transition-colors cursor-pointer outline-none", hoverBgClass)}
            title="Open Menu"
          >
            <Menu className={clsx("w-6 h-6", iconColorClass)} />
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="Sylheti Archive Logo"
              width={48}
              height={48}
              className={clsx("rounded-lg w-10 h-10 sm:w-12 sm:h-12 border", logoBorderClass)}
            />
            <div className="flex flex-col leading-tight max-w-[180px] sm:max-w-none">
              <span className={clsx("font-extrabold text-[14px] sm:text-[18px] tracking-wide", logoTitleClass)}>
                Sylheti Archive
              </span>
              <span className={clsx("font-light text-[9px] sm:text-[11px]", logoSubtitleClass)}>
                An Initiative of
              </span>
              <span className="font-semibold text-[8px] sm:text-[11px] leading-snug bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                Siloti Archive Research & Cultural Centre
              </span>
            </div>
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/search" className={clsx("p-2 rounded-full transition-colors duration-200 cursor-pointer", hoverBgClass)} title="Search">
            <Search className={clsx("w-5 h-5 opacity-90 hover:opacity-100", iconColorClass)} />
          </Link>
          <Link href="/collection" className={clsx("p-2 rounded-full transition-colors duration-200 cursor-pointer", hoverBgClass)} title="Archive Collections">
            <Bookmark className={clsx("w-5 h-5 opacity-90 hover:opacity-100", iconColorClass)} />
          </Link>
          {!loading && user && <NotificationBell iconColorClass={iconColorClass} hoverBgClass={hoverBgClass} />}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className={clsx("p-2 rounded-full transition-colors duration-200 cursor-pointer outline-none", hoverBgClass)}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className={clsx("w-5 h-5 opacity-90 hover:opacity-100 transition-transform hover:rotate-45", iconColorClass)} />
            ) : (
              <Moon className={clsx("w-5 h-5 opacity-90 hover:opacity-100 transition-transform hover:-rotate-12", iconColorClass)} />
            )}
          </button>

          {/* User Session Handler */}
          {!loading && (
            user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className={clsx("flex items-center gap-2 focus:outline-none cursor-pointer p-1 rounded-full transition-colors", hoverBgClass)}
                >
                  <Avatar className={clsx("w-8 h-8 border", logoBorderClass)}>
                    <AvatarImage src={user.avatarUrl} alt={user.name || user.username} />
                    <AvatarFallback className={clsx("text-xs font-semibold", isLight || scrolled ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white" : "bg-slate-800 text-white")}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className={clsx("hidden md:inline text-sm font-semibold max-w-[100px] truncate", isLight || scrolled ? "text-slate-700 dark:text-white/90" : "text-white/90")}>{user.name || user.username}</span>
                  <ChevronDown className={clsx("w-4 h-4 hidden md:block", isLight || scrolled ? "text-slate-400 dark:text-white/50" : "text-white/50")} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl p-1 shadow-2xl backdrop-blur-md z-50">
                    {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      href="/submit"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span>Submit Item</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-red-500 dark:text-red-400 font-medium cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-[13px] sm:text-[14px] px-4 py-1.5 rounded-full shadow-lg shadow-emerald-400/20 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </header>

      {/* Sidebar drawer */}
      <PublicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
