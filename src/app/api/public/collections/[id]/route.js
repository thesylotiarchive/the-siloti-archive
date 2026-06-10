// app/api/public/collections/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData } from "@/lib/cache";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const folder = await getCachedData(`collection:detail:${id}`, async () => {
      return await prisma.folder.findUnique({
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
    }, 600); // 10 minutes TTL

    if (!folder || folder.status !== "PUBLISHED") {
      // Hide draft folders from public API
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const telemetry = folder?._cacheTelemetry;
    return NextResponse.json({
      id: folder.id,
      name: folder.name,
      imageUrl: folder.image,
      description: folder.description, // optional
      parent: folder.parent,
    }, {
      headers: {
        "x-cache-log": telemetry ? encodeURIComponent(telemetry) : ""
      }
    });
  } catch (err) {
    console.error("GET /api/public/collections/[id] error", err);
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}