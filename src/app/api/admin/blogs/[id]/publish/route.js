import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function POST(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update blog status to published
    const publishedBlog = await prisma.blog.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        approvedById: user.id,
        approvedAt: new Date(),
      },
      include: {
        approvedBy: true,
      },
    });

    return NextResponse.json(publishedBlog);
  } catch (error) {
    console.error("POST /api/admin/blogs/[id]/publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish blog" },
      { status: 500 }
    );
  }
}
