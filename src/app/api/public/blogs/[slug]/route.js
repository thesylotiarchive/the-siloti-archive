// File: src/app/api/public/blogs/[slug]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCachedData } from "@/lib/cache";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const blog = await getCachedData(`blog:detail:${slug}`, async () => {
      return await prisma.blog.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          content: true,
          bannerUrl: true,
          publishedAt: true,
          slug: true,
          author: true,
        },
      });
    }, 3600); // 1 hour TTL

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or not published" }, { status: 404 });
    }

    const telemetry = blog?._cacheTelemetry;
    return NextResponse.json(blog, {
      headers: {
        "x-cache-log": telemetry ? encodeURIComponent(telemetry) : ""
      }
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params; // Next.js parameter is 'slug'
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug }
        ]
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Verify ownership
    if (blog.createdById !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this blog post" }, { status: 403 });
    }

    // Check status is not PUBLISHED
    if (blog.status === "PUBLISHED") {
      return NextResponse.json({ error: "Cannot delete approved and published blogs" }, { status: 400 });
    }

    await prisma.blog.delete({
      where: { id: blog.id },
    });

    return NextResponse.json({ success: true, message: "Blog submission deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/public/blogs/:slug", err);
    return NextResponse.json({ error: "Failed to delete blog submission" }, { status: 500 });
  }
}

