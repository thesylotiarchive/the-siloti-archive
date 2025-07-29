import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// GET /api/admin/blogs?page=1&limit=6
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const skip = (page - 1) * limit;

  try {
    const blogs = await prisma.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.blog.count();

    return NextResponse.json({ blogs, total });
  } catch (error) {
    console.error("GET /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST /api/admin/blogs
export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, bannerUrl, published, author } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBlog = await prisma.blog.create({
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

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
