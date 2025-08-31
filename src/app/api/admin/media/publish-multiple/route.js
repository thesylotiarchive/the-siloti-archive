import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No media IDs provided" }, { status: 400 });
    }

    const updatedMedia = await prisma.mediaItem.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    return NextResponse.json({ success: true, updatedCount: updatedMedia.count });
  } catch (err) {
    console.error("PATCH /admin/media/publish-multiple error", err);
    return NextResponse.json({ error: "Failed to bulk publish media" }, { status: 500 });
  }
}