import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const skip = (Math.max(page, 1) - 1) * limit;

    // Only fetch media with status DRAFT
    const [media, total] = await Promise.all([
        prisma.mediaItem.findMany({
          where: { status: "DRAFT" },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.mediaItem.count({ where: { status: "DRAFT" } }),
    ]);

    return NextResponse.json({ media, total, page, limit });
  } catch (err) {
    console.error("GET /api/admin/drafts/media error:", err);
    return NextResponse.json({ error: "Failed to fetch draft media" }, { status: 500 });
  }
}