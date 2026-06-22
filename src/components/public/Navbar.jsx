'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import PublicSidebar from './PublicSidebar';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-white/70 dark:bg-background/65 backdrop-blur-lg border-slate-200 dark:border-white/10 px-6 py-3 shadow-lg text-slate-800 dark:text-white transition-colors duration-300">
        <div className="w-full flex items-center justify-between">
          {/* Left Toggle + Logo Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none"
              title="Open Menu"
            >
              <Menu className="w-6 h-6 text-slate-800 dark:text-white" />
            </button>

            <Link href="/" className="flex items-center gap-3 text-slate-850 dark:text-white transition-opacity hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Sylheti Archive Logo"
                width={48}
                height={48}
                className="rounded-lg border border-slate-200 dark:border-white/10"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-[14px] sm:text-[18px] tracking-wide text-slate-900 dark:text-white">
                  Sylheti Archive
                </span>
                <span className="font-light text-[9px] sm:text-[11px] text-slate-500 dark:text-white/60">
                  An Initiative of
                </span>
                <span className="font-semibold text-[8px] sm:text-[11px] leading-snug bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                  Siloti Archive Research & Cultural Centre
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar drawer */}
      <PublicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

