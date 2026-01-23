'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useState } from 'react';
import { X, Menu } from 'lucide-react';

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

export default function GeneralNavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky w-full top-0 z-50 bg-gradient-to-r from-[#1276AB] via-[#1276AB] to-[#7DB9E8] shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className={clsx('flex items-center gap-2 text-white')}
        >
          <Image
            src="/logo.png"
            alt="Sylheti Archive Logo"
            width={50}
            height={50}
            className="rounded-sm w-9 h-9 sm:w-[70px] sm:h-[70px]"
          />
          <div className="flex flex-col leading-tight max-w-[180px] sm:max-w-[200px] md:max-w-none truncate">
            <span className="font-bold text-[13px] sm:text-lg">
              Sylheti Archive
            </span>
            <span className="font-medium text-[10px] sm:text-sm">
              An Initiative of
            </span>
            <span className="font-semibold text-[9px] sm:text-sm leading-snug bg-clip-text text-transparent bg-gradient-to-r from-[#a6e355] via-[#3d9fdc] to-[#edb991]">
              Siloti Archive Research & Cultural Centre
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex">
          <ul className="flex list-none gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-white font-bold transition-colors duration-300 px-4 py-2 rounded-sm
                    hover:bg-white/10 hover:text-[#D4A574]
                    ${pathname === item.href ? 'text-[#D4A574]' : ''}
                  `}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Icon for Mobile/Tablet */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden group flex flex-col justify-center items-center space-y-[3px] w-8 h-8 sm:w-10 sm:h-10 focus:outline-none cursor-pointer"
        >
          <span className="w-8 h-[4px] sm:w-10 sm:h-[6px] rounded bg-white transition-all duration-300 transform group-hover:-translate-x-1"></span>
          <span className="w-8 h-[4px] sm:w-10 sm:h-[6px] rounded bg-white transition-all duration-300 transform group-hover:translate-x-1"></span>
        </button>

      </div>

      {/* Mobile/Tablet Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center space-y-8 transition-opacity animate-fadeIn">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-5xl font-bold hover:text-[#74C043] transition duration-300"
          >
            &times;
          </button>

          <nav className="flex flex-col items-center space-y-6 text-2xl font-semibold">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#74C043] transition-all duration-300 hover:scale-105 tracking-wide"
                style={{
                  animation: `fadeInUp 0.3s ease ${(index + 1) * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

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


    </header>
  );
}
