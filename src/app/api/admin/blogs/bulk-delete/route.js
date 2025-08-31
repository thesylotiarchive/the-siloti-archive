import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No blog IDs provided" }, { status: 400 });
    }

    await prisma.blog.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (err) {
    console.error("POST /admin/blogs/bulk-delete error", err);
    return NextResponse.json({ error: "Failed to bulk delete blogs" }, { status: 500 });
  }
}
