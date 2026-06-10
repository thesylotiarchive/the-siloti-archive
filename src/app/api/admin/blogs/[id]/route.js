import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";
import { invalidatePattern } from "@/lib/cache";

// GET /api/admin/blogs/:id
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET /api/admin/blogs/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// PUT /api/admin/blogs/:id
export async function PUT(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && user.role !== "CONTRIBUTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { title, slug, content, bannerUrl, status, rejectionReason } = body;

  try {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        bannerUrl,
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
        approvedById:
          status === "PUBLISHED" || status === "REJECTED" ? user.id : null,
        approvedAt:
          status === "PUBLISHED" || status === "REJECTED" ? new Date() : null,
      },
      include: {
        approvedBy: true,
      },
    });

    // Invalidate caches
    await invalidatePattern("blog:detail:*");
    await invalidatePattern("blogs:list:*");

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("PUT /api/admin/blogs/:id error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE /api/admin/blogs/:id
export async function DELETE(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const { comment } = body;

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // If it's a contributor's submission, soft-delete it by setting status to REJECTED
    // so it remains in their Submission History.
    if (blog.createdById) {
      const rejectionReason = comment || "Deleted by administrator.";
      await prisma.blog.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason,
          approvedById: null,
          approvedAt: null,
        },
      });

      // Trigger notification
      await prisma.notification.create({
        data: {
          userId: blog.createdById,
          title: "Submission Deleted / Rejected",
          message: `Your submitted blog article "${blog.title}" was declined/deleted. Comment: ${rejectionReason}`,
          link: "/submit",
        },
      });
    } else {
      // Hard delete if no creator
      await prisma.blog.delete({
        where: { id },
      });
    }

    // Invalidate caches
    await invalidatePattern("blog:detail:*");
    await invalidatePattern("blogs:list:*");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blogs/:id error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
