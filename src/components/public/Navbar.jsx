'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="border-b bg-background shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Syloti Archive Logo"
            width={70}
            height={70}
            className="rounded-sm"
          />
          <div className="flex flex-col items-center">
              <span className="font-bold text-lg">Syloti Archive</span>
              <span className="font-bold text-sm">An Initiative of</span>
              <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#a6e355] via-[#3d9fdc] to-[#edb991]">
                Siloti Archive Research & Cultural Centre
              </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition">Home</Link>
          <Link href="/about" className="hover:text-foreground transition">About</Link>
          <Link href="/blogs" className="hover:text-foreground transition">Blogs</Link>
          <Link href="/contact" className="hover:text-foreground transition">Contact</Link>
          <Link href="/people" className="hover:text-foreground transition">People</Link>
        </nav>
      </div>
    </header>
  );
}
