// File: /src/app/api/admin/folders/root/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subfolders = await prisma.folder.findMany({
      where: { parentId: null },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      folder: null,         // Root has no folder
      subfolders,
      mediaItems: [],       // No media directly in root
    });
  } catch (err) {
    console.error("GET /folders/root error", err);
    return NextResponse.json({ error: "Failed to load root folders" }, { status: 500 });
  }
}
