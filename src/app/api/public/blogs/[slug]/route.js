// File: src/app/api/public/blogs/[slug]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const blog = await prisma.blog.findFirst({
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

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or not published" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
