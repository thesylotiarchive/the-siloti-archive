// /src/app/api/admin/media/[id]/move/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await req.json();

    const updated = await prisma.mediaItem.update({
      where: { id: params.id },
      data: { folderId },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error moving media item:", err);
    return NextResponse.json({ error: "Failed to move media item" }, { status: 500 });
  }
}
