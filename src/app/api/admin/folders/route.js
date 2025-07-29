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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, image, parentId } = await req.json();

    // Debug log what you're receiving
    console.log("📥 Creating folder with:", { name, description, image, parentId });

    const folder = await prisma.folder.create({
      data: {
        name,
        description,
        image,
        parentId: parentId || null, // Ensure null instead of undefined
      },
    });

    return NextResponse.json(folder);
  } catch (err) {
    console.error("❌ Error creating folder:", err);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
