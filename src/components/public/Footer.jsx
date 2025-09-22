'use client';

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center gap-2 text-white">
            <Image
              src="/logo.png"
              alt="Sylheti Archive Logo"
              width={70}
              height={70}
              className="rounded-sm"
            />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">Sylheti Archive</span>
              <span className="text-sm font-bold">An Initiative of</span>
              <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a6e355] via-[#3d9fdc] to-[#edb991]">
                Siloti Archive Research & Cultural Centre
              </span>
            </div>
          </Link>

          <p className="mt-4 text-sm text-gray-400 max-w-md text-center">
           A Digital Collection of Siloti Arts, Culture, Heritage & Initiatives
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <nav className="flex flex-col gap-1 text-sm text-gray-300">
            <Link href="/" className="hover:text-[#74C043] transition">Home</Link>
            <Link href="/about" className="hover:text-[#74C043] transition">About</Link>
            <Link href="/blogs" className="hover:text-[#74C043] transition">Blogs</Link>
            <Link href="/contact" className="hover:text-[#74C043] transition">Contact</Link>
            <Link href="/people" className="hover:text-[#74C043] transition">People</Link>
          </nav>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-white font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4 mt-4 group">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-white text-xl transition-all group-hover:opacity-50 hover:!opacity-100">
              <FaFacebookF />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-white text-xl transition-all group-hover:opacity-50 hover:!opacity-100">
              <FaTwitter />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-white text-xl transition-all group-hover:opacity-50 hover:!opacity-100">
              <FaInstagram />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-white text-xl transition-all group-hover:opacity-50 hover:!opacity-100">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Sylheti Archive. All rights reserved.
      </div>
    </footer>
  );
}
