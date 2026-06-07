// app/api/public/media/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

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
        status: "PUBLISHED", // Only show published media
      },
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
        contributor: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        folder: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    const mapped = media.map((item) => ({ ...item, type: "media" }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/public/media error", err);
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, image, mediaUrl, mediaType, language, author } = body;

    if (!title || !description || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isExternal = mediaUrl?.startsWith("http") && !mediaUrl.includes("utfs.io");

    const created = await prisma.mediaItem.create({
      data: {
        title,
        description,
        image: image || null,
        mediaType,
        language: language || null,
        author: author || null,
        contributorId: user.id,
        status: "DRAFT", // Always force user submissions to DRAFT status for curator review
        fileUrl: isExternal ? null : (mediaUrl || null),
        externalLink: isExternal ? mediaUrl : null,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (err) {
    console.error("POST /api/public/media error", err);
    return NextResponse.json({ error: "Failed to create media item" }, { status: 500 });
  }
}