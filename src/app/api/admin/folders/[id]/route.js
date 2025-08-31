import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// PATCH /api/admin/folders/[id] => Update folder
export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && user.role !== "CONTRIBUTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let status = body.status;

    if (user.role === "CONTRIBUTOR") {
      status = "DRAFT"; // contributors always force draft
    }

    const updated = await prisma.folder.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        status,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /admin/folders/[id] error", err);
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 });
  }
}


// GET /api/admin/folders/[id] => Get folder and its contents
export async function GET(req, { params }) {
  try {
    const folderId = params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        parent: {
          include: {
            parent: {
              include: {
                parent: true,
              },
            },
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const subfolders = await prisma.folder.findMany({
      where: { parentId: folderId },
      orderBy: { createdAt: "desc" },
    });

    const mediaItems = await prisma.mediaItem.findMany({
      where: { folderId: folderId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      folder,
      subfolders,
      mediaItems,
    });
  } catch (err) {
    console.error("GET /folders/:id error", err);
    return NextResponse.json({ error: "Failed to fetch folder details" }, { status: 500 });
  }
}

// DELETE /api/admin/folders/[id] => Recursively delete folder and contents
export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folderId = params.id;

    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    await deleteFolderRecursively(folderId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /folders/:id error", err);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}

// Utility: recursively delete subfolders and media items
async function deleteFolderRecursively(folderId) {
  const children = await prisma.folder.findMany({
    where: { parentId: folderId },
  });

  for (const child of children) {
    await deleteFolderRecursively(child.id);
  }

  await prisma.mediaItem.deleteMany({
    where: { folderId: folderId },
  });

  await prisma.folder.delete({
    where: { id: folderId },
  });
}
