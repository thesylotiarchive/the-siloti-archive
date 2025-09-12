import { MediaDetailRenderer } from "@/components/public/MediaDetailRenderer";
import MediaViewPing from "@/components/public/MediaViewPing";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Calendar, Tag } from "lucide-react";

export default async function MediaDetailPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/public/media/${params.id}`);
  const media = await res.json();

  if (!media || media.error) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Media Not Found</h2>
          <p className="text-gray-600">The media you're looking for doesn't exist or has been removed.</p>
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
    IMAGE: { icon: "🖼️", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-50" },
    VIDEO: { icon: "🎥", color: "from-red-500 to-orange-500", bgColor: "bg-red-50" },
    AUDIO: { icon: "🎧", color: "from-green-500 to-teal-500", bgColor: "bg-green-50" },
    PDF: { icon: "📄", color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-50" },
    DOC: { icon: "📝", color: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-50" },
    LINK: { icon: "🔗", color: "from-cyan-500 to-blue-500", bgColor: "bg-cyan-50" },
    OTHER: { icon: "📁", color: "from-gray-500 to-slate-500", bgColor: "bg-gray-50" },
  };

  const config = mediaTypeConfig[media.mediaType] || mediaTypeConfig.OTHER;

  return (
    <main className="w-full max-w-6xl px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 mx-auto">
      {/* Count a view on mount */}
      <MediaViewPing mediaId={media.id} />

      {/* Navigation */}
      <div className="mb-8">
        <Link
          href={`/collection/${media.folderId || ""}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className={`h-2 bg-gradient-to-r ${config.color}`} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${config.bgColor} flex items-center justify-center text-2xl shadow-lg`}>
              {config.icon}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.color}`}>
                  <Tag className="w-3 h-3" />
                  {media.mediaType.toLowerCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                  <Eye className="w-3 h-3" />
                  {media.views || 0} views
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {media.title}
              </h1>

              {media.description && (
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {media.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Preview for non-image media */}
      {thumbnailSrc && (
        <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden rounded-3xl mb-8 shadow-2xl">
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
    </main>
  );
}
