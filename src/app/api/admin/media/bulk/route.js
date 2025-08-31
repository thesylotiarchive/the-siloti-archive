import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { folderId, items } = body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const data = items.map((it) => {
      const {
        title = "Untitled",
        description = "",
        image = "",
        mediaUrl = "",
        mediaType = "AUDIO",
        language = null,
        status, // optional from client
      } = it || {};

      let isExternal = true;
      try {
        const url = new URL(mediaUrl);
        isExternal = !["utfs.io", "localhost"].includes(url.hostname);
      } catch {
        isExternal = true;
      }

      // enforce status
      let finalStatus = "DRAFT";
      if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        finalStatus = status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
      } else if (user.role === "CONTRIBUTOR") {
        finalStatus = "DRAFT";
      }

      return {
        title,
        description,
        image: image || null,
        mediaType,
        language,
        folderId: folderId || undefined,
        contributorId: user.id,
        status: finalStatus,
        fileUrl: isExternal ? null : mediaUrl,
        externalLink: isExternal ? mediaUrl : null,
      };
    });

    // createMany is fast but doesn't return the created rows
    const result = await prisma.mediaItem.createMany({
      data,
      skipDuplicates: false,
    });

    return NextResponse.json({ count: result.count });
  } catch (err) {
    console.error("POST /api/admin/media/bulk error", err);
    return NextResponse.json({ error: "Failed to create media items (bulk)" }, { status: 500 });
  }
}
