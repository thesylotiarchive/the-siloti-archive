import { MediaDetailRenderer } from "@/components/public/MediaDetailRenderer";
import MediaViewPing from "@/components/public/MediaViewPing";
import ShareButtonSection from "@/components/public/ShareButtonSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Tag } from "lucide-react";

const SITE_URL = (process.env.VERCEL_URL && process.env.VERCEL_ENV !== 'production')
  ? `https://${process.env.VERCEL_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL || 'https://the-siloti-archive.org');

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${SITE_URL}/api/public/media/${id}`);
    if (!res.ok) return {};
    const media = await res.json();
    if (!media || media.error) return {};

    const title = `${media.title} | Sylheti Archive`;
    const description = media.description || "Digital repository preserving the rich cultural, historical, and linguistic heritage of the Sylheti language.";
    
    let imageSrc = "/collection_card_bg.png";
    if (media.mediaType === "IMAGE") {
      imageSrc = media.image || media.fileUrl || imageSrc;
    } else if (media.image) {
      imageSrc = media.image;
    }
    
    let imageUrl = imageSrc;
    if (imageSrc.startsWith("/")) {
      imageUrl = `${SITE_URL}${imageSrc}`;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/media/${id}`,
        siteName: "The Sylheti Archive",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: media.title,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("Error generating metadata", err);
    return {};
  }
}

export default async function MediaDetailPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${SITE_URL}/api/public/media/${id}`);
  const media = await res.json();

  if (!media || media.error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-md w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-10 text-center backdrop-blur-md shadow-2xl transition-colors duration-300">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-3">Media Not Found</h2>
          <p className="text-slate-650 dark:text-white/60 font-light mb-8">The media you're looking for doesn't exist or has been removed.</p>
          <Link href="/collection" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-400 text-slate-950 font-bold rounded-full hover:bg-emerald-300 transition-all cursor-pointer shadow-lg shadow-emerald-400/10 text-sm">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  let thumbnailSrc = null;
  if (media.mediaType === "IMAGE") {
    thumbnailSrc = media.image || media.fileUrl || null;
  } else {
    thumbnailSrc = media.image;
  }

  const mediaTypeConfig = {
    IMAGE: { icon: "🖼️", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-950/40 border-purple-500/20" },
    VIDEO: { icon: "🎥", color: "from-red-500 to-orange-500", bgColor: "bg-red-950/40 border-red-500/20" },
    AUDIO: { icon: "🎧", color: "from-green-500 to-teal-500", bgColor: "bg-green-950/40 border-green-500/20" },
    PDF: { icon: "📄", color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-950/40 border-blue-500/20" },
    DOC: { icon: "📝", color: "from-yellow-500 to-orange-500", bgColor: "bg-amber-950/40 border-amber-500/20" },
    LINK: { icon: "🔗", color: "from-cyan-500 to-blue-500", bgColor: "bg-cyan-950/40 border-cyan-500/20" },
    OTHER: { icon: "📁", color: "from-gray-500 to-slate-500", bgColor: "bg-slate-950/40 border-slate-500/20" },
  };

  const config = mediaTypeConfig[media.mediaType] || mediaTypeConfig.OTHER;

  return (
    <div className="w-full max-w-4xl mx-auto pt-28 pb-20 px-4 sm:px-6 md:px-8 relative z-10 selection:bg-emerald-400 selection:text-slate-950">
      {/* Count a view on mount */}
      <MediaViewPing mediaId={media.id} />

      {/* Navigation */}
      <div className="mb-8">
        <Link
          href={`/collection/${media.folderId || ""}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white/60 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden mb-8 transition-colors duration-300">
        <div className={`h-2 bg-gradient-to-r ${config.color}`} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl ${config.bgColor} border flex items-center justify-center text-2xl shadow-lg shrink-0`}>
              {config.icon}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.color}`}>
                  <Tag className="w-3 h-3" />
                  {media.mediaType.toLowerCase()}
                </span>
                {media.author && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-750 bg-slate-150 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    👤 Creator: {media.author}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-white/55 bg-slate-150 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <Eye className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  {media.views || 0} views
                </span>
                <ShareButtonSection mediaTitle={media.title} mediaId={media.id} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-800 dark:text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent font-serif italic font-bold">
                  {media.title}
                </span>
              </h1>

              {media.description && (
                <p className="text-slate-650 dark:text-white/75 text-sm sm:text-base leading-relaxed font-light">
                  {media.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview for non-image media */}
      {thumbnailSrc && (
        <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 mb-8 shadow-2xl bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md transition-colors duration-300">
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 brightness-50"
            style={{
              backgroundImage: `url(${thumbnailSrc})`,
              zIndex: 0,
            }}
          />
          <div className="relative z-10 flex items-center justify-center h-full p-4">
            <Image
              src={thumbnailSrc}
              alt={media.title}
              fill
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <MediaDetailRenderer media={media} config={config} />
    </div>
  );
}
