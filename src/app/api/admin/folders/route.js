import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

// GET all folders (optional: ?parentId=<id>)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId") || null;

  try {
    const folders = await prisma.folder.findMany({
      where: { parentId },
      include: {
        children: true,
        mediaItems: true,
      },
      orderBy: { createdAt: "asc" },
    });

    console.log("Admin Display Folders: ", folders);

    return NextResponse.json(folders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

// POST create a new folder
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && user.role !== "CONTRIBUTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let status = body.status || "DRAFT";

    if (user.role === "CONTRIBUTOR") {
      status = "DRAFT"; // force contributors
    }

    const folder = await prisma.folder.create({
      data: {
        name: body.name,
        parentId: body.parentId || null,
        status,
        createdById: user.id,
      },
    });

    return NextResponse.json(folder);
  } catch (err) {
    console.error("POST /admin/folders error", err);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
