'use client';

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Mail, MapPin, Phone, ArrowUpRight, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden border-t border-white/10">
      {/* Decorative top gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300"></div>

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Section 1: Logo and description */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative p-1 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 group-hover:border-emerald-400/50 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Sylheti Archive Logo"
                  width={56}
                  height={56}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-emerald-400 transition-colors duration-300">
                  Sylheti Archive
                </span>
                <span className="text-[10px] text-white/55 font-light">An Initiative of</span>
                <span className="text-[11px] font-semibold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                  Siloti Archive Research & Cultural Centre
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-white/60 leading-relaxed max-w-md font-light">
              We are dedicated to preserving and showcasing the unique history, literature, 
              folklore, arts, and cultural elements of the Siloti language and community 
              for generations to come.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <FaFacebookF />, url: "https://www.facebook.com/profile.php?id=100080464096715", label: "Facebook" },
                { icon: <FaInstagram />, url: "https://www.instagram.com/sarcc_documentation", label: "Instagram" },
                { icon: <FaYoutube />, url: "https://www.youtube.com/@silotiarchivercc", label: "YouTube" }
              ].map((soc, i) => (
                <a
                  key={i}
                  href={soc.url}
                  aria-label={soc.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-emerald-400/15 hover:border-emerald-400 transition-all duration-300"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400/90">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Org", href: "/about" },
                { label: "Archive Collections", href: "/collection" },
                { label: "Blogs & Articles", href: "/blogs" },
                { label: "Meet the People", href: "/people" },
                { label: "Contact Us", href: "/contact" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:translate-y-0 transition-all duration-200 text-emerald-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400/90">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm text-white/70 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kalain, Cachar, Assam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:silotiarchivercc@gmail.com" className="hover:text-white transition-colors">
                  silotiarchivercc@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919957116126" className="hover:text-white transition-colors">
                  +91 9957116126
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-300 shrink-0" />
                <a href="https://sylhetiarchivercc.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  sylhetiarchivercc.org
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} Sylheti Archive. Preserving heritage and language. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
