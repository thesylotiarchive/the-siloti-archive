import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [mediaItems, folders, blogs] = await Promise.all([
      prisma.mediaItem.findMany({
        where: { contributorId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          folder: {
            select: { name: true }
          }
        }
      }),
      prisma.folder.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: "desc" },
      })
    ]);

    // Format and combine all submission types
    const submissions = [
      ...mediaItems.map(item => ({ ...item, submissionType: "MEDIA" })),
      ...folders.map(item => ({ ...item, submissionType: "FOLDER", title: item.name })),
      ...blogs.map(item => ({ ...item, submissionType: "BLOG" }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(submissions);
  } catch (err) {
    console.error("GET /api/public/media/my-submissions error", err);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

