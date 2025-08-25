import { MediaDetailRenderer } from "@/components/public/MediaDetailRenderer";
import MediaViewPing from "@/components/public/MediaViewPing";
import Image from "next/image";
import Link from "next/link";

export default async function MediaDetailPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/public/media/${params.id}`);
  const media = await res.json();

  if (!media || media.error) {
    return <div className="max-w-3xl mx-auto p-10 text-muted-foreground">Media not found.</div>;
  }

  let thumbnailSrc = null;
  if (media.mediaType === "IMAGE") {
    thumbnailSrc = media.image || media.fileUrl || null;
  }else {
    thumbnailSrc = media.image
  }



  return (
    <main className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 mx-auto">
      {/* Count a view on mount */}
      <MediaViewPing mediaId={media.id} />

      <div className="mb-6">
        <Link
          href={`/collection/${media.folderId || ""}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Collection
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{media.title}</h1>

      {thumbnailSrc && (
        <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden rounded-xl mb-6">
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 brightness-75"
            style={{
              backgroundImage: `url(${thumbnailSrc})`,
              zIndex: 0,
            }}
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <Image
              src={thumbnailSrc}
              alt={media.title}
              fill
              className="max-h-full max-w-full object-contain rounded-md shadow-xl"
            />
          </div>
        </div>
      )}

      {media.description && (
        <p className="text-base sm:text-lg text-muted-foreground mb-6 whitespace-pre-line">
          {media.description}
        </p>
      )}

      <MediaDetailRenderer media={media} />
    </main>
  );
}
