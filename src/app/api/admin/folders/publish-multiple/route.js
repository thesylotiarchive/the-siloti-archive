// app/api/admin/folders/publish-multiple/route.js
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
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    // updateMany will set approvedById and approvedAt across all matched rows
    const result = await prisma.folder.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    return NextResponse.json({ count: result.count });
  } catch (err) {
    console.error("PATCH /api/admin/folders/publish-multiple error:", err);
    return NextResponse.json({ error: "Failed to publish folders" }, { status: 500 });
  }
}