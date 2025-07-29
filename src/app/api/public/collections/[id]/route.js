// app/api/public/collections/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: folder.id,
      name: folder.name,
      imageUrl: folder.image,
      description: folder.description, // You can add if you support it
      parent: folder.parent,
    });
  } catch (err) {
    console.error("GET /api/public/collections/[id] error", err);
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}
