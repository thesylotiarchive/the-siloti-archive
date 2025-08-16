// src/app/api/admin/dashboard/metrics/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  const user = await getUserFromRequest(req);

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
    const totalSuperAdmins = await prisma.user.count({
      where: { role: "SUPERADMIN" },
    });

    const totalCollections = await prisma.collection.count();
    const totalMedia = await prisma.mediaItem.count();

    // Count by media type (assuming your mediaItem has a "type" field like "image", "video", "audio", "pdf")
    const mediaCounts = await prisma.mediaItem.groupBy({
        by: ["mediaType"],
        _count: { mediaType: true },
      });
      
    const mediaCountsObj = Object.fromEntries(
    mediaCounts.map((m) => [m.mediaType, m._count.mediaType])
    );

    return NextResponse.json({
      metrics: {
        users: totalUsers,
        admins: totalAdmins,
        superadmins: totalSuperAdmins,
        collections: totalCollections,
        mediaItems: totalMedia,
        mediaCounts: mediaCountsObj,
      },
    });
  } catch (e) {
    console.error("GET /api/admin/dashboard/metrics error:", e);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 }
    );
  }
}
