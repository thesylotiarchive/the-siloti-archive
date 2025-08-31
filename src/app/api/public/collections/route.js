// app/api/public/collections/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const parentIdParam = searchParams.get("parentId");
  const parentId = parentIdParam === "null" ? null : parentIdParam;

  try {
    const folders = await prisma.folder.findMany({
      where: {
        parentId,
        status: "PUBLISHED", // only published folders
      },
      include: {
        mediaItems: {
          where: { status: "PUBLISHED" }, // only published media items
        },
        children: {
          where: { status: "PUBLISHED" }, // only published subfolders
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const mapped = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      imageUrl: folder.image,
      itemCount:
        (folder.children?.length || 0) + (folder.mediaItems?.length || 0),
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("❌ GET /api/public/collections error:", err);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}