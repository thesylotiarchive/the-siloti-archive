// components/public/TransparentNavbar.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

const navItems = [
  { label: 'About Org', href: '/about' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
  { label: 'People', href: '/people' },
];

export default function TransparentNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300',
          scrolled
            ? 'bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <Link
            href="/"
            className={clsx(
              'flex items-center gap-2',
              scrolled ? 'text-gray-900' : 'text-white'
            )}
          >
            <Image
              src="/logo.png"
              alt="Syloti Archive Logo"
              width={50}
              height={50}
              className="rounded-sm w-9 h-9 sm:w-[70px] sm:h-[70px]"
            />
            <div className="flex flex-col items-start sm:items-center leading-tight">
              <span className="font-bold text-[13px] sm:text-lg">Syloti Archive</span>
              <span className="font-medium text-[10px] sm:text-sm">An Initiative of</span>
              <span className="font-semibold text-[9px] sm:text-sm max-w-[190px] sm:max-w-none leading-snug bg-clip-text text-transparent bg-gradient-to-r from-[#a6e355] via-[#3d9fdc] to-[#edb991]">
                Siloti Archive Research & Cultural Centre
              </span>
            </div>
          </Link>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className="group flex flex-col justify-center items-center space-y-[3px] w-8 h-8 sm:w-10 sm:h-10 focus:outline-none cursor-pointer"
          >
            <span
              className={clsx(
                'w-8 h-[4px] sm:w-10 sm:h-[6px] rounded transition-all duration-300 transform group-hover:-translate-x-1',
                scrolled ? 'bg-black' : 'bg-white'
              )}
            ></span>
            <span
              className={clsx(
                'w-8 h-[4px] sm:w-10 sm:h-[6px] rounded transition-all duration-300 transform group-hover:translate-x-1',
                scrolled ? 'bg-black' : 'bg-white'
              )}
            ></span>
          </button>

        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center space-y-8 transition-opacity animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-5xl font-bold hover:text-[#74C043] transition duration-300"
          >
            &times;
          </button>

          {/* Nav Links */}
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
