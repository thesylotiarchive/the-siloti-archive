import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/blogs?page=1&limit=6
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");

  try {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { published: true },
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
          author: true, // now just a string
        },
      }),
      prisma.blog.count({ where: { published: true } }),
    ]);

    return NextResponse.json({ blogs, total });
  } catch (err) {
    console.error("Public blog fetch error:", err);
    return NextResponse.json({ error: "Failed to load blogs." }, { status: 500 });
  }
}
