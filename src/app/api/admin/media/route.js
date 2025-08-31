import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// POST /api/admin/media
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !["ADMIN", "SUPERADMIN", "CONTRIBUTOR"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { title, description, image, mediaUrl, mediaType, language, folderId, status } = body;

    // force contributors to draft
    if (user.role === "CONTRIBUTOR") {
      status = "DRAFT";
    } else {
      status = status || "PUBLISHED";
    }

    const isExternal = mediaUrl?.startsWith("http") && !mediaUrl.includes("utfs.io");

    const created = await prisma.mediaItem.create({
      data: {
        title,
        description,
        image,
        mediaType,
        language,
        folderId: folderId || undefined,
        contributorId: user.id,
        status,
        fileUrl: isExternal ? null : mediaUrl,
        externalLink: isExternal ? mediaUrl : null,
        approvedById: status === "PUBLISHED" ? user.id : null,
        approvedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("POST /media error", err);
    return NextResponse.json({ error: "Failed to create media item" }, { status: 500 });
  }
}
