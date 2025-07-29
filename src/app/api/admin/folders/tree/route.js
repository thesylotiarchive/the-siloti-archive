import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper to build tree from flat array
function buildFolderTree(folders, parentId = null) {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(folders, folder.id),
    }));
}

export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      orderBy: { createdAt: "asc" },
    });

    const tree = buildFolderTree(folders);
    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error fetching folder tree:", error);
    return NextResponse.json({ error: "Failed to fetch folder tree" }, { status: 500 });
  }
}
