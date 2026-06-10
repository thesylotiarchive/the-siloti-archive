import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  try {
    const actor = await getUserFromRequest(req);
    if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.contributorRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("GET /api/admin/contributor-requests error", err);
    return NextResponse.json({ error: "Failed to fetch contributor requests" }, { status: 500 });
  }
}
