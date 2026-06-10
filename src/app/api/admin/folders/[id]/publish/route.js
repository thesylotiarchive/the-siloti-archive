import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";
import { invalidateCache, invalidatePattern } from "@/lib/cache";

export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.folder.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    if (updated.createdById) {
      try {
        await prisma.notification.create({
          data: {
            userId: updated.createdById,
            title: "Folder Approved & Published",
            message: `Your folder submission "${updated.name}" has been approved and published.`,
            link: `/collection`,
          },
        });
      } catch (err) {
        console.error("Failed to create notification for folder publish:", err);
      }
    }

    // Invalidate caches
    await invalidateCache(`collection:detail:${params.id}`);
    await invalidatePattern("collections:parent:*");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /admin/folders/[id]/publish error", err);
    return NextResponse.json({ error: "Failed to publish folder" }, { status: 500 });
  }
}
