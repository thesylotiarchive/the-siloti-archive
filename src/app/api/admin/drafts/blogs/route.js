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

    // Only fetch blogs with status DRAFT
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { status: "DRAFT" },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where: { status: "DRAFT" } }),
    ]);

    return NextResponse.json({ blogs, total, page, limit });
  } catch (err) {
    console.error("GET /api/admin/drafts/blogs error:", err);
    return NextResponse.json({ error: "Failed to fetch draft blogs" }, { status: 500 });
  }
}