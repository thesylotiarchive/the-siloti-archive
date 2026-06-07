// components/public/CollectionNavBar.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { X, Menu, Search, Bookmark, Grid3X3, LogOut, LayoutDashboard, ChevronDown, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { label: 'About Org', href: '/about' },
  { label: 'What we Do', href: '/what-we-do' },
  { label: 'Archive', href: '/collection' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
  { label: 'People', href: '/people' },
  { label: 'Reports', href: '/reports' },
  { label: 'Donate', href: '/donate' },
];

export default function CollectionNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 w-full z-50 px-6 py-3 transition-all duration-300 flex items-center justify-between text-white',
          'bg-slate-950/65 backdrop-blur-lg border-b border-white/10 shadow-lg'
        )}
      >
        {/* Logo + Title */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="Sylheti Archive Logo"
            width={48}
            height={48}
            className="rounded-lg w-10 h-10 sm:w-12 sm:h-12 border border-white/10"
          />
          <div className="flex flex-col leading-tight max-w-[180px] sm:max-w-none">
            <span className="font-extrabold text-[14px] sm:text-[18px] tracking-wide text-white">
              Sylheti Archive
            </span>
            <span className="font-light text-[9px] sm:text-[11px] text-white/60">
              An Initiative of
            </span>
            <span className="font-semibold text-[8px] sm:text-[11px] leading-snug bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              Siloti Archive Research & Cultural Centre
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex list-none gap-2 m-0 p-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "transition-all duration-300 px-4 py-1.5 rounded-full text-[14px] font-bold tracking-wide block cursor-pointer",
                      isActive
                        ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20 font-extrabold"
                        : "text-white/85 hover:bg-white/15 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4 text-white">
          <Link href="/search" className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer" title="Search">
            <Search className="w-5 h-5 opacity-90 hover:opacity-100" />
          </Link>
          <Link href="/collection" className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer" title="Archive Collections">
            <Bookmark className="w-5 h-5 opacity-90 hover:opacity-100" />
          </Link>

          {/* User Session Handler */}
          {!loading && (
            user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-2 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <Avatar className="w-8 h-8 border border-white/20">
                  <AvatarImage src={user.avatarUrl} alt={user.name || user.username} />
                  <AvatarFallback className="bg-slate-800 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm text-white/90 font-semibold max-w-[100px] truncate">{user.name || user.username}</span>
                <ChevronDown className="w-4 h-4 text-white/50 hidden md:block" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 text-white rounded-xl p-1 shadow-2xl backdrop-blur-md z-50">
                  {(user.role === 'ADMIN' || user.role === 'SUPERADMIN' || user.role === 'CONTRIBUTOR') && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                   <Link
                    href="/submit"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>Submit Item</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-white/10 rounded-lg font-medium cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-1.5 hover:bg-white/10 rounded-lg text-red-400 font-medium cursor-pointer transition-colors"
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

          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex flex-col justify-center items-center gap-1 w-9 h-9 hover:bg-white/10 rounded-full focus:outline-none cursor-pointer transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg text-white flex flex-col items-center justify-center space-y-8 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition duration-300 cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Nav Links */}
          <nav className="flex flex-col items-center space-y-6 text-2xl font-bold">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "transition-all duration-300 hover:scale-105 tracking-wide cursor-pointer",
                  pathname === item.href ? "text-emerald-400" : "hover:text-white/85"
                )}
                style={{
                  animation: `fadeInUp 0.3s ease ${(index + 1) * 0.08}s forwards`,
                  opacity: 0,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
