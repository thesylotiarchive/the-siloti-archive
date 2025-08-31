import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// PATCH /api/admin/media/:id
export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !["ADMIN", "SUPERADMIN", "CONTRIBUTOR"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { title, description, image, mediaUrl, mediaType, language, folderId, status } = body;

    if (user.role === "CONTRIBUTOR") {
      status = "DRAFT"; // force draft
    }

    const isExternal = mediaUrl?.startsWith("http") && !mediaUrl.includes("utfs.io");

    const updated = await prisma.mediaItem.update({
      where: { id: params.id },
      data: {
        title,
        description,
        image,
        mediaType,
        language,
        folderId,
        status,
        fileUrl: isExternal ? null : mediaUrl,
        externalLink: isExternal ? mediaUrl : null,
        approvedById: status === "PUBLISHED" ? user.id : null,
        approvedAt: status === "PUBLISHED" ? new Date() : null,
        rejectionReason: status === "PUBLISHED" ? null : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /media/:id error", err);
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 });
  }
}

// GET /api/admin/media/:id
export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        folder: true,
        contributor: {
          select: { id: true, username: true },
        },
      },
    });

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    return NextResponse.json(mediaItem);
  } catch (err) {
    console.error("GET /media/:id error", err);
    return NextResponse.json({ error: "Failed to fetch media item" }, { status: 500 });
  }
}


// DELETE /api/admin/media/:id
export async function DELETE(req, { params }) {
    try {
      const user = await getUserFromRequest(req);
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await prisma.mediaItem.delete({
        where: { id: params.id },
      });
  
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("DELETE /media/:id error", err);
      return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
    }
  }