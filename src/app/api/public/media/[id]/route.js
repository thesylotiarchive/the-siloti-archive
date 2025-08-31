import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  try {
    const media = await prisma.mediaItem.findUnique({
      where: { id: params.id },
    });

    if (!media || media.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (err) {
    console.error("GET /api/public/media/:id", err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

