import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }

    const updated = await prisma.mediaItem.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        approvedById: null,
        approvedAt: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/admin/media/[id]/reject error", err);
    return NextResponse.json({ error: "Failed to reject media item" }, { status: 500 });
  }
}
