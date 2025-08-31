// app/api/admin/folders/bulk-delete/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// helper: recursively delete
async function deleteFolderRecursively(folderId) {
  const children = await prisma.folder.findMany({ where: { parentId: folderId } });
  for (const child of children) {
    await deleteFolderRecursively(child.id);
  }
  await prisma.mediaItem.deleteMany({ where: { folderId } });
  await prisma.folder.delete({ where: { id: folderId } });
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    // delete each target (recursive)
    for (const id of ids) {
      // check exists
      const folder = await prisma.folder.findUnique({ where: { id } });
      if (folder) {
        await deleteFolderRecursively(id);
      }
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error("POST /api/admin/folders/bulk-delete error:", err);
    return NextResponse.json({ error: "Failed to delete folders" }, { status: 500 });
  }
}