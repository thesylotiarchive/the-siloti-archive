'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SponsorStrip() {
  // const links = [
  //   "https://gbillp.com/",
  //   "https://masterpeace.org/",
  //   "#",
  // ];

  const links = [
    "#",
    "#",
    "#",
  ];
  
  const demoSponsors = Array.from({ length: 3 }, (_, i) => ({
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

  const shouldScroll = sponsors.length > 6 && isLargeScreen; // scroll only if lots of logos on large screens

  return (
    <div className="bg-white border-t border-gray-200 pt-10 pb-6 overflow-hidden">
      <div className="w-full mx-auto px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-widest">
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
                className="shrink-0 transition"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={100}
                  height={100}
                  className="object-contain rounded-xl shadow-md w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
