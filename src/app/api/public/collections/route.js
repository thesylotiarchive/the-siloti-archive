// app/api/public/collections/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Recursively count all published media items and subfolders under a folder.
 */
async function getItemCount(folderId) {
  // Get immediate children folders + media items
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      mediaItems: { where: { status: "PUBLISHED" } },
      children: { where: { status: "PUBLISHED" } },
    },
  });

  if (!folder) return 0;

  // Start with direct media items count
  let total = folder.mediaItems.length;

  // Recurse for each child folder
  for (const child of folder.children) {
    total += await getItemCount(child.id);
  }

  // Also count the folders themselves if you consider a folder as an "item"
  total += folder.children.length;

  return total;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const parentIdParam = searchParams.get("parentId");
  const parentId = parentIdParam === "null" ? null : parentIdParam;

  try {
    const folders = await prisma.folder.findMany({
      where: { parentId, status: "PUBLISHED" },
      orderBy: { createdAt: "asc" },
    });

    const mapped = await Promise.all(
      folders.map(async (folder) => {
        const itemCount = await getItemCount(folder.id);
        return {
          id: folder.id,
          name: folder.name,
          imageUrl: folder.image,
          itemCount,
        };
      })
    );

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("❌ GET /api/public/collections error:", err);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}