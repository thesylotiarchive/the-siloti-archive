import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const youtubeId = getYoutubeVideoId(url);
    let title = "";
    let description = "";
    let image = "";
    let mediaType = "LINK";

    if (youtubeId) {
      mediaType = "VIDEO";
      image = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 3600 } // cache for 1 hour
    });

    if (response.ok) {
      const html = await response.text();
      
      // Extract title
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      // Extract description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
                         html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim();
      }

      // Extract OG image if not already set (e.g. for non-YouTube links)
      if (!image) {
        const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) ||
                            html.match(/<meta[^>]*content=["']([^"']*)["']/i).find(m => m.includes("og:image")); // simple fallback
        if (imageMatch && imageMatch[1]) {
          image = imageMatch[1].trim();
        }
      }

      // Extract OG title if page title is empty or generic
      if (!title || title.toLowerCase().includes("youtube")) {
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          title = ogTitleMatch[1].trim();
        }
      }
    }

    // Decode HTML entities
    title = decodeHtmlEntities(title);
    description = decodeHtmlEntities(description);

    return NextResponse.json({
      title,
      description,
      image,
      mediaType,
    });

  } catch (err) {
    console.error("Metadata scraper error:", err);
    return NextResponse.json({ error: "Failed to scrape metadata" }, { status: 500 });
  }
}

function getYoutubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}
