import { MediaDetailRenderer } from "@/components/public/MediaDetailRenderer";
import MediaViewPing from "@/components/public/MediaViewPing";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Calendar, Tag } from "lucide-react";

export default async function MediaDetailPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/public/media/${id}`);
  const media = await res.json();

  if (!media || media.error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-md w-full bg-white/[0.02] border border-white/10 rounded-[2rem] p-10 text-center backdrop-blur-md shadow-2xl">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Media Not Found</h2>
          <p className="text-white/60 font-light mb-8">The media you're looking for doesn't exist or has been removed.</p>
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
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden mb-8">
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white/75 bg-white/5 border border-white/5">
                    👤 Creator: {media.author}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white/55 bg-white/5 border border-white/5">
                  <Eye className="w-3 h-3 text-emerald-400" />
                  {media.views || 0} views
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent font-serif italic font-bold">
                  {media.title}
                </span>
              </h1>

              {media.description && (
                <p className="text-white/75 text-sm sm:text-base leading-relaxed font-light">
                  {media.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview for non-image media */}
      {thumbnailSrc && (
        <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden rounded-[2rem] border border-white/10 mb-8 shadow-2xl bg-slate-900/40 backdrop-blur-md">
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
