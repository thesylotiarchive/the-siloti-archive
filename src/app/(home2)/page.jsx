'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionCard } from "@/components/public/CollectionCard";
import { 
  Heart, 
  PlayCircle, 
  ArrowRight, 
  BookOpen, 
  Music, 
  Sparkles, 
  Archive,
  ChevronDown
} from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home2Page() {
  const router = useRouter();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/public/collections?parentId=null");
        const data = await res.json();
        setCollections(data?.slice(0, 8) || []); // Limit to top 8 featured collections for a balanced grid
      } catch (err) {
        console.error("Failed to fetch collections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Cinematic Radial and Linear Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,16,21,0.1),rgba(12,16,21,0.85))] z-10"></div>

        {/* Content Container */}
        <div className="relative z-20 max-w-5xl mx-auto text-center px-6 flex flex-col items-center">
          
          {/* Micro-badge */}
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Preserving Cultural Heritage
            </span>
          </div>

          {/* Premium Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight leading-none mb-6">
            <span className="block text-white/95 font-light">The</span>
            <span className="block mt-1 font-serif italic font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
              Sylheti Archive
            </span>
          </h1>

          {/* Elegant Subtitle */}
          <p className="max-w-2xl text-base sm:text-xl text-white/70 font-light leading-relaxed mb-10 drop-shadow-md">
            A Digital Collection of Siloti Arts, Culture, Heritage & Initiatives. 
            Bridging past traditions with digital preservation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center z-30">
            {/* Explore Button */}
            <button
              onClick={() => router.push('/collection')}
              className="cursor-pointer group relative inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 text-base rounded-full transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95 bg-white text-slate-950 hover:bg-emerald-400 shadow-xl"
            >
              <PlayCircle className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
              <span>Explore the Archive</span>
            </button>

            {/* Donate Button */}
            <button
              onClick={() => router.push('/donate')}
              className="cursor-pointer group relative inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 text-base rounded-full transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 backdrop-blur-md"
            >
              <Heart className="w-4.5 h-4.5 transition-all text-rose-400 group-hover:scale-110" />
              <span>Support Our Work</span>
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div 
            className="mt-16 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer z-30" 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll to Begin</span>
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </div>

        </div>
      </section>

      {/* 2. THE HERITAGE EXHIBIT SECTION (Luxury grid) */}
      <section className="relative py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Heritage Highlights</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Preserving the Soul of <span className="font-serif italic font-semibold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Siloti Culture</span>
          </h2>
          <div className="w-12 h-0.5 bg-emerald-400 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-emerald-400/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                Manuscripts & Siloti Nagri
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                Explore a rich digital library of rare manuscripts, ancient prints, and texts written 
                in the native Siloti Nagri script, preserving centuries of literary history.
              </p>
            </div>
            <Link href="/collection" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mt-8 group-hover:text-emerald-200">
              <span>View Manuscripts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-amber-400/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                Folk Music & Dhamail
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                Discover audio-visual recordings of traditional songs, marriage folklore, 
                and spiritual verses (Sufi, Baul) unique to the Sylhet region.
              </p>
            </div>
            <Link href="/collection" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mt-8 group-hover:text-emerald-200">
              <span>Listen to Recordings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-amber-400/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Archive className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                Material Culture & Artifacts
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                Examine everyday physical artifacts, photographic evidence, and historical documents 
                narrating the social life, customs, and migrations of Siloti people.
              </p>
            </div>
            <Link href="/collection" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider mt-8 group-hover:text-blue-200">
              <span>Browse Material Archive</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. ARCHIVE METRICS (Premium Stats Strip) */}
      <section className="border-y border-white/5 bg-white/[0.01] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-4xl sm:text-5xl font-serif font-semibold mb-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              8,000+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
              Rare Manuscripts
            </span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-serif font-semibold mb-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              1,200+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
              Audio Recordings
            </span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-serif font-semibold mb-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              50+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
              Global Partners
            </span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-serif font-semibold mb-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              100%
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
              Free Open Access
            </span>
          </div>
        </div>
      </section>

      {/* 4. FEATURED EXHIBITS (The Collections Grid) */}
      <section className="relative py-28 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Exhibitions</span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              Featured <span className="font-serif italic font-semibold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Collections</span>
            </h2>
          </div>
          <Link href="/collection" className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mt-4 sm:mt-0 transition-colors">
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow animate-pulse"
              >
                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-white/5" />
          
                {/* Text Placeholder */}
                <div className="p-4 pb-3 space-y-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
          
                {/* Bottom Strip Placeholder */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-t border-white/5">
                  <div className="w-4 h-4 bg-white/10 rounded-full" />
                  <div className="h-3 w-12 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center text-white/55 py-12">No featured collections yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </section>

      {/* 5. INVITATION TO CONTRIBUTE */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.04),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto text-center border border-white/10 rounded-[3rem] p-12 sm:p-20 bg-white/[0.01] backdrop-blur-md relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">Join the Mission</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6 leading-tight">
            Help Us Preserve <span className="font-serif italic font-semibold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Siloti Heritage</span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Do you own historical manuscripts, oral recordings, or vintage artifacts? Or would you 
            like to contribute to transcriptions and research? Get in touch to support the project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
               href="/submit"
               className="w-full sm:w-auto text-center bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-8 py-3.5 rounded-full transition-colors duration-200"
            >
              Submit an Item
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto text-center bg-white/5 hover:bg-white/10 text-white border border-white/15 px-8 py-3.5 rounded-full transition-colors duration-200"
            >
              Contact Curators
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
