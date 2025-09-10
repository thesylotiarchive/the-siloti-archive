'use client';

import Image from "next/image";

export default function SponsorStrip() {
  const demoSponsors = Array.from({ length: 8 }, (_, i) => ({
    name: `Partner ${i + 1}`,
    logo: `/partners/partner0${i + 1}.jpeg`,
    url: "#",
  }));

  // Duplicate for infinite loop effect
  const sponsors = [...demoSponsors, ...demoSponsors];

  return (
    <div className="bg-white border-t border-gray-200 pt-10 pb-6 overflow-hidden">
      <div className="w-full mx-auto px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-widest">
          Our Partners
        </h3>

        <div className="relative w-full overflow-hidden">
          <div className="flex gap-28 animate-scroll-horizontal whitespace-nowrap">
            {sponsors.map((sponsor, index) => (
              <a
                key={`${sponsor.name}-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 opacity-80 hover:opacity-100 transition"
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
