'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function SponsorStrip({ dark = false }) {
  const { theme } = useTheme();
  const isDark = theme ? theme === 'dark' : dark;

  const links = [
    "https://gbillp.com/",
    "https://masterpeace.org/",
    "https://www.facebook.com/Sylhetikhobornews/",
    "https://cemca.org/"
  ];
  
  const demoSponsors = Array.from({ length: 4 }, (_, i) => ({
    name: `Partner ${i + 1}`,
    logo: `/partners/partner0${i + 1}.png`,
    url: links[i], // pick matching link by index
  }));

  // Duplicate for infinite loop effect
  const sponsors = [...demoSponsors, ...demoSponsors];
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const shouldScroll = sponsors.length > 8 && isLargeScreen; // scroll only if lots of logos on large screens

  return (
    <div className={`border-t pt-16 pb-12 overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-slate-950 border-white/5" : "bg-white border-gray-200"
    }`}>
      <div className="w-full mx-auto px-6 text-center">
        <h3 className={`text-xs font-bold mb-8 uppercase tracking-widest ${
          isDark ? "text-emerald-400" : "text-gray-800"
        }`}>
          Our Partners
        </h3>

        {/* Wrapper */}
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex gap-10 justify-center flex-wrap ${
              shouldScroll ? "animate-scroll-horizontal whitespace-nowrap" : ""
            }`}
          >
            {(shouldScroll ? sponsors : demoSponsors).map((sponsor, index) => (
              <a
                key={`${sponsor.name}-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 transition-all duration-300 p-3 rounded-2xl border ${
                  isDark 
                    ? "bg-white/5 border-white/10 hover:border-emerald-400/35 hover:bg-white/[0.08]" 
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={100}
                  height={100}
                  className="object-contain rounded-xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white p-1"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
