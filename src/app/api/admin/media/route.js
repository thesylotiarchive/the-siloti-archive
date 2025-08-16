import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// POST /api/admin/media
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      mediaUrl,
      mediaType,
      language,
      folderId,
    } = body;

    const url = new URL(mediaUrl);
    const isExternal = !["utfs.io", "localhost"].includes(url.hostname); 

    const created = await prisma.mediaItem.create({
      data: {
        title,
        description,
        image,
        mediaType,
        language,
        folderId: folderId || undefined,
        contributorId: user.id,
        // Store mediaUrl in fileUrl or externalLink depending on type
        fileUrl: isExternal ? null : mediaUrl,
        externalLink: isExternal ? mediaUrl : null,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("POST /media error", err);
    return NextResponse.json({ error: "Failed to create media item" }, { status: 500 });
  }
}
