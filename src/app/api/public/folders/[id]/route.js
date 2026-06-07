import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Verify ownership
    if (folder.createdById !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this folder" }, { status: 403 });
    }

    // Check status is not PUBLISHED
    if (folder.status === "PUBLISHED") {
      return NextResponse.json({ error: "Cannot delete approved and published folders" }, { status: 400 });
    }

    // Delete folder (Prisma will automatically check constraints, subfolders, etc., but since it's a pending draft, it shouldn't have many dependencies yet)
    await prisma.folder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Folder submission deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/public/folders/:id", err);
    return NextResponse.json({ error: "Failed to delete folder submission" }, { status: 500 });
  }
}
