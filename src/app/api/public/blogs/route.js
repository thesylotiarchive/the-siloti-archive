import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData } from "@/lib/cache";
import { getUserFromRequest } from "@/lib/auth-helpers";

// GET /api/public/blogs?page=1&limit=6
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");

  try {
    const cacheKey = `blogs:list:page:${page}:limit:${limit}`;
    const result = await getCachedData(cacheKey, async () => {
      const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            bannerUrl: true,
            publishedAt: true,
            content: true,
            author: true,
          },
        }),
        prisma.blog.count({ where: { status: "PUBLISHED" } }),
      ]);
      return { blogs, total };
    }, 3600); // 1 hour TTL

    return NextResponse.json(result);
  } catch (err) {
    console.error("Public blog fetch error:", err);
    return NextResponse.json({ error: "Failed to load blogs." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, author, bannerUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Add random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    slug = `${slug}-${randomSuffix}`;

    const created = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        author: author || user.name || user.username || "Unknown",
        bannerUrl: bannerUrl || null,
        status: "DRAFT", // Always force user submissions to DRAFT status for curator review
        createdById: user.id,
      },
    });

    return NextResponse.json({ success: true, blog: created });
  } catch (err) {
    console.error("POST /api/public/blogs error", err);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
