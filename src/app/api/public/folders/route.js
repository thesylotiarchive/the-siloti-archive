import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, image, parentId } = body;

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const created = await prisma.folder.create({
      data: {
        name,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        status: "DRAFT", // Always force user submissions to DRAFT status for curator review
        createdById: user.id,
      },
    });

    return NextResponse.json({ success: true, folder: created });
  } catch (err) {
    console.error("POST /api/public/folders error", err);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
