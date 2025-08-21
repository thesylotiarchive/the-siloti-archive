// src/app/api/system/cleanup-media-views/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/system/cleanup-media-views
export async function POST() {
  try {
    // Detect if request is from Vercel Cron
    // Vercel adds a special header `x-vercel-cron` when it triggers the job
    const headers = new Headers();
    const isVercelCron = headers.get("x-vercel-cron") !== null;

    if (!isVercelCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete views older than 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const deleted = await prisma.mediaView.deleteMany({
      where: {
        createdAt: { lt: cutoff },
      },
    });

    return NextResponse.json({
      success: true,
      deleted: deleted.count,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
