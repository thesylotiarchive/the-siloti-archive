import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No blog IDs provided" }, { status: 400 });
    }

    const updatedBlogs = await prisma.blog.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
        rejectionReason: null,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, count: updatedBlogs.count });
  } catch (err) {
    console.error("PATCH /admin/blogs/publish-multiple error", err);
    return NextResponse.json({ error: "Failed to bulk publish blogs" }, { status: 500 });
  }
}
