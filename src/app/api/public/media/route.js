// app/api/public/media/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get("collectionId");

  if (!collectionId) {
    return NextResponse.json({ error: "Missing collectionId" }, { status: 400 });
  }

  try {
    const media = await prisma.mediaItem.findMany({
      where: {
        folderId: collectionId,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        mediaType: true,
        fileUrl: true,
        externalLink: true,
      },
    });

    return NextResponse.json(media);
  } catch (err) {
    console.error("GET /api/public/media error", err);
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 });
  }
}
