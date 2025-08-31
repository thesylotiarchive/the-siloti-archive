import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.mediaItem.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /admin/media/[id]/publish error", err);
    return NextResponse.json({ error: "Failed to publish media item" }, { status: 500 });
  }
}
