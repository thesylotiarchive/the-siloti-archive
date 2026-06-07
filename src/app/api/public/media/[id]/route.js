import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const media = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!media || media.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (err) {
    console.error("GET /api/public/media/:id", err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const media = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Verify ownership
    if (media.contributorId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this item" }, { status: 403 });
    }

    // Check status is not PUBLISHED
    if (media.status === "PUBLISHED") {
      return NextResponse.json({ error: "Cannot delete approved and published items" }, { status: 400 });
    }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Submission deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/public/media/:id", err);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}

