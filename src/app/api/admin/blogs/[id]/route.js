import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

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
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { title, slug, content, bannerUrl, published, author } = body;

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
        published,
        publishedAt: published ? new Date() : null,
        author,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("PUT /api/admin/blogs/:id error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE /api/admin/blogs/:id
export async function DELETE(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blogs/:id error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
